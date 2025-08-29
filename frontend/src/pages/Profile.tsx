import { doSignout } from "../firebase/auth.ts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import { useLayout } from "../components/Layout.tsx";
import { useEffect } from "react";
export default function Profile() {
  const { uid } = useLayout();
  async function handleSignOut() {
    await doSignout();
    console.log("User signed out.");
  }

// temp function that console logs all the reviews

  useEffect(() => {
    async function getReviewsByUser() {
      
      const reviewsQuery = query(
        // locate filter
        collection(db, "reviews"),
        // filter function
        where("uid", "==", uid)
      );

      const reviewsSnapshot = await getDocs(reviewsQuery);

      reviewsSnapshot.forEach((review) => {
        console.log(review.data());
      });
    }
    getReviewsByUser()
  }, []);

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}
