import { useEffect, useState } from "react";
import { weeklyPopular } from "../../data";
import { getCommunityFavourites } from "./CommUtils.ts";
import { SheetType } from "../../types.ts";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // temp mapping for "popular this week"
  const [loading, setLoading] = useState(false);
  const [communityFavourites, setCommunityFavourites] = useState<
    SheetType[]
  >([]);

  useEffect(() => {
    setLoading(true);
    async function dashboardInit() {
      // 1. get community favourites
      const commFavouriteResult = await getCommunityFavourites(1);
      setCommunityFavourites(commFavouriteResult);

      setLoading(false);
    }

    dashboardInit();
  }, []);

  console.log(communityFavourites);

  // temp mapping for "popular among friends"
  const friendsPopularMapped = weeklyPopular.map((i) => (
    <article
      className="flex flex-col gap-1 py-2
        text-sm border-b-2 border-black/10"
      key={i.id}
    >
      <h1 className="text-xl font-semibold">{i.name}</h1>
      <p>Reviewed by Anon</p>
      <p>Lorem ipsum dolor sit amet</p>
    </article>
  ));

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
          {communityFavourites.map((sheet, index) => (
            <Link
              to={`/sheet/${sheet.id}`}
              key={index}
              className="h-[18rem] min-w-[13rem] border-2 border-black/20 bg-secondary
              flex flex-col justify-between"
              state={{
                title: sheet.title,
                composer: sheet.composer,
                sheetId: sheet.sheetId,
              }}
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
          ))}
        </div>
      </section>

      {/** ---- popular among friends ---- */}
      <section className="flex flex-col gap-4">
        <p className="uppercase font-light">Popular among friends</p>
        <div
          className="w-full h-fit
                flex flex-col gap-4"
        >
          {friendsPopularMapped}
        </div>
      </section>
    </div>
  );
}
