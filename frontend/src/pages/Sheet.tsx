import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { DocumentData } from "firebase/firestore";

import { useLayout } from "../components/Layout.tsx";
import {
  fetchUserReview,
  fetchAllReviews,
  toggleRating,
  getSheetBySheetId,
} from "../utils.ts";

import Review from "../components/Review.tsx";
import { SheetType } from "../types.ts";

export default function Sheet() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sheetId } = useParams(); // not passed from state
  const { title, composer } = location.state;
  const {
    uid,
    setIsEditingLogDetail,
    setIsLoggingDetail,
    setLogTarget,
    isLoggedIn,
    logTarget,
  } = useLayout();
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviewId, setReviewId] = useState("");
  const [sheetInfo, setSheetInfo] = useState<SheetType | null>(null);
  const [reviews, setReviews] = useState<DocumentData[]>([]);
  const [authorProfileURLs, setAuthorProfileURLs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    setIsLoading(true);

    // ___________________________________________
    //
    // This hook contains 3 functions.
    //
    // ---> 1. Fetch review from the current user.
    // ---> 2. Fetch all reviews for this sheet.
    // ---> 3. Set logging target for this sheet.
    // ___________________________________________

    // 1.
    async function fetchFunction() {
      if (uid)
        fetchUserReview(
          uid,
          sheetId as string,
          setHasReviewed,
          setReviewId,
          setRatingBg
        );
      // 2.
      fetchAllReviews(sheetId as string, setAuthorProfileURLs, setReviews);

      // 3.
      // set logTarget's sheetId field when the window reloads.
      // else react will forget what logTarget has.
      if (!sheetId) return;
      setLogTarget((prev) => ({ ...prev, sheetId, title, composer }));

      // 4. Fetch the sheet itself for fields not contained in "logTarget"
      if (!logTarget) return;

      console.log("logTarget: ", logTarget);

      const extraSheetInfoResult = await getSheetBySheetId(sheetId);
      setSheetInfo(extraSheetInfoResult);
      setIsLoading(false);
    }

    fetchFunction();
  }, []);

  const ratingBgMapped = ratingBg.map((item, index) => (
    <div
      key={index}
      className={`w-[1.2rem] h-full cursor-pointer
    ${item.on ? "bg-amber-600" : "bg-black/10"} `}
      onClick={() => {
        toggleRating(item.id, setRatingBg, hasReviewed, reviewId);
      }}
    ></div>
  ));

  console.log(reviews);

  if (isLoading) return <h1>Loading...</h1>;
  return (
    <div
      className="w-full h-fit
        flex flex-col gap-20 "
    >
      {/** ---- info + review section ---- */}
      <section className="flex flex-col gap-12 md:flex-row md:justify-between">
        <article
          className="w-full h-fit mr-5
            flex flex-col gap-6 text-black/70"
        >
          <h1 className="text-2xl md:text-4xl">{title}</h1>
          <p>{logTarget.composer}</p>
          <p className="text-black/20 italic font-light">
            Played by {sheetInfo?.reviewCount}
          </p>
        </article>
        <div className="flex flex-col h-[8rem] w-full max-w-[20rem] bg-secondary">
          <div
            className="w-full py-2 h-[50%]
             flex justify-center items-center border-black/10 border-b-[2px] text-black/70"
          >
            <button
              onClick={() =>
                isLoggedIn
                  ? hasReviewed
                    ? setIsEditingLogDetail(true)
                    : setIsLoggingDetail(true)
                  : navigate("/")
              }
            >
              {hasReviewed ? "Edit your activity" : "Review or log..."}
            </button>
          </div>
          {/**  ----- rating stars ------- */}
          <div className="relative flex justify-center items-center">
            <div className="absolute w-[12rem] h-[2.2rem] top-2 flex flex-row ">
              {ratingBgMapped}
            </div>
            <img
              src="/images/rating-mask.png"
              alt="rating mask"
              className="absolute w-[12rem] object-cover top-2 pointer-events-none"
            />
          </div>
        </div>
      </section>

      {/**  ==================================================== */}
      {/**  ===============[ Reviews Section ]================= */}
      {/**  ==================================================== */}
      <section
        className="w-ful h-fit
      border-black/10 border-t-2
      flex flex-col gap-4
      "
      >
        <div className="text-black/20 italic font-light">
          <h1>Reviews</h1>
        </div>
        <ul className="w-full h-fit flex flex-col gap-4 ">
          {reviews.map((review, index) => {
            return (
              <Review
                reviewData={review.reviewData}
                reviewId={review.reviewId}
                index={index}
                authorProfileURLs={authorProfileURLs}
                key={index}
                authorSheetsTotal={review.authorSheetsTotal}
              />
            );
          })}
        </ul>
      </section>
    </div>
  );
}

// <img src="/images/rating-mask.png" alt="rating mask" className="absolute w-[12rem] object-cover top-2" />
