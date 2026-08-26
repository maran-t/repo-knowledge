import { CHAT_IN, CHAT_OUT } from "@/lib/cost";
import { db } from "@/lib/db";
import { embedText } from "@/lib/embed"
import { google } from "@ai-sdk/google";
import { streamText } from "ai";


export async function POST(req: Request) {
    const {query, repo} = await req.json()
    if (!query || !repo) {
        return Response.json({error: 'query and repo are required'}, {status: 400})
    }
    const t0 = Date.now();

    const queryEmbedding = await embedText([query], "RETRIEVAL_QUERY");

    const { data: commits, error } = await db.rpc("match_commits", {
        query_embedding: queryEmbedding[0],
        match_repo: repo,
        match_count: 10,
    })

    const context = commits
    .map((c) => `[${c.sha.slice(0, 7)}]  ${c.author}: ${c.message}`)
    .join("\n\n");


    const result = streamText({
        model: google("gemini-3.6-flash"),
        system: `You answer questions about a codebase using its commit history.
    Use ONLY the commits below. If they don't contain the answer, say so — do not guess.
    Cite the short SHA in brackets when referencing a commit.

    COMMITS:
    ${context}`,
        messages: [{ role: "user", content: query }],
    });

    let text = "";
    for await (const chunk of result.textStream) {
        text += chunk;
    }

    const usage = await result.usage;

    console.log(JSON.stringify({
        repo,
        totalMs: Date.now() - t0,
        costUsd: +(((usage.inputTokens || 0) * CHAT_IN + (usage.outputTokens || 0) * CHAT_OUT) / 1e6).toFixed(3),
        topSimilarity: commits[0]?.similarity || null,
    }));

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ data: text });
}