import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useLayout } from "../components/Layout.tsx";
import { updateReview } from "../firebase/database.ts";
import { ReviewType } from "../firebase/database.ts";
import { FaRegUserCircle } from "react-icons/fa";

export default function Sheet() {
  const location = useLocation();
  const { sheetId } = useParams(); // not passed from state
  const { title, composer } = location.state;
  const { uid, setIsEditingLogDetail, setIsLoggingDetail, setLogTarget } =
    useLayout();
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviewId, setReviewId] = useState("");
  const [reviews, setReviews] = useState<ReviewType[]>([]);
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
    // ___________________________________________
    //
    // This hook contains 3 functions.
    //
    // ---> 1. Fetch review from the current user.
    // ---> 2. Fetch all reviews for this sheet.
    // ---> 3. Set logging target for this sheet.
    // ___________________________________________

    async function fetchUserReview() {
      const reviewQuery = query(
        // location: fetching from the "reviews" collection
        collection(db, "reviews"),
        // fetch the review from the user
        where("uid", "==", uid),
        where("sheetId", "==", sheetId)
      );

      const reviewSnapshot = await getDocs(reviewQuery);
      if (reviewSnapshot.empty) {
        console.log("The user hasn't reviewed this sheet yet.");
      } else {
        setHasReviewed(true);

        reviewSnapshot.forEach((review) => {
          setReviewId(review.id);
          setRatingBg((prev) => {
            return prev.map((i) => ({
              ...i,
              on: i.id < review.data().rating * 2 ? true : false,
            }));
          });
        });
      }
    }

    async function fetchAllReviews() {
      const reviewsQuery = query(
        // location: fetching from the "reviews" collection
        collection(db, "reviews"),
        // fetch all reviews.
        where("sheetId", "==", sheetId)
      );

      const reviewsSnapshot = await getDocs(reviewsQuery);
      if (reviewsSnapshot.empty) {
        console.log("No one has reviewed this sheet yet.");
      } else {
        reviewsSnapshot.forEach((review) => {
          setReviews((prev) => [...prev, review.data() as ReviewType]);
        });
      }
    }

    if (uid) fetchUserReview();
    fetchAllReviews();

    // set logTarget's sheetId field when the window reloads.
    // else react will forget what logTarget has.
    if (!sheetId) return;
    setLogTarget((prev) => ({ ...prev, sheetId, title, composer }));
  }, []);

  function toggleRating(toggleID: number) {
    // Click on a half-star. All its previous ones (include itself) should light up.
    // All its preceding ones should dim out.

    setRatingBg((prev) =>
      prev.map((i) => ({ ...i, on: i.id > toggleID ? false : true }))
    );

    const newRating = (toggleID + 1) / 2;

    if (hasReviewed) {
      updateReview(reviewId, { rating: newRating });
    }
  }

  const ratingBgMapped = ratingBg.map((item) => (
    <div
      key={item.id}
      className={`w-[1.2rem] h-full cursor-pointer
    ${item.on ? "bg-amber-600" : "bg-black/10"} `}
      onClick={() => {
        toggleRating(item.id);
      }}
    ></div>
  ));

  console.log(reviews[0]);

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
          <p>{composer}</p>
        </article>
        <div className="flex flex-col h-[8rem] w-full max-w-[20rem] bg-secondary">
          <div
            className="w-full py-2 h-[50%]
             flex justify-center items-center border-black/10 border-b-[2px] text-black/70"
          >
            <button
              onClick={() =>
                hasReviewed
                  ? setIsEditingLogDetail(true)
                  : setIsLoggingDetail(true)
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
          <h1>
            Reviews {`(`}
            {reviews.length}
            {`)`}
          </h1>
        </div>
        <ul className="w-full h-fit flex flex-col gap-4 ">
          {reviews.map((review) => {
            return (
              <li
                className="w-full h-fit
            flex flex-col md:flex-row gap-6
             pb-4"
                key={review.uid}
              >
                {/** --- div with user info --- */}
                <div
                  className="w-full md:max-w-[5rem]
                 flex md:flex-col gap-2 "
                >
                  {review.photoURL ? (
                    <img
                      className="size-12 object-cover rounded-[50%]"
                      src={`${review.photoURL}`}
                      alt="user profile picture"
                    />
                  ) : (
                    <div>
                      <FaRegUserCircle  className="size-10 text-black/70"/>
                    </div>
                  )}
                  <p className="text-sm text-black/70 ">{review.displayName ? review.displayName : "Anonymous"}</p>
                </div>
                {/** --- div with comment --- */}
                <article
                  className="w-full fit gap-2
                flex flex-col justify-between "
                >
                  <div className="w-full flex justify-between text-black/30 text-sm">
                    <p>{review.rating}/5</p>
                    <p>{review.creationDate?.slice(0, -14)}</p>
                  </div>
                  <p className="text-black/70 border-black/10 border-b-2 pb-4">
                    {review.content}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

// <img src="/images/rating-mask.png" alt="rating mask" className="absolute w-[12rem] object-cover top-2" />
