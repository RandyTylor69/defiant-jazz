// when the user is logging a NEW review

import { RxCross1 } from "react-icons/rx";
import { TfiAngleLeft } from "react-icons/tfi";
import { useLayout } from "../Layout.tsx";
import { useState, useEffect } from "react";
import { addReviewToDB } from "../../utils.ts";
import { useParams, useNavigate } from "react-router-dom";

export default function LogSheetDetail() {
  const [isAtSheetPage, setIsAtSheetPage] = useState(false);
  const navigate = useNavigate();
  const { sheetId } = useParams();

  const {
    setIsLogging,
    setIsLoggingDetail,
    setIsLoggingFinished,
    logTarget,
    setLogTarget,
    uid,
    displayName,
    photoURL,
  } = useLayout();

  // logTarget contains: fullName, title, composer.
  const [ratingBg, setRatingBg] = useState([
    { id: 0, on: false },
    { id: 1, on: false },
    { id: 2, on: false },
    { id: 3, on: false },
    { id: 4, on: false },
    { id: 5, on: false },
    { id: 6, on: false },
    { id: 7, on: false },
    { id: 8, on: false },
    { id: 9, on: false },
  ]);

  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [practicedSince, setPracticedSince] = useState<string>("");

  // Checks if the user is logging a new review or editing an old review.

  useEffect(() => {
    if (sheetId) setIsAtSheetPage(true);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!uid) return;
    addReviewToDB(
      {
        fullName: logTarget.fullName,
        title: logTarget.title,
        composer: logTarget.composer,
        practicedSince: practicedSince,
        rating: rating,
        content: content,
        sheetId: logTarget.sheetId,
        uid: uid,
        displayName: displayName,
        photoURL: photoURL,
      },
      uid
    );
    setIsLoggingDetail(false);
    setIsLoggingFinished(true);
  }

  // -------------- RATING MECHANICS -------------------
  function toggleRating(toggleID: number) {
    // Click on a half-star. All its previous ones (include itself) should light up.
    // All its preceding ones should dim out.

    setRatingBg((prev) => {
      const ratingNum = (toggleID + 1) / 2;
      setRating(ratingNum);
      return prev.map((i) => ({ ...i, on: i.id > toggleID ? false : true }));
    });
  }
  const ratingBgMapped = ratingBg.map((item) => (
    <div
      key={item.id}
      className={`w-[1.2rem] h-full cursor-pointer
    ${item.on ? "bg-amber-600" : "bg-black/20"} `}
      onClick={() => toggleRating(item.id)}
    ></div>
  ));

  // __________________________________________________________________________

  return (
    <div className="inset-0 absolute bg-black/80 backdrop-blur-md z-[999] ">
      <div
        className="absolute w-[90vw] max-w-[40rem] h-fit p-4 pb-16 border-black/20 border-2
                bg-primary text-black/70
                flex flex-col justify-center items-center gap-6
                top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%]"
      >
        <section className="w-full flex justify-between text-black/40 ">
          {isAtSheetPage ? (
            <></>
          ) : (
            <h2
              className=" cursor-pointer"
              onClick={() => {
                setIsLoggingDetail(false);
                setIsLogging(true);
                setLogTarget({
                  fullName: null,
                  title: null,
                  composer: null,
                  sheetId: null,
                });
              }}
            >
              <TfiAngleLeft />
            </h2>
          )}

          <h2
            className=" cursor-pointer"
            onClick={() => {
              setIsLoggingDetail(false);
              setIsLogging(false);
            }}
          >
            <RxCross1 />
          </h2>
        </section>
        <section className="w-full h-full flex flex-col gap-4">
          <div className="w-full flex flex-col">
            <h1 className="text-2xl font-serif">{logTarget.title}</h1>
            <h2 className="text-black/30 italic">{logTarget.composer}</h2>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="w-full flex gap-2 items-center">
              <p className="text-sm text-black/30">Practiced since</p>
              <input
                type="date"
                className="log-date-input"
                value={practicedSince}
                onChange={(e) => setPracticedSince(e.target.value)}
              />
            </div>

            <textarea
              name="content"
              className="log-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="write a review..."
            />

            {/** ---- rating background ----  */}

            <div className="relative flex w-full h-fit ">
              <p className="ml-1 text-sm absolute text-black/30">
                Rate this piece
              </p>
              <div className="absolute w-[7rem] h-[1.3rem] top-6 flex flex-row  ">
                {ratingBgMapped}
              </div>
              <img
                src="/images/log-rating-mask.png"
                alt="rating mask"
                className="absolute w-[7rem] object-cover top-6 pointer-events-none"
              />
              <button className="absolute right-0 top-4 btn-primary !px-3 !py-1">
                Log
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
