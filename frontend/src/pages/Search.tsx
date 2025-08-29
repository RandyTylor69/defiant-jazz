import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLayout } from "../components/Layout.tsx";
import { FaBuildingFlag } from "react-icons/fa6";

type SearchItem = {
  title: string;
  composer: string;
};

export default function Search() {
  const [results, setResults] = useState<SearchItem[]>([]);
  const { params } = useParams<{ params: string }>(); // Typing the content of the object returned by useParams()
  const { setLogTarget } = useLayout();
  //const [isSearch, setIsSearching] = useState(false)
  useEffect(() => {
    async function fetchData() {
      if (!params) return;
      //setIsSearching(true)
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_ROUTE}/api/imslp?q=${encodeURIComponent(
          params
        )}`
      );
      const data = await res.json();

      data.query.search != null && setResults(data.query.search);
      //setIsSearching(false)
    }
    fetchData();
  }, []);

  function slugify(fullName: string): string {
    return fullName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .replace(/\s+/g, "-") // replace spaces with dashes
      .replace(/-+/g, "-"); // remove repeated dashes
  }

  // console.log(results)

  return (
    <div
      className="h-fit w-full
    flex flex-col gap-6"
    >
      <p className="text-sm uppercase font-light">
        Search results for "{params}".{" "}
        {results.length > 0 && (
          <span className="text-black/20 italic">
            Make sure to include any accents, such as "Rêverie".
          </span>
        )}
      </p>
      <ul className="">
        {results.length ? (
          results.map((item) => {
            // manually extract the composer name and the title.
            const composer = item.title.includes("(")
              ? item.title.split("(")[1].split(")")[0].trim()
              : "";
            const title = item.title.split("(")[0].trim();
            const sheetId = slugify(item.title);
            return (
              <Link
              key={sheetId}
                to={`/sheet/${sheetId}`}
                state={{ title, composer, sheetId }}
                onClick={() =>
                  setLogTarget({
                    fullName: item.title,
                    title: title,
                    composer: composer,
                    sheetId: sheetId,
                  })
                }
              >
                <li
                  className="py-2 mb-6 text-black/70 border-b-[2px] border-black/10"
                  key={item.title}
                >
                  <h1 className="text-xl font-bold ">{item.title}</h1>
                </li>
              </Link>
            );
          })
        ) : (
          <p className="text-black/20 italic">
            No results :( Make sure to include any accents. For example:
            "Rêverie" instead of "Reverie".
          </p>
        )}
      </ul>
    </div>
  );
}
