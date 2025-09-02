import { DatabaseSync } from "node:sqlite";
import { ReviewType } from "../types";

import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export async function addReviewToDB(review: ReviewType, uid: string) {
  // 1. Checks if the sheet that the user is reviewing exits
  //    inside Firestore.
  if (!review.sheetId) return;
  // 1.1. Reference to the sheet (if it exists)
  const sheetRef = doc(db, "sheets", review.sheetId);
  // 1.2. The getDoc() function returns an object that has methods to inspect the document.
  let sheetStatus = await getDoc(sheetRef);

  // 2. If the sheet doesn't exist, we need to create it.
  if (!sheetStatus.exists()) {
    await setDoc(sheetRef, {
      // id: review.sheetId (we don't have to repeat it here because
      // the first param, "sheetRef", already has it noted.)
      fullName: review.fullName,
      title: review.title,
      composer: review.composer,
      creationDate: new Date().toISOString(),
      reviewCount: 0,
      practicedCount: 0,
    });

    // 2.2. Re-fetch the sheet status after the sheet has been created.
    sheetStatus = await getDoc(sheetRef);
  }

  // 3. Create the "review" document and link it to the "sheet" document.
  const reviewRef = await addDoc(collection(db, "reviews"), {
    practicedSince: review.practicedSince, // the date that the user started practicing since.
    rating: review.rating,
    content: review.content,
    sheetId: review.sheetId, // the slug id.
    uid: review.uid,
    creationDate: new Date().toISOString(),
    displayName: review.displayName,
    photoURL: review.photoURL,
  });

  // 4. Increment the review count of the sheet.
  await setDoc(
    sheetRef,
    {
      reviewCount: sheetStatus.data()?.reviewCount + 1,
    },
    { merge: true } // make sure it doesn't overwrite the whole thing.
  );

  console.log(reviewRef);

  // 5. Increment the review count of the user.
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  await setDoc(
    userRef,
    {
      sheetsTotal: userSnap.data()?.sheetsTotal + 1,
    },
    { merge: true }
  );
}

export async function updateReview(
  reviewId: string,
  updatedReview: Partial<ReviewType>
) {
  const reviewRef = doc(db, "reviews", reviewId);
  await updateDoc(reviewRef, updatedReview);
}

// returns 2 numbers: the 1st is how many sheets the user has reviewed in total, the 2nd is how many they've reviewed this year

export async function getSheets(uid: string) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  const sheetsTotalCount = userSnap.data()?.sheetsTotal;
  
  // get annual sheets
  let sheetsAnnualCount = 0;
  const currYear = new Date().getFullYear();

  const reviewsQuery = query(
    // location: fetching from the "reviews" collection
    collection(db, "reviews"),
    // fetch all reviews.
    where("uid", "==", uid)
  );

  const reviewsSnapshot = await getDocs(reviewsQuery);

  reviewsSnapshot.forEach((review) => {
    const practiedSinceYear = new Date(review.data().practicedSince).getFullYear()
    if (practiedSinceYear === currYear) {
      sheetsAnnualCount++;
    }
  });

  return { sheetsTotalCount, sheetsAnnualCount };
}
