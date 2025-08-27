import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

type SearchItem = {
  title:string;
  composer:string;
}

export default function Search() {

  const [results, setResults] = useState<SearchItem[]>([]);
  const { params } = useParams<{params:string}>(); // Typing the content of the object returned by useParams()

  useEffect(() => {
    async function fetchData() {
      if(!params) return;
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_ROUTE}/api/imslp?q=${encodeURIComponent(params)}`
      );
      const data = await res.json();


      data.query.search.length>0 && setResults(data.query.search);
    }
    fetchData();
  }, []);

  //console.log(results)

  return (
    <div
      className="h-fit w-full
    flex flex-col gap-6"
    >
      <p className="text-sm uppercase font-light">
        Search results for "{params}". { results && <span className="text-black/20 italic">Make sure to include any accents, such as "Rêverie".</span>}
      </p>
      <ul className="">
        {results.length > 0 ? (results.map((item)=> {
          // manually extract the composer name and the title.
          const composer = item.title.includes("(")
            ? item.title.split("(")[1].split(")")[0].trim()
            : "";
          const title = item.title.split("(")[0].trim();
          
          return (
            <Link to={`/sheet/${title}/${composer}`}>
              <li
                className="py-2 mb-6 text-black/70 border-b-[2px] border-black/10"
                key={item.title}
              >
                <h1 className="text-xl font-bold ">{item.title}</h1>
              </li>
            </Link>
          );
        })) : <p className="text-black/20 italic">No results :( Make sure to include any accents. For example: "Rêverie" instead of "Reverie".</p>}
      </ul>
    </div>
  );
}
