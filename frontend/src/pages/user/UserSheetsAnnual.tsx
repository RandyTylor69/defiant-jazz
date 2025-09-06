import { useParams, Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useState, useEffect, useId } from "react";
import { useLayout } from "../../components/Layout.tsx";
import { slugify } from "../../utils.ts";
import {
  query,
  where,
  collection,
  getDocs,
  doc,
  getDoc,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig.js";

export default function UserSheetsAnnual() {
  const [userSheets, setUserSheets] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(false);
  const { uid, setLogTarget } = useLayout();

  useEffect(() => {
    setLoading(true);

    async function fetchUserSheets() {
      // 2 steps.

      // 1. Fetch the sheetId's from the user's reviews.
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("uid", "==", uid)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const currYear = new Date().getFullYear();

      // 2. for each review object, find the sheetId, then locate the
      // sheet document, then append.

      const tempSheets: DocumentData[] = []; // holding all the returned sheets,
      // so we only need to set state once in the end (avoid re-render)

      for (const review of reviewsSnapshot.docs) {
        const practiedSinceYear = new Date(
          review.data().practicedSince
        ).getFullYear();
        if (practiedSinceYear === currYear) {
          const sheetId = review.data().sheetId;
          const sheetRef = doc(db, "sheets", sheetId);
          const sheetSnap = await getDoc(sheetRef);
          if (sheetSnap.exists()) {
            // grab everything

            tempSheets.push(sheetSnap.data());
          }
        }
      }
      setUserSheets(tempSheets);
      setLoading(false);
    }
    fetchUserSheets();
  }, []);



  if (loading) return <h1>Loading...</h1>;
  return (
    <div
      className="h-fit w-full
    flex flex-col gap-6 mt-20"
    >
      <Link to={".."}>
        <p className="flex gap-2 items-center font-light text-black/40 text-sm hover:underline">
          <IoArrowBack /> Go back
        </p>
      </Link>

      <p className="text-sm uppercase font-light text-black/40 border-b-[1px] border-black/20">
        Your sheets archive.
      </p>
      <ul>
        {userSheets.length ? (
          userSheets.map((item) => {
            const composer = item.title.includes("(")
              ? item.title.split("(")[1].split(")")[0].trim()
              : "";
            const title = item.title.split("(")[0].trim();
            const sheetId = slugify(item.fullName);
            console.log(item.fullName);
            return (
              <Link
                key={sheetId}
                to={`/sheet/${sheetId}`}
                state={{ title, composer, sheetId }}
                onClick={() =>
                  setLogTarget({
                    fullName: item.fullName,
                    title: title,
                    composer: composer,
                    sheetId: sheetId,
                  })
                }
              >
                <li
                  className="py-2 mb-6 text-black/70 border-b-[2px] border-black/10"
                  key={item.title}
                >
                  <h1 className="text-xl font-bold ">{item.fullName}</h1>
                </li>
              </Link>
            );
          })
        ) : (
          <p className="text-black/20 italic font-light text-sm">
            You haven't logged any sheets yet.
          </p>
        )}
      </ul>
    </div>
  );
}
