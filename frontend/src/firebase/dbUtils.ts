import { FormEvent } from "react";
import { NavigateFunction } from "react-router-dom";

// Firebase
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doCreateUserWithEmailAndPassword,
  createUserDoc,
} from "./auth.ts";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig.js";

// Types
// (Optional) If you have a `UserType`, import it here
// import { UserType } from "./types";

export async function signIn(
  e: FormEvent<HTMLFormElement>,
  email: string,
  password: string,
): Promise<void> {
  e.preventDefault();
  const result = await doSignInWithEmailAndPassword(email, password);
  if (!result) return;

      window.location.reload();
}

export async function signInWithGoogle(
  e: FormEvent<HTMLFormElement>,
): Promise<void> {
  e.preventDefault();
  const result = await doSignInWithGoogle();
  if (!result) return;

  console.log(result.user);

  const userRef = doc(db, "users", result.user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Only create if user doc does not already exist
    await createUserDoc(result.user);
  }

  window.location.reload()
}

export async function register(
  e: FormEvent<HTMLFormElement>,
  email: string,
  password: string,
): Promise<void> {
  e.preventDefault();
  try {
    const result = await doCreateUserWithEmailAndPassword(email, password);
    if (!result) return;
    await createUserDoc(result.user);
    window.location.reload()
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      alert("User exists already, please log in :)");
    }
  }
}
