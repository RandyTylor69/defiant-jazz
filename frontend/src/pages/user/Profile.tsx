import { doSignout } from "../../firebase/auth.ts";
import { useLayout } from "../../components/Layout.tsx";
import { CgMoreO } from "react-icons/cg";
import { useEffect, useState } from "react";
import { getReviewsByUser } from "../../utils.ts";
import { Link } from "react-router-dom";
import { getSheets } from "../../firebase/database.ts";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig.js";

export default function Profile() {
  // ------ user detail
  const [sheetsTotal, setSheetsTotal] = useState(0);
  const [sheetsAnnual, setSheetsAnnual] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);
  const [favouritePiece, setFavouritePiece] = useState<string | null>(null);
  const [currentlyPracticing, setCurrentlyPracticing] = useState<
    string[] | null
  >(null);
  // ------ user info
  const [pfp, setPfp] = useState(""); // photoURL
  const [username, setUsername] = useState("");
  const [aboutMe, setAboutMe] = useState("");

  const { uid, displayName, photoURL } = useLayout();

  useEffect(() => {
    async function fetchSheets() {
      const userRef = doc(db, "users", uid as string);
      onSnapshot(userRef, async (userSnap) => {
        if (userSnap.exists()) {
          const { sheetsTotalCount, sheetsAnnualCount } = await getSheets(
            uid as string
          );
          setSheetsTotal(sheetsTotalCount);
          setSheetsAnnual(sheetsAnnualCount);
        }
      });
    }
    fetchSheets();
  }, []);

  console.log(photoURL)

  return (
    <div className="flex flex-col w-full justify-center items-center text-black/70 gap-16 pt-8 md:pt-0">
      {/** ========== USER DESCRIPTION ========== */}

      <section
        className="flex flex-col sm:flex-row w-full gap-8 h-fit
      justify-between items-center "
      >
        {/** This section has 3 sub-sections, the first two is grouped together.*/}
        <div className="flex flex-col sm:flex-row gap-8 ">
          {/** ----- 1. pfp ----- */}
          <div className="h-fit w-full sm:w-fit flex justify-center items-center">
            {photoURL ? (
              <img
                src={photoURL}
                alt="profile image"
                className="rounded-[50%]"
              />
            ) : (
              <div className="w-full h-full bg-secondary"></div>
            )}
          </div>

          {/** ----- 2. username + aboutme ----- */}
          <div className="flex flex-col gap-2 justify-center">
            <div className="flex gap-2 items-center">
              <h1 className="text-2xl font-light">{displayName}</h1>
              <Link to={`edit`}>
                <p className="text-black/20">
                  <CgMoreO />
                </p>
              </Link>
            </div>
            <div className="w-full">
              <p className="text-sm font-light">Lorem ipsum dolor dit amet.</p>
            </div>
          </div>
        </div>

        {/** ----- 3. stats (sheets + this year + friends) ----- */}
        <div className="flex flex-row justify-between items-center w-fit ">
          <Link to={`sheets`} className="hover:underline">
            {" "}
            <div className="flex flex-col gap-1 px-4 border-black/20 border-r items-center">
              <h2 className="text-xl font-serif font-bold italic">
                {sheetsTotal}
              </h2>
              <p className="text-xs font-light text-black/40">SHEETS</p>
            </div>
          </Link>

          <Link to={`sheetsAnnual`} className="hover:underline">
            {" "}
            <div className="flex flex-col gap-1 px-4 border-black/20 border-r items-center">
              <h2 className="text-xl font-serif font-bold italic">
                {sheetsAnnual}
              </h2>
              <p className="text-xs font-light text-black/40">THIS YEAR</p>
            </div>
          </Link>
          <div className="flex flex-col gap-1 px-4 border-black/20 items-center ">
            <h2 className="text-xl font-serif font-bold italic">20</h2>
            <p className="text-xs font-light text-black/40">FRIENDS</p>
          </div>
        </div>
      </section>

      {/** ========== FAVOURITE PIECE ========== */}

      <section
        className="w-full h-fit
      flex flex-col gap-2"
      >
        <h2 className="text-sm font-light border-b-[1px] border-black/20 text-black/40">
          FAVOURITE PIECE
        </h2>
        <p className="text-2xl font-serif  italic">
          La fille aux cheveaux de lin
        </p>
      </section>

      {/** ========== CURRENTLY PRACTICING ========== */}

      <section
        className="w-full h-fit
      flex flex-col gap-2"
      >
        <h2 className="text-sm font-light border-b-[1px] border-black/20 text-black/40">
          CURRENTLY PRACTICING
        </h2>
        <p className="text-2xl font-serif  italic">
          La fille aux cheveaux de lin
        </p>
      </section>
    </div>
  );
}
