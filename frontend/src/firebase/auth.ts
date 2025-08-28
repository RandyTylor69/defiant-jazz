// contains all the auth functions

import { auth } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export async function doCreateUserWithEmailAndPassword(
  email: string,
  password: string
) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result;
}

export async function doSignInWithEmailAndPassword(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result
}

export async function doSignInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    return result;

  } catch (err: any) {
    if (err.code === "auth/popup-closed-by-user") {
      console.log("popup closed before any actions.");
      return null;
    }
  }
}

export function doSignout() {
  return auth.signOut();
}
