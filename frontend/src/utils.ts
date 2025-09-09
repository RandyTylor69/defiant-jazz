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
  deleteDoc,
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
  await addDoc(collection(db, "reviews"), {
    practicedSince: review.practicedSince,
    rating: review.rating,
    content: review.content,
    sheetId: review.sheetId,
    uid: review.uid,
    creationDate: new Date().toISOString(),
    displayName: review.displayName,
    likes:0
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
    sheetsTotal: increment(1),
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
// Following
// -----------------------------

export async function followUser(currentUid: string, targetUid: string) {
  // 1. Create the "currentUid" document. This represents the user performing the follow.
  await setDoc(
    doc(db, "following", currentUid),
    {
      utilString: "util", // neede to validate the document, else it won't get noticed
      // by firebase when performing a "getDocs" function.
    },
    { merge: true }
  );
  // 2. On top of the document that just got created, add a "userFollowing" subcollection
  // to it, and add the targetUid as a document.
  await setDoc(
    doc(db, "following", currentUid, "userFollowing", targetUid),
    {}
  );
  console.log("Followed!");
}

export async function isFollowing(currentUid: string, targetUid: string) {
  const followRef = doc(
    db,
    "following",
    currentUid,
    "userFollowing",
    targetUid
  );
  const followSnap = await getDoc(followRef);
  return followSnap.exists();
}

export async function unfollowUser(currentUid: string, targetUid: string) {
  const followRef = doc(
    db,
    "following",
    currentUid,
    "userFollowing",
    targetUid
  );
  await deleteDoc(followRef);
  console.log("Unfollowed");
}

export async function getFollowers(
  currentUid: string
): Promise<{ followersCount: number; followersIdArray: string[] }> {
  let followersCount = 0;
  let followersIdArray: string[] = [];

  // 1. Get all documents inside "following" (parent collection)
  const followSnap = await getDocs(collection(db, "following"));
  // 2. Loop through each document's subcollection "userFollowing" to see if they contain currentUid.
  // Using for...of because it applies to async.

  for (const user of followSnap.docs) {
    // 3. Getting the "userFollowing" subcollection.
    const followingSnap = await getDocs(
      collection(db, "following", user.id, "userFollowing")
    );
    // console.log("sub collection size: ",followingSnap.size)

    // 4. For each subcollection, perform the check.
    // Using forEach beecause we don't async here.
    for (const userFollowing of followingSnap.docs) {
      if (userFollowing.id === currentUid) {
        // perform the result operations
        followersCount++;
        followersIdArray.push(user.id);
      }
    }
  }

  return { followersCount, followersIdArray };
}

export async function getUserDetails(uid: string) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data();
  }
}

export async function getFollowing(
  uid: string
): Promise<{ followingsCount: number; followingsIdArray: string[] }> {
  let followingsCount = 0;
  let followingsIdArray: string[] = [];
  const followingSnap = await getDocs(collection(db, "following", uid, "userFollowing"))
  for (const followedUserId of followingSnap.docs) {
    followingsCount ++ ;
    followingsIdArray.push(followedUserId.id)
  }
  return { followingsCount, followingsIdArray };
}
