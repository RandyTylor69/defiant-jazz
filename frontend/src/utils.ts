import { db } from "./firebase/firebaseConfig";
import {
  collection,
  where,
  getDocs,
  query,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

import { SheetType, ReviewType, LogTargetType, UserType } from "./types";

// -----------------------------
// Helpers
// -----------------------------

// a function that turns a sheet's full name into URL-friendly slug strings.
export function slugify(fullName: string): string {
  return fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // replace spaces with dashes
    .replace(/-+/g, "-"); // remove repeated dashes
}

// -----------------------------
// Sheets
// -----------------------------

export async function createSheetDoc(logTarget: LogTargetType) {
  await setDoc(doc(db, "sheets", logTarget.sheetId as string), {
    composer: logTarget.composer,
    fullName: logTarget.fullName,
    title: logTarget.title,
    creationDate: new Date().toISOString(),
    reviewCount: 0,
    practicedCount: 0,
  });
}

// returns the fields of a sheet document and its id. Used in EditProfile.tsx.
export async function getSheetByLogTarget(
  logTarget: LogTargetType
): Promise<(SheetType & { id: string }) | null> {
  const sheetRef = doc(db, "sheets", logTarget.sheetId as string);
  let sheetSnap = await getDoc(sheetRef);

  if (!sheetSnap.exists()) {
    // If the sheet doc DNE, we need to create it using the logTarget info.
    createSheetDoc(logTarget);
    // redirect the sheet snapshot to the newly created sheet document.
    sheetSnap = await getDoc(sheetRef);
  }

  return { id: sheetSnap.id, ...sheetSnap.data() } as SheetType & {
    id: string;
  };
}

// -----------------------------
// Reviews
// -----------------------------

export async function getReviewsByUser(uid: string) {
  const reviewsQuery = query(
    collection(db, "reviews"),
    where("uid", "==", uid)
  );

  const reviewsSnapshot = await getDocs(reviewsQuery);

  if (reviewsSnapshot.empty) return;

  reviewsSnapshot.forEach((review) => {
    console.log(review.data());
  });
}

export async function addReviewToDB(review: ReviewType, uid: string) {
  if (!review.sheetId) return;

  // 1. Check if sheet exists
  const sheetRef = doc(db, "sheets", review.sheetId);
  let sheetStatus = await getDoc(sheetRef);

  // 2. If sheet doesn’t exist, create it
  if (!sheetStatus.exists()) {
    await setDoc(sheetRef, {
      fullName: review.fullName,
      title: review.title,
      composer: review.composer,
      creationDate: new Date().toISOString(),
      reviewCount: 0,
      practicedCount: 0,
    });

    sheetStatus = await getDoc(sheetRef);
  }

  // 3. Add review
  const reviewRef = await addDoc(collection(db, "reviews"), {
    practicedSince: review.practicedSince,
    rating: review.rating,
    content: review.content,
    sheetId: review.sheetId,
    uid: review.uid,
    creationDate: new Date().toISOString(),
    displayName: review.displayName,
    photoURL: review.photoURL,
  });

  // 4. Increment sheet review count
  await setDoc(
    sheetRef,
    {
      reviewCount: (sheetStatus.data()?.reviewCount || 0) + 1,
    },
    { merge: true }
  );

  // 5. Increment user’s total sheet count
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    sheetsTotal: increment(1)
  });
}

export async function updateReview(
  reviewId: string,
  updatedReview: Partial<ReviewType>
) {
  const reviewRef = doc(db, "reviews", reviewId);
  await updateDoc(reviewRef, updatedReview);
}

export async function getPlayTime(
  sheetId: string,
  uid: string
): Promise<number | null> {
  const reviewQuery = query(
    collection(db, "reviews"),
    where("uid", "==", uid),
    where("sheetId", "==", sheetId)
  );
  const reviewSnap = await getDocs(reviewQuery);
  if (!reviewSnap.empty) {
    const reviewDoc = reviewSnap.docs[0];
    const { practicedSince } = reviewDoc.data();
    const startDate = new Date(practicedSince);
    const endDate = new Date();
    const diffInMs = endDate.valueOf() - startDate.valueOf();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    //console.log(Math.floor(diffInDays));
    return Math.floor(diffInDays);
  }
  return null;
}

// -----------------------------
// Stats
// -----------------------------

// returns total reviewed sheets and how many reviewed this year
export async function getSheetsTotalAndAnnual(uid: string) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  // count reviews in total
  const sheetsTotalCount = userSnap.data()?.sheetsTotal || 0;

  // count reviews in current year
  let sheetsAnnualCount = 0;
  const currYear = new Date().getFullYear();

  const reviewsQuery = query(
    collection(db, "reviews"),
    where("uid", "==", uid)
  );

  const reviewsSnapshot = await getDocs(reviewsQuery);

  reviewsSnapshot.forEach((review) => {
    const practicedSinceYear = new Date(
      review.data().practicedSince
    ).getFullYear();

    if (practicedSinceYear === currYear) {
      sheetsAnnualCount++;
    }
  });

  return { sheetsTotalCount, sheetsAnnualCount };
}

// -----------------------------
// Stats
// -----------------------------
