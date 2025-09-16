import { useState } from "react";
import { useLayout } from "../components/Layout.tsx";
import { createSheetDoc, slugify } from "../utils.ts";
import { LogTargetType } from "../types.ts";
import { useNavigate } from "react-router-dom";

export default function CreateSheet() {
  const [title, setTitle] = useState("");
  const [composer, setComposer] = useState("");
  const navigate = useNavigate()

  const {setLogTarget} = useLayout()
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fullName = title + " (" + composer + ")";
    const sheetId = slugify(fullName);


    const newLogTarget : LogTargetType = {
        fullName, title, composer, sheetId
    }
    createSheetDoc(newLogTarget)

    alert("Sheet Created!")

    setLogTarget(newLogTarget)

    navigate(`/sheet/${sheetId}`, {state:{title, composer}})
  }  
  
  

  return (
    <div className="h-full w-full ">
      <form onSubmit={handleSubmit} className="flex flex-col gap-12">
        <article className="text-black/70 font-light">
          <h1 className="font-bold italic">Create new sheet</h1>
          <p className="text-sm">
            Want to log a sheet, but couldn't find it in our database? Create it
            here, you'll be doing the community a huge favour!
          </p>
        </article>
        {/** ----- title ------- */}

        <div className="flex flex-col gap-4">
          <p className="small-titletext-uppercase">Title</p>
          <input
            type="text"
            className="general-text-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A Rube Goldberg Winter"
            required
          />
        </div>

        {/** ----- composer ------- */}

        <div className="flex flex-col gap-4">
          <p className="small-titletext-uppercase">Composer</p>
          <input
            type="text"
            className="general-text-input"
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
            placeholder="Last name, First name"
            required
          />
        </div>

        {/** ----- submit btn ------- */}

        <button className="btn-primary w-fit" type="submit">
          Add new +
        </button>
      </form>
    </div>
  );
}
