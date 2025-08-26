import { weeklyPopular } from "../../data";

export default function Dashboard() {
  // temp mapping for "popular this week"
  const weeklyPopularMapped = weeklyPopular.map((i) => (
    <div
      key={i.name}
      className="h-[18rem] flex-1 min-w-[13rem] p-4 border-2 border-black/20 bg-secondary"
    >
      <h1 className="text-4xl font-bold text-black/70 break-words hyphens-auto">
        {i.name}
      </h1>
    </div>
  ));

  // temp mapping for "popular among friends"
  const friendsPopularMapped = weeklyPopular.map((i) => (

        <article className="flex flex-col gap-1 py-2
        text-sm border-b-2 border-black/10" key={i.id}>
            <h1 className="text-xl font-semibold">{i.name}</h1>
            <p>Reviewed by Anon</p>
            <p>Lorem ipsum dolor sit amet</p>
        </article>

  ));
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
          {weeklyPopularMapped}
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
