import { FormEvent } from "react";
import { NavigateFunction} from "react-router-dom";

// Firebase
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doCreateUserWithEmailAndPassword,
  createUserDoc,
} from "./auth.ts";

// Types
// (Optional) If you have a `UserType`, import it here
// import { UserType } from "./types";

export async function signIn(
  e: FormEvent<HTMLFormElement>,
  email: string,
  password: string,
  navigate: NavigateFunction
): Promise<void> {
  e.preventDefault();
  const result = await doSignInWithEmailAndPassword(email, password);
  if (!result) return;

  navigate("/");
}

export async function signInWithGoogle(
  e: FormEvent<HTMLFormElement>,
  navigate: NavigateFunction
): Promise<void> {
  e.preventDefault();
  const result = await doSignInWithGoogle();
  if (!result) return;

  console.log(result.user);

  await createUserDoc({
    uid: result.user.uid,
    email: result.user.email as string, // firebase types `email` as string | null
    displayName: result.user.displayName,
    photoURL: result.user.photoURL,
    aboutMe: "",
    sheetsTotal: 0,
  });

  navigate("/");
}

export async function register(
  e: FormEvent<HTMLFormElement>,
  email: string,
  password: string,
  navigate: NavigateFunction
): Promise<void> {
  e.preventDefault();
  const result = await doCreateUserWithEmailAndPassword(email, password);
  if (!result) return;

  await createUserDoc({
    uid: result.user.uid,
    email: result.user.email as string,
    displayName: result.user.displayName,
    photoURL: result.user.photoURL,
    aboutMe: "",
    sheetsTotal: 0,
  });

  navigate("/");
}
