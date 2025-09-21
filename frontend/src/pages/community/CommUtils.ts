import {
  collection,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { getFollowers } from "../../utils.ts";

export async function getCommunityFavourites(minReviewCount: number) {
  let arr: DocumentData[] = [];
  // 1. get all sheets that qualify
  const sheetsRef = collection(db, "sheets");

  const q = query(sheetsRef, where("reviewCount", ">=", minReviewCount));

  const sheetsSnap = await getDocs(q);

  for (const sheet of sheetsSnap.docs) {
    arr.push(sheet.data());
  }
  // 2. Clean the array so that it has only 4 sheets with the most reviews.

  arr.sort((a, b) => a.reviewCount - b.reviewCount);

  return arr.slice(0, 4);
}

export async function getFollowingReviews(uid: string) {
  // ---- returns up to 10 most recent reviews from the user's following list.
  // returned format: {
  //    sheetDoc, 
  //    reviewDoc
  // }
  const { followersIdArray } = await getFollowers(uid);

  console.log(followersIdArray)

  if(followersIdArray.length===0) return null;

  // the query will be sorted in descending time order, meaning newest first.
  const reviewsQuery = query(
    collection(db, "reviews"),
    where("uid", "in", followersIdArray),
    orderBy("fireBaseTimestamp", "desc")
  );

  const reviewsSnap = await getDocs(reviewsQuery);

  const docs = await Promise.all(
    reviewsSnap.docs.map(async (reviewDoc) => {
      const sheetRef = doc(db, "sheets", reviewDoc.data().sheetId);
      const sheetSnap = await getDoc(sheetRef);
      let sheetDoc;
      if (sheetSnap.exists()) sheetDoc = sheetSnap.data()
      return {
        sheetDoc: sheetDoc,
        reviewDoc:reviewDoc.data()
      };
    })
  );
  return docs.slice(0, 10);
}
