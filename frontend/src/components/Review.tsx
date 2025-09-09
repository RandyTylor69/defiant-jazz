// individual review under a sheet
import { Link } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa6";
import { FaRegThumbsUp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import {
  getIfLikedReview,
  getLikesFromReview,
  likeReview,
  unlikeReview,
} from "../utils.ts";
import { useLayout } from "./Layout.tsx";
export default function Review({
  reviewData,
  reviewId,
  index,
  authorProfileURLs,
}) {
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const { uid } = useLayout();

  useEffect(() => {
    async function reviewInit() {
      // get total likes count for this review
      const likesResult = await getLikesFromReview(reviewId);
      // get if user has liked the review
      const hasLikedResult = await getIfLikedReview(reviewId, uid as string);
      setLikes(likesResult);
      setHasLiked(hasLikedResult);
    }
    reviewInit();
  }, []);

  return (
    <li
      className="w-full h-fit
            flex flex-col md:flex-row gap-6
             pb-4"
      key={reviewData.uid}
    >
      {/** --- div with user info --- */}
      <Link
        to={`/${reviewData.uid}`}
        className="w-full md:max-w-[5rem]
                 flex md:flex-col gap-2 "
      >
        <img
          className="size-12 object-cover rounded-[50%]"
          src={`${authorProfileURLs[index]}`}
          alt="user profile picture"
        />

        <p className="text-sm text-black/70 ">
          {reviewData.displayName ? reviewData.displayName : "Anonymous"}
        </p>
      </Link>
      {/** --- div with comment --- */}
      <article
        className="w-full fit gap-2
                flex flex-col justify-between
                 border-black/10 border-b-2 pb-4"
      >
        <div className="w-full flex justify-between text-black/30 text-sm">
          <p>{reviewData.rating}/5</p>
          <p>{reviewData.creationDate?.slice(0, -14)}</p>
        </div>
        <p className="text-black/70">{reviewData.content}</p>
        <div className="w-full ">
          <p className="flex flex-row gap-2 items-center text-black/70 font-light">
            {/** --- like comment --- */}
            <button
              onClick={() => {
                setHasLiked((prev) => !prev);
                if (hasLiked) {
                  unlikeReview(reviewId, uid as string);
                  setLikes((prev) => prev - 1);
                } else {
                  likeReview(reviewId, uid as string);
                  setLikes((prev) => prev + 1);
                }
              }}
              className="text-black/30"
            >
              {hasLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
            </button>
            {likes} {likes > 1 ? "like" : "likes"}
          </p>
        </div>
      </article>
    </li>
  );
}
