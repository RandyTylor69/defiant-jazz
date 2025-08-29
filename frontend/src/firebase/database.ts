import { db } from "./firebaseConfig";
import { collection, addDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export type ReviewType = {
  fullName: string | null;
  title: string | null;
  composer: string | null;
  practicedSince: string;
  rating: number;
  content: string;
  // database related stats
  sheetId: string | null; // full name of the sheet music but slugged
  uid: string; // UID provided when the user logs in
};
export async function addReviewToDB(review: ReviewType) {
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
}

export async function updateReview(reviewId:string, updatedReview:ReviewType){
  const reviewRef = doc(db, "reviews", reviewId)
  await updateDoc(reviewRef, updatedReview)
}
