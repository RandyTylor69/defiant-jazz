import { collection, DocumentData, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { SheetType } from "../../types";

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
