import { currPlaying, myPalette } from "../data";
import { FiArrowUpRight } from "react-icons/fi";
import { signIn, signInWithGoogle, register } from "../firebase/dbUtils.ts";
import { useAuth } from "../components/AuthProvider.tsx";
import { useState, useEffect } from "react";
import SignIn from "../components/SignIn.tsx";
import Register from "../components/Register.tsx";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../components/Layout.tsx";
import { db } from "../firebase/firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";
import { LogTargetType } from "../types.ts";
import { Link } from "react-router-dom";
import { doSignout } from "../firebase/auth.ts";

export default function Home() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  // the useAuth() hook contains the user's logged in status.
  const { userLoggedIn } = useAuth();
  const { uid } = useLayout();
  // temp f() for palette
  function isEven(num: number) {
    return num % 2 === 0;
  }
  // ---- states for the front page pieces ----- //
  // --------------------------------------------//
  const [currPracticing, setCurrPracticing] = useState<LogTargetType[]>([]);
  const [favouritePiece, setFavouritePiece] = useState<LogTargetType | null>(
    null
  );

  // fetch user's currently playing + favourite sheet at the start
  useEffect(() => {
    if (userLoggedIn) {
      async function getUserInfo() {
        const userRef = doc(db, "users", uid as string);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          console.log(userSnap.data())
          const { currentlyPracticing, favouritePiece } = userSnap.data();
          
          setCurrPracticing(currentlyPracticing);
          setFavouritePiece(favouritePiece);

        } else {
          console.log("the user doesnt exist")
        }
      }
      getUserInfo();
    }
  }, []);

    async function handleSignOut() {
      await doSignout();
      console.log("User signed out.");
    }
  

  if (!userLoggedIn)
    return (
      <div className="w-full h-fit flex justify-center items-center relative">
        <article className="w-full h-fit max-w-[40rem] text-center text-black/70 text-2xl text-bold font-serif">
          <h1>Archive what you've played.</h1>
          <h1>Comment on your favourites.</h1>
          <h1>Tell the piano community what's good.</h1>

          <div className="flex flex-col gap-4 justify-center items-center">
            <button
              className="border-green-700 border-2 text-green-700 px-2 rounded-[1rem] font-sans
          mt-6 text-[1rem] hover:bg-green-700 hover:text-primary duration-300 w-fit"
              onClick={() => setIsRegistering(true)}
            >
              Sign me up!
            </button>
            <button
              className="text-sm font-sans italic underline text-black/40"
              onClick={() => setIsSigningIn(true)}
            >
              Already an user? Log in{" "}
            </button>
          </div>
        </article>
        {/** ---- log in window ---- */}
        {isSigningIn && (
          <SignIn
            signIn={signIn}
            setIsSigningIn={setIsSigningIn}
            signInWithGoogle={signInWithGoogle}
          />
        )}
        {isRegistering && (
          <Register
            register={register}
            setIsRegistering={setIsRegistering}
            signInWithGoogle={signInWithGoogle}
          />
        )}
      </div>
    );

  return (
    <div
      className="w-full max-w-[55rem] mx-auto pt-8
        flex flex-col sm:flex-row font-light gap-6 md:gap-20"
    >
      {/** ---- current favourite ---------- */}
      <section className="w-full max-w-[50%] ml-5 md:ml-0 ">
        <p className=" text-sm mb-4 text-black/40">CURRENT FAVOURITE</p>

        <article
          className="max-w-full items-center sm:items-start
        flex flex-row sm:flex-col gap-10 sm:gap-6 text-black/70"
        >
          {/** --(1)-- */}
          <h1
            className="font-bold break-words  max-w-full
                    text-4xl md:text-6xl"
          >
            {favouritePiece?.title}
          </h1>

          {/** --(2)-- */}
          <div
            className="flex flex-col w-fit h-fit pl-2 sm:pt-2 gap-2 mt-4 sm:mt-0 
                    border-l-[1px] sm:border-t-[1px] sm:border-l-[0px] border-black/20"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl leading-5">
              384 days
            </h2>
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
          <p className="text-sm px-2 text-black/40">CURRENTLY PRACTICING</p>
          <div className="flex flex-col relative">
            {currPracticing.map((p: LogTargetType, index: number) => {
              return (
                <div
                  key={p.sheetId}
                  className={`w-full h-[10rem] rounded-[1.5rem]  z-4
        transform hover:-translate-y-[6rem] duration-300 ease-in-out
        absolute p-4`}
                  style={{
                    backgroundColor: myPalette[index],
                    top: `${index * 4}rem`,
                  }}
                >
                  <article
                    className={`h-full w-full
        flex flex-col justify-between
        ${isEven(index) ? "text-black/70" : "text-white/70"}`}
                  >
                    <h1 className="text-2xl uppercase font-bold">{p.title}</h1>
                    <div
                      className="w-full
            flex flex-row justify-between"
                    >
                      <div className="flex flex-col gap-2 text-xs">
                        <p>{p.composer}</p>
                        <p>0 days played</p>
                      </div>
                      <Link
                        to={`/sheet/${p.sheetId}`}
                        state={{
                          title: p.title,
                          composer: p.composer,
                          sheetId: p.sheetId,
                        }}
                      >
                        {" "}
                        <FiArrowUpRight className="text-6xl" />
                      </Link>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
