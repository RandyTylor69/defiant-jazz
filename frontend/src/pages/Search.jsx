import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Search() {
  const [results, setResults] = useState(null);
  const { params } = useParams();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `http://localhost:8000/api/imslp?q=${encodeURIComponent(params)}`
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
        Search results for "{params}". <span className="text-black/20 italic">Make sure to include any accents, such as "Rêverie".</span>
      </p>
      <ul className="">
        {results? (results.map((item) => {
          // manually extract the composer name and the title.
          const composer = item.title.includes("(")
            ? item.title.split("(")[1].split(")")[0].trim()
            : "";
          const title = item.title.split("(")[0].trim();
          
          return (
            <Link to={`/sheet/${title}/${composer}`}>
              <li
                className="py-2 mb-6 text-black/70 border-b-[2px] border-black/10"
                key={item.snippet}
              >
                <h1 className="text-xl font-bold ">{item.title}</h1>
              </li>
            </Link>
          );
        })) : <p className="text-black/20 italic">No results :( Make sure to include any accents. For exampe: "Rêverie" instead of "Reverie".</p>}
      </ul>
    </div>
  );
}
