import { useEffect, useState } from "react";
import { weeklyPopular } from "../../data";
import { getCommunityFavourites, getFollowingReviews } from "./CommUtils.ts";
import { Link } from "react-router-dom";
import { DocumentData } from "firebase/firestore";
import { slugify } from "../../utils.ts";
import { useLayout } from "../../components/Layout.tsx";
import { ReviewType } from "../../types.ts";

export default function Dashboard() {
  // temp mapping for "popular this week"
  const [loading, setLoading] = useState(false);
  const { uid, setLogTarget } = useLayout();
  const [communityFavourites, setCommunityFavourites] = useState<
    DocumentData[]
  >([]);
  const [followingReviews, setFollowingReviews] = useState<DocumentData[]>([]);

  useEffect(() => {
    setLoading(true);
    async function dashboardInit() {
      // 1. get community favourites
      const commFavouriteResult = await getCommunityFavourites(1);
      // 2. get reviews from followed users
      const followingReviewsResult = await getFollowingReviews(uid as string);
      setCommunityFavourites(commFavouriteResult);
      setFollowingReviews(followingReviewsResult);

      setLoading(false);
    }

    dashboardInit();
  }, []);

  console.log(followingReviews);
  // console.log("popular this week:", communityFavourites);

  // temp mapping for "popular among friends"

  if (loading) return <h1> Loading... </h1>;
  return (
    <div
      className="w-full max-w-[55rem]
        flex flex-col gap-6 md:gap-20 text-black/70"
    >
      {/** ---- Popular this week ---- */}
      <section className="flex flex-col gap-4">
        <p className="uppercase font-light">Popular this week</p>
        <div
          className="w-full
                flex flex-row gap-4 overflow-x-scroll my-scrollbar
                "
        >
          {communityFavourites.map((sheet, index) => {
            const sheetId = slugify(sheet.fullName);

            return (
              <Link
                to={`/sheet/${sheetId}`}
                key={index}
                className="h-[18rem] min-w-[13rem] border-2 border-black/20 bg-secondary
              flex flex-col justify-between"
                state={{
                  title: sheet.title,
                  composer: sheet.composer,
                  sheetId: sheetId,
                }}
                onClick={() =>
                  setLogTarget({
                    fullName: sheet.fullName,
                    title: sheet.title,
                    composer: sheet.composer,
                    sheetId: sheetId,
                  })
                }
              >
                <h1 className="text-4xl font-bold text-black/70 break-words hyphens-auto m-4">
                  {sheet.title}
                </h1>
                <div className="bg-black/10 px-4">
                  <p className="text-sm text-black/60">
                    {sheet.reviewCount} reviews
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/** ---- popular among friends ---- */}
      <section className="flex flex-col gap-4">
        <p className="uppercase font-light">Popular among friends</p>
        <div
          className="w-full h-fit
                flex flex-col gap-4"
        >
          {followingReviews.length === 0 ? (
            <h1 className="text-sm font-light text-black/40">
              So empty... start following more people!
            </h1>
          ) : (
            <>
              {followingReviews.map((review, index) => (
                <article
                  className="flex flex-col gap-1 py-2
        text-sm border-b-2 border-black/10"
                  key={index}
                >
                  <Link
                    to={`/sheet/${review.reviewDoc.sheetId}`}
                    key={index}
                    className="hover:underline"
                    state={{
                      title: review.sheetDoc.title,
                      composer: review.sheetDoc.composer,
                      sheetId: review.sheetDoc.sheetId,
                    }}
                    onClick={() =>
                      setLogTarget({
                        fullName: review.sheetDoc.fullName,
                        title: review.sheetDoc.title,
                        composer: review.sheetDoc.composer,
                        sheetId: review.sheetDoc.sheetId,
                      })
                    }
                  >
                    <h1 className="text-xl font-semibold font-serif">
                      {review.sheetDoc.title}
                    </h1>
                  </Link>

                  <p className="text-sm font-light text-black/40">
                    Reviewed by {review.reviewDoc.displayName}
                  </p>
                  <p>{review.reviewDoc.content}</p>
                </article>
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
