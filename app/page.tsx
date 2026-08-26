import Image from "next/image";
import SearchBox from './search-box'

export default async function Home() {
    // const res = await fetch("https://api.github.com/repos/facebook/react");
    // const repo = await res.json();
    return <>
      <SearchBox />
    </>;
}
