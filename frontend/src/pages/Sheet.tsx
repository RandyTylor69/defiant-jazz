import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useLayout } from "../components/Layout.tsx";

export default function Sheet() {
  const location = useLocation();
  const { sheetId } = useParams(); // not passed from state
  const { title, composer } = location.state;
  const { uid, setIsEditingLogDetail, setIsLoggingDetail, logTarget , setLogTarget} = useLayout();

  // FINAL STATES
  const [hasReviewed, setHasReviewed] = useState(false);
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

  // Fetch for user's review + rating from db
  useEffect(() => {
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
        setHasReviewed(true)
        /* reviewSnapshot.forEach((review) => {
          console.log(review.data());
        }); */
      }
    }

    fetchUserReview();

    // set logTarget's sheetId field when the window reloads.
    // else react will forget what logTarget has.
    if(!sheetId) return
    setLogTarget(prev=>({...prev, sheetId, title, composer}))
  }, []);

  function toggleRating(toggleID: number) {
    // Click on a half-star. All its previous ones (include itself) should light up.
    // All its preceding ones should dim out.

    setRatingBg((prev) =>
      prev.map((i) => ({ ...i, on: i.id > toggleID ? false : true }))
    );
  }

  const ratingBgMapped = ratingBg.map((item) => (
    <div
      key={item.id}
      className={`w-[1.2rem] h-full cursor-pointer
    ${item.on ? "bg-amber-600" : "bg-black/10"} `}
      onClick={() => toggleRating(item.id)}
    ></div>
  ));

  return (
    <div
      className="w-full h-fit
        flex flex-col gap-12 "
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
            <button onClick={()=>hasReviewed? setIsEditingLogDetail(true) : setIsLoggingDetail(true)}>
              {hasReviewed ? "Edit your activity" : "Review or log..."}
            </button>
          </div>
          {/** ---- rating background ----  */}
          <div className="relative flex justify-center items-center">
            <div className="absolute w-[12rem] h-[2.3rem] top-2 flex flex-row ">
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
      {/** ---- comments section ---- */}
      <section></section>
    </div>
  );
}

// <img src="/images/rating-mask.png" alt="rating mask" className="absolute w-[12rem] object-cover top-2" />
