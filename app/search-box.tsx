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

  const load = () => {
    fetch(`/api/ingest`, {method: 'post', body: JSON.stringify({q: repo}), headers: {'Content-Type': 'application/json'}})
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }

  const showDB = () => {
    fetch(`/api/repo?page=${page}&per_page=${perPage}`)
      .then(res => res.json())
      .then(setRepoData)
      .catch(console.error);
  }


  const search = () => {
    fetch(`/api/search`, {method: 'post', body: JSON.stringify({query, repo}), headers: {'Content-Type': 'application/json'}})
      .then(res => res.json())
      .then((data) => setSearchResult(data.data))
      .catch(console.error);
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
          <button className="btn btn-primary" onClick={load}>Ingest</button>
          {/* <button className="btn" onClick={showDB}>Show DB</button> */}
        </div>
      </div>

      {/* <p>Count: {count}</p> */}
      {
        data?.message && (
          <div className="status-message">
            {data?.message}
          </div>
        )
      }

      <div className="search-panel mt-4">
        <input placeholder="Wanna get info in commits ..." value={query} onChange={(e) => setQuery(e.target.value)} className="search-input" />
        <div className="button-row" style={{width: '200px'}}>
          <button className="btn btn-primary" onClick={search}>Find</button>
          {/* <button className="btn" onClick={showDB}>Show DB</button> */}
        </div>
      </div>

      <span>{searchResult}</span>
    </aside>

    <main className="content">
      {
        (repoData?.data) && <div className="results">
          <header className="section-head">
            <h2 className="section-title">Commit log</h2>
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
                  <td>{repo.author}</td>
                  <td>{repo.committed_at}</td>
                </tr>
              })
            }
            </tbody>
          </table>

          <div className="pager">
            <span className="mr-4">Total Rows: {repoData?.count} | Page: {page} | Per Page: {perPage}</span>
            <button disabled={page === 1} className="btn mr-4" onClick={() => setPage(page - 1)}> {'< '} &nbsp; Prev </button>
            <button disabled={page * perPage >= repoData?.count} className="btn" onClick={() => setPage(page + 1)}> Next &nbsp; {' >'} </button>
          </div>
        </div>
      }
    </main>
  </div>;
}
