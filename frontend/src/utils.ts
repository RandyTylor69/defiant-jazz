import { collection, where, getDocs, query } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";


// a function that turns a sheet's full name into URL-friendly slug strings.
export function slugify(fullName: string): string {
  return fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // replace spaces with dashes
    .replace(/-+/g, "-"); // remove repeated dashes
}

export async function getReviewsByUser(uid:string) {
  const reviewsQuery = query(
    // locate filter
    collection(db, "reviews"),
    // filter function
    where("uid", "==", uid)
  );

  const reviewsSnapshot = await getDocs(reviewsQuery);

  if (reviewsSnapshot.empty) return;

  reviewsSnapshot.forEach((review) => {
    console.log(review.data());
  });
}
