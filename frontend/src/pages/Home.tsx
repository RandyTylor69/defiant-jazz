import { currPlaying, myPalette } from "../data";
import { FiArrowUpRight } from "react-icons/fi";
// firebase
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doCreateUserWithEmailAndPassword,
  createUserDoc,
} from "../firebase/auth.ts";

import { useAuth } from "../components/AuthProvider.tsx";
import { useState } from "react";
import SignIn from "../components/SignIn.tsx";
import Register from "../components/Register.tsx";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  // the useAuth() hook contains the user's logged in status.
  const { userLoggedIn } = useAuth();
  // temp f() for palette
  function isEven(num: number) {
    return num % 2 === 0;
  }

  async function signIn(
    e: React.FormEvent<HTMLFormElement>,
    email: string,
    password: string
  ): Promise<void> {
    e.preventDefault();
    const result = await doSignInWithEmailAndPassword(email, password);
    if (!result) return;
    //setUid(result.user.uid);
    navigate("/");
  }

  async function signInWithGoogle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await doSignInWithGoogle();

    if (!result) return;
    console.log(result.user);

    createUserDoc({
      uid: result.user.uid,
      email: result.user.email as string, // need "as string" because firebase sets email as "string | null"
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      aboutMe: "",
      sheetsTotal: 0,
    });

    navigate("/");
  }

  async function register(
    e: React.FormEvent<HTMLFormElement>,
    email: string,
    password: string
  ): Promise<void> {
    e.preventDefault();

    const result = await doCreateUserWithEmailAndPassword(email, password);

    if (!result) return;
    createUserDoc({
      uid: result.user.uid,
      email: result.user.email as string, // need "as string" because firebase sets email as "string | null"
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      aboutMe: "",
      sheetsTotal: 0,
    });

    navigate("/");
  }

  const currPlayingMapped = currPlaying.map((p) => {
    return (
      <div
        key={p.id}
        className={`w-full h-[10rem] rounded-[1.5rem]  z-4
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
      className="w-full max-w-[55rem] mx-auto 
        flex flex-col sm:flex-row font-light gap-6 md:gap-20"
    >
      {/** ---- current favourite ---------- */}
      <section className="w-full max-w-[50%] ml-5 md:ml-0 ">
        {/** --(1)-- */}
        <p className=" text-sm mb-4">CURRENT FAVOURITE</p>
        <article
          className="max-w-full
        flex flex-row sm:flex-col gap-4 text-black/70"
        >
          <h1
            className="font-bold break-words  max-w-full
                    text-4xl md:text-6xl"
          >
            ASJHVEQWOEIHOBHDSAHDVASDIOUGWE
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
          <p className="text-sm px-2">CURRENTLY PRACTICING</p>
          <div className="flex flex-col relative">{currPlayingMapped}</div>
        </div>
      </section>
    </div>
  );
}
