import { RxCross1 } from "react-icons/rx";
import { FaSearch } from "react-icons/fa";
import { useLayout } from "../Layout.tsx";
import { useState, useEffect } from "react";

type SearchResultType = {
  ns: number;
  title: string;
  snippet: string;
  timestamp: string;
  size: number;
  wordcount: number;
};

export default function LogSheet() {
  const [searchParams, setSearchParams] = useState("");
  const [results, setResults] = useState<SearchResultType[] | null>(null);

  const { setIsLogging, setIsLoggingDetail, setLogTarget, slugify } =
    useLayout();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    window.location.reload();
  }

  useEffect(() => {
    async function fetchData() {
      if (!searchParams) return;
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_ROUTE}/api/imslp?q=${encodeURIComponent(
          searchParams
        )}`
      );
      const data = await res.json();

      data.query.search.length > 0 && setResults(data.query.search);
    }
    fetchData();
  }, [searchParams]);

  return (
    <div className="inset-0 absolute bg-black/80 backdrop-blur-md z-[999] ">
      <div
        className="absolute w-[90vw] max-w-[30rem] h-fit p-4 border-black/20 border-2
                bg-primary text-black/70
                flex flex-col justify-center items-center gap-6
                top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%]
                "
      >
        <div className="w-full flex justify-between">
          <h1 className="uppercase text-sm font-thin italic">
            Add a sheet music to your repetoire...
          </h1>
          <h2
            className="absolute top-4 right-4 text-black/40 cursor-pointer"
            onClick={() => setIsLogging(false)}
          >
            <RxCross1 />
          </h2>
        </div>

        <form
          className="relative flex justify-center items-center w-full"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={searchParams}
            onChange={(e) => setSearchParams(e.target.value)}
            className="p-2 outline-none w-full font-thin"
            placeholder="Remember to include the accent in the title :)"
            required
          />
          <button type="submit" className="absolute right-2 text-black/20">
            <FaSearch />
          </button>
        </form>

        <ul
          className="overflow-y-scroll flex flex-col max-h-[20rem]
        gap-4 w-full "
        >
          {results &&
            results.map((result: SearchResultType) => {
              const composer = result.title.includes("(")
                ? result.title.split("(")[1].split(")")[0].trim()
                : "";
              const title = result.title.split("(")[0].trim();
              const sheetId = slugify(result.title);
              return (
                <li
                  className="hover:bg-black/30 duration-200 cursor-pointer px-2 py-1"
                  onClick={() => {
                    setIsLogging(false);
                    setIsLoggingDetail(true);
                    setLogTarget({
                      fullName: result.title,
                      title: title,
                      composer: composer,
                      sheetId: sheetId,
                    });
                  }}
                >
                  {title},{" "}
                  <span className="text-black/30 italic">{composer}</span>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
