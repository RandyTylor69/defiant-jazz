import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLayout } from "../components/Layout.tsx";
import { getSheets, slugify } from "../utils.ts";

export default function Search() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { params } = useParams<{ params: string }>(); // Typing the content of the object returned by useParams()
  const { setLogTarget } = useLayout();
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      if (!params) return;
      // We will search from 2 databases.
      // 1. The IMSLP API.
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_ROUTE}/api/imslp?q=${encodeURIComponent(
          params
        )}`
      );

      const data = await res.json();

      data.query.search != null && setResults(data.query.search); // returns up to 50 results.

      // 2. Search from our own firebase database. Look for sheet documents with the same name.
      const fbResult = await getSheets(params);

      console.log(fbResult);

      if (!fbResult) return;
      // append results to main results
      for (const sheet of fbResult) {
        setResults((prev) => [
          ...prev,
          {
            title: sheet.fullName,
          },
        ]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  console.log(results);

  if (loading) return <h1>Loading</h1>;
  return (
    <div
      className={`h-fit w-full mt-10 md:mt-0 
    flex flex-col gap-6`}
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
          results.map((item, index) => {
            // manually extract the composer name and the title.
            const composer = item.title.includes("(")
              ? item.title.split("(")[1].split(")")[0].trim()
              : "";
            const title = item.title.split("(")[0].trim();
            const sheetId = slugify(item.title);
            return (
              <Link
                key={index}
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
                <li className="py-2 mb-6 text-black/70 border-b-[2px] border-black/10">
                  <h1 className="text-xl font-bold ">{item.title}</h1>
                </li>
              </Link>
            );
          })
        ) : (
          <div className="flex flex-col gap-2 text-black/20 italic">
            <p>
              No results, make sure to include any accents. For example:
              "Rêverie" instead of "Reverie".
            </p>
            <Link to={"/create"} className="underline">
              Alternatively, you can add a new sheet here.
            </Link>
          </div>
        )}
      </ul>
    </div>
  );
}
