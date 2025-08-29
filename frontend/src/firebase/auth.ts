// contains all the auth functions

import { auth, db} from "./firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export type UserType ={
  uid: string ;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export async function createUserDoc(user:UserType){
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email:user.email,
    displayName: user.displayName || "Anonymous",
    photoURL: user.photoURL || null
  })
}


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
