import { db } from "@/lib/db";
import { embedText } from "@/lib/embed";


export async function POST(req: Request) {
    // const { searchParams } = new URL(req.url);
    const repo = req.body && (await req.json()).q;

    if (!repo) return Response.json({error: 'Missing repo name'}, {status: 400});

    const res = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=100`);
    const commits = await res.json()

    const embeddings = await embedText(commits.map(v => v.commit.message).filter(Boolean), "RETRIEVAL_DOCUMENT");
    
    const { error } = await db.from('commits').upsert(commits.map(((c, i) => ({
        repo: repo,
        sha: c.sha,
        message: c.commit.message,
        author: c.commit.author.name || null,
        committed_at: new Date(c.commit.committer.date) || null,
        embedding: embeddings[i] || null
    }))), { onConflict: 'repo,sha'})

    if (error) return Response.json({error: error?.message}, {status: 500});
    return Response.json({message: 'Ingested Successfully'})
}