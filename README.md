# Editions

Ask questions about any GitHub repo's commit history in plain English.

**Live:** https://repo-knowledge.vercel.app

## How it works
GitHub API → Supabase (Postgres + pgvector) → gemini-embedding-001 (1536d,
RETRIEVAL_DOCUMENT) → cosine similarity via pgvector → gemini-3.6-flash with
retrieved commits as context.

## Numbers
- duration: 2530 ms - 7174 ms
- Cost per query: 0.002
- Corpus: ~65 commits across 4 repos
- Eval pass rate: 20/20

## Evals
20 golden questions with expected commits and required answer terms, plus
grounding cases that must be refused. Runs on every push via GitHub Actions;
build fails below 0.7% pass rate.

