// this is the prompt that asks user what sheet they'd like to add to their
// favourite / currently practicing.

import { RxCross1 } from "react-icons/rx";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getSheets, slugify } from "../../utils.ts";
import { useLayout } from "../Layout.tsx";
import { Link } from "react-router-dom";
import { SearchResultType } from "../../types.ts";


export default function LogSheetProfile({
  setIsLoggingProfile,
  isLoggingFavourite,
  setIsLoggingFavourite,
  setFavouritePiece,
  isLoggingCurrentlyPracticing,
  setIsLoggingCurrentlyPracticing,
  setCurrentlyPracticing,
}:any) {
  const [searchParams, setSearchParams] = useState("");
  const [results, setResults] = useState<SearchResultType[] | null>(null);
  const { setIsAnyLogWindowOpen } = useLayout();

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

      // ---- check if user enters empty string
      if(data.query===undefined) return;

      data.query.search.length > 0 && setResults(data.query.search);
      
      // 2. fetch from fb
      const fbResult = await getSheets(searchParams);

      if (!fbResult) return;
      // append results to main results
      for (const sheet of fbResult) {
        setResults((prev: any) => {
          // don't add result if result already exists
          if (prev.find((i: any) => i.title === sheet.fullName)) return prev;

          return [
            ...prev,
            {
              title: sheet.fullName,
            },
          ];
        });
      }
    }
    fetchData();
  }, [searchParams]);

  return (
    <div className="inset-0 absolute bg-black/80 backdrop-blur-md z-[999] h-[100vh]">
      <div
        className="absolute w-[90vw] max-w-[30rem] h-fit p-4 border-black/20 border-2
                bg-primary text-black/70
                flex flex-col justify-center items-center gap-6
                top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%]
                "
      >
        <div className="w-full flex justify-between">
          <h1 className="uppercase font-thin italic text-sm">
            Add a new sheet music...
          </h1>
          <h2
            className="absolute top-4 right-4 text-black/40 cursor-pointer"
            onClick={() => {
              setIsLoggingProfile(false);
              setIsAnyLogWindowOpen(false);
            }}
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
            className="p-2 outline-none w-full font-thin "
            placeholder="Search by title / composer"
            required
          />
          <button type="submit" className="absolute right-2 text-black/20">
            <FaSearch />
          </button>
        </form>
        {/** ----- The collapsed option list ------ */}
        <ul
          className="overflow-y-scroll flex flex-col max-h-[20rem]
        gap-4 w-full mb-4 "
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
                    const newTarget = {
                      fullName: result.title,
                      title: title,
                      composer: composer,
                      sheetId: sheetId,
                    };

                    const clonedLogTarget = structuredClone(newTarget);

                    // add the cloned logTarget to favourite.

                    if (isLoggingFavourite) {
                      setFavouritePiece(clonedLogTarget);
                      console.log(
                        "Adding the following piece to the favourite piece state:",
                        clonedLogTarget
                      );
                    }

                    // add the cloned logTarget to currently practicing.

                    if (isLoggingCurrentlyPracticing) {
                      setCurrentlyPracticing((prev: any) => [
                        ...prev,
                        clonedLogTarget,
                      ]);
                    }
                    setIsLoggingFavourite(false);
                    setIsLoggingCurrentlyPracticing(false);
                    setIsLoggingProfile(false);
                    setIsAnyLogWindowOpen(false);
                  }}
                >
                  {title},{" "}
                  <span className="text-black/30 italic">{composer}</span>
                </li>
              );
            })}
        </ul>
        <Link
          to="/create"
          onClick={() => {
            setIsLoggingProfile(false);
            setIsAnyLogWindowOpen(false);
          }}
          className="absolute bottom-0 w-full bg-black/10
        font-light text-xs text-black/30 px-4 py-1
        "
        >
          <p>Can't find the sheet? Create a it here!</p>
        </Link>
      </div>
    </div>
  );
}
