import { useLayout } from "../Layout.tsx";
import { Link } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { useEffect, useState } from "react";

export default function LogFinish() {
  const {
    setIsLoggingDetail,
    setIsLoggingFinished,
    logTarget,
    isLoggingFinished,
  } = useLayout();
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => setShow(true), 50);
  });
  return (
    <div
      className={`absolute w-full max-w-[55rem]
         h-fit p-6 -top-1
        left-[50%] -translate-x-[50%] -translate-y-[100%]
        duration-500 transition-transform
        bg-primary/80 backdrop-blur-md border-2
        border-black/70 text-black/70
        flex flex-col sm:flex-row justify-between 
        ${show ? `translate-y-[0]` : ``}
        `}
    >
      <p>
        <Link
          to={`/sheet/${logTarget.sheetId}`}
          className="underline italic"
          state={{ title: logTarget.title, composer: logTarget.composer }}
          onClick={() => setIsLoggingFinished(false)}
        >
          {logTarget.title}
        </Link>
        {` `}
        has been added to your history!
      </p>

      <button onClick={() => setIsLoggingFinished(false)}>
        <RxCross1 />
      </button>
    </div>
  );
}
