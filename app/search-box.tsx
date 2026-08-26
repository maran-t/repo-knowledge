"use client";
import { useEffect, useState } from "react";

export default function SearchBox() {
  const [repo, setRepo] = useState("");
  const [data, setData] = useState(null); // ingest response
  const [count, setCount] = useState(0);
  const [repoData, setRepoData] = useState(null); // repo data from db
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(14);
  const [query, setQuery] = useState("")
  const [searchResult, setSearchResult] = useState("")
  const [loading, setLoading] = useState(true);
  const [ingesting, setIngesting] = useState(false);
  const [searching, setSearching] = useState(false);

  const load = () => {
    setIngesting(true);
    fetch(`/api/ingest`, {method: 'post', body: JSON.stringify({q: repo}), headers: {'Content-Type': 'application/json'}})
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setIngesting(false));
  }

  const showDB = () => {
    fetch(`/api/repo?page=${page}&per_page=${perPage}`)
      .then(res => res.json())
      .then(setRepoData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }


  const search = () => {
    setSearching(true);
    fetch(`/api/search`, {method: 'post', body: JSON.stringify({query, repo}), headers: {'Content-Type': 'application/json'}})
      .then(res => res.json())
      .then((data) => setSearchResult(data.data))
      .catch(console.error)
      .finally(() => setSearching(false));
  }

  useEffect(() => {
    showDB();
  }, [page]);

  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then((res) => { setCount(res.data.length); })
      .catch(console.error);
  }, [data]);

  const rows = repoData?.data ?? [];
  const shownRepos = [...new Set(rows.map((r) => r.repo))];

  return <div className="workspace">
    <aside className="sidebar">
      <h1 className="wordmark">Editions</h1>

      <div className="search-panel">
        <input value={repo} onChange={e => setRepo(e.target.value)} placeholder="Enter repo name" className="search-input" />
        <div className="button-row" style={{width: '200px'}}>
          <button className="btn btn-primary" disabled={ingesting} onClick={load}>{ingesting ? "Ingesting" : "Ingest"}</button>
          {/* <button className="btn" onClick={showDB}>Show DB</button> */}
        </div>
      </div>

      {/* <p>Count: {count}</p> */}
      {
        ingesting ? (
          <div className="status-message" aria-busy="true">
            <span className="skeleton skeleton-line" />
          </div>
        ) : data?.message && (
          <div className="status-message">
            {data?.message}
          </div>
        )
      }

      <div className="search-panel mt-4">
        <input placeholder="Wanna get info in commits ..." value={query} onChange={(e) => setQuery(e.target.value)} className="search-input" />
        <div className="button-row" style={{width: '200px'}}>
          <button className="btn btn-primary" disabled={searching} onClick={search}>{searching ? "Finding" : "Find"}</button>
          {/* <button className="btn" onClick={showDB}>Show DB</button> */}
        </div>
      </div>

      {
        searching ? (
          <div className="answer" aria-busy="true">
            <span className="skeleton skeleton-line" />
            <span className="skeleton skeleton-line" />
            <span className="skeleton skeleton-line" />
            <span className="skeleton skeleton-line" />
          </div>
        ) : searchResult && (
          <div className="answer">{searchResult}</div>
        )
      }

      {
        !searching && !searchResult && (
          <div className="mt-8" style={{color: '#666', fontSize: '14px'}}>
            <p>This is a simple demo of how to use embeddings to search through commit messages in a GitHub repository. You can ingest the commits of a repo and then search for specific information within those commits.</p>

            <br />
            <p>Search for a query to get information from the ingested commits.</p>
            <p>For example, you can try queries like:</p>
            <ul>
              <li>`fix bug`</li>
              <li>`add feature`</li>
              <li>`refactor code`</li>
              <li>`update documentation`</li>
            </ul>
          </div>
        )
      }
   
    </aside>

    <main className="content">
      {
        loading ? <div className="results" aria-busy="true">
          <header className="section-head">
            <h2 className="section-title">Knowledge log</h2>
            <p className="section-meta">
              <span className="skeleton skeleton-meta" />
            </p>
          </header>

          <table className="repo-table skeleton-table" aria-hidden="true">
            <tbody>
            {
              Array.from({ length: perPage }).map((_, i) => {
                return <tr key={i}>
                  <td><span className="skeleton" /></td>
                  <td><span className="skeleton" /></td>
                  <td><span className="skeleton" /></td>
                  <td><span className="skeleton" /></td>
                  <td><span className="skeleton" /></td>
                </tr>
              })
            }
            </tbody>
          </table>
        </div>
        : (repoData?.data) && <div className="results">
          <header className="section-head">
            <h2 className="section-title">Knowledge log</h2>
            <p className="section-meta">
              <span>{rows.length} of {repoData?.count} commits</span>
              {shownRepos.length > 0 && <span className="section-meta-repos">{shownRepos.join(", ")}</span>}
            </p>
          </header>

          <table className="repo-table">
            <tbody>
            {
              repoData?.data?.map((repo, i) => {
                return <tr key={i}>
                  <td>{repo.repo}</td>
                  <td>{repo.sha}</td>
                  <td title={repo.message} style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{repo.message}</td>
                  <td>{repo.author}</td>
                  <td>{repo.committed_at}</td>
                </tr>
              })
            }
            </tbody>
          </table>

          <div className="pager">
            <span className="mr-4">Page: {page} | Per Page: {perPage}</span>
            <button disabled={page === 1} className="btn mr-4" onClick={() => { setLoading(true); setPage(page - 1); }}> {'< '} &nbsp; Prev </button>
            <button disabled={page * perPage >= repoData?.count} className="btn" onClick={() => { setLoading(true); setPage(page + 1); }}> Next &nbsp; {' >'} </button>
          </div>
        </div>
      }
    </main>
  </div>;
}
