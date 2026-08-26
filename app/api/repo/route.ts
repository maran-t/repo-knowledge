import { db } from "@/lib/db";

// app/api/repo/route.ts
export async function GET(req: Request) {
    const {searchParams} = new URL(req.url)
    const page = Number(searchParams.get('page') ?? 1)
    const per_page = Number(searchParams.get('per_page') ?? 28)

    const from = (page - 1) * per_page;
    const to = page * per_page - 1;
    
    const { data, count } = await db.from('commits').select('*', { count: 'exact' }).range(from, to);
    return Response.json({ data, count });
    // const { searchParams } = new URL(req.url);
    // const query = searchParams.get("q");

    // if (!query) {
    //     return Response.json({ error: "repo name is required"}, {status: 400});
    // }

    // const res = await fetch(`https://api.github.com/repos/${query}/commits?per_page=100`);
    // const commits = await res.json();

    // const { error } = await db.from("commits").upsert(commits.map((c) => ({
    //     repo: query,
    //     sha: c.sha,
    //     message: c.commit.message,
    //     author: c.commit.author.name || null,
    //     committed_at: new Date(c.commit.committer.date) || null
    // })), { onConflict: "repo,sha" });

    // if (error) return Response.json({ error: error.message }, { status: 500 });
    // if (!res.ok) {
    //     return Response.json({ error: "GitHub request failed" }, { status: res.status });
    // }
    // return Response.json(commits);
}
