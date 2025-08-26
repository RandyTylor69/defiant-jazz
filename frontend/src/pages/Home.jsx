import { currPlaying, myPalette } from "../data";
import { FiArrowUpRight } from "react-icons/fi";

export default function Home() {
  function isEven(num) {
    return num % 2 === 0;
  }

  const currPlayingMapped = currPlaying.map((p) => {
    return (
      <div
        key={p.id}
        className={`w-full h-[10rem] rounded-[1.5rem] 
        transform hover:-translate-y-[6rem] duration-300 ease-in-out
        absolute p-4`}
        style={{ backgroundColor: myPalette[p.id], top: `${p.id * 4}rem` }}
      >
        <article
          className={`h-full w-full
        flex flex-col justify-between
        ${isEven(p.id) ? "text-black/70" : "text-white/70"}`}
        >
          <h1 className="text-2xl uppercase font-bold">{p.name}</h1>
          <div
            className="w-full
            flex flex-row justify-between"
          >
            <div className="flex flex-col gap-2 text-xs">
              <p>{p.composer}</p>
              <p>{p.playTime} days played</p>
            </div>
            <FiArrowUpRight className="text-4xl" />
          </div>
        </article>
      </div>
    );
  });

  return (
    <div
      className="w-full max-w-[55rem] mx-auto 
        flex flex-col sm:flex-row font-light gap-6 md:gap-20"
    >
      {/** ---- current favourite ---------- */}
      <section className="w-full">
        <p className=" text-sm mb-4">CURRENT FAVOURITE</p>
        <article className="flex flex-row sm:flex-col gap-4 text-black/70">
          <h1
            className="font-bold
                    text-4xl md:text-6xl"
          >
            LA FILLE AUX CHEVEAUX DE LIN
          </h1>
          <div
            className="flex flex-col w-fit h-fit pl-2 sm:pt-2 gap-2 mt-4 sm:mt-0
                    border-l-[1px] sm:border-t-[1px] sm:border-l-[0px] border-black/20"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl leading-5">384 days</h2>
            <p className="text-xs md:text-sm leading-3">worth of practice</p>
          </div>
        </article>
      </section>

      {/** ---- currently playing  ---------- */}

      <section className="w-full">
        <div
          className="w-full h-[27rem] rounded-[2rem] p-4
         bg-white  text-black/70
        flex flex-col gap-4"
        >
          <p className="text-sm px-2">CURRENTLY PRACTICING</p>
          <div className="flex flex-col relative">{currPlayingMapped}</div>
        </div>
      </section>
    </div>
  );
}
