import { useLayout } from "../../components/Layout.tsx";
import { CgMoreO } from "react-icons/cg";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  followUser,
  getFollowers,
  getFollowing,
  getSheetsTotalAndAnnual,
  isFollowing,
  unfollowUser,
} from "../../utils.ts";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig.js";
import { LogTargetType, UserType } from "../../types.ts";

export default function Profile() {
  // ------ user detail
  const { uid } = useParams();
  const { uid: myUid } = useLayout();

  const [sheetsTotal, setSheetsTotal] = useState(0);
  const [sheetsAnnual, setSheetsAnnual] = useState(0);
  // -- follow stats
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersId, setFollowersId] = useState<null | string[]>(null); // array
  const [followingsId, setFollowingsId] = useState<null | string[]>(null); // array
  const [currentlyFollowing, setCurrentlyFollowing] = useState<boolean | null>(
    null
  );
  const [userData, setUserData] = useState<Partial<UserType>>({
    aboutMe: "",
    currentlyPracticing: [],
    displayName: "",
    favouritePiece: null,
    photoURL: null,
    // the missing fields will be supplemented once the component mounts.
  });

  useEffect(() => {
    async function fetchUserInfo() {
      // 1. Fetch User Info
      const userRef = doc(db, "users", uid as string);
      onSnapshot(userRef, async (userSnap) => {
        if (userSnap.exists()) {
          // fetch sheets stats (total / annual)
          const { sheetsTotalCount, sheetsAnnualCount } =
            await getSheetsTotalAndAnnual(uid as string);
          setSheetsTotal(sheetsTotalCount);
          setSheetsAnnual(sheetsAnnualCount);

          // fetch user info. The userData object now listens directly to the user doc.
          setUserData(userSnap.data());
        }
      });

      // 1.5. Fetch followers
      const followersResult = await getFollowers(uid as string);
      setFollowersCount(followersResult.followersCount);
      setFollowersId(followersResult.followersIdArray);

      // 1.6. Fetch followings
      const followingsResult = await getFollowing(uid as string);
      setFollowingCount(followingsResult.followingsCount)
      setFollowingsId(followingsResult.followingsIdArray)

      // 2. Check if the current user is following this user
      const followingResult = await isFollowing(myUid as string, uid as string);
      setCurrentlyFollowing(followingResult);
    }

    // Fetching user info

    fetchUserInfo();
  }, []);

  return (
    <div
      className="flex flex-col w-full 
    justify-center items-center text-black/70 gap-16 pt-8 md:pt-0"
    >
      {/** ========== USER DESCRIPTION ========== */}

      <section
        className="flex flex-col sm:flex-row w-full gap-8 h-fit
      justify-between items-center "
      >
        {/** This section has 3 sub-sections, the first two is grouped together.*/}
        <div className="flex flex-col sm:flex-row gap-8 ">
          {/** ----- 1. pfp ----- */}
          <div className="h-fit w-full sm:w-fit flex justify-center items-center">
            {userData.photoURL ? (
              <img
                src={userData.photoURL}
                alt="profile image"
                className="rounded-[50%] h-[6rem] w-[6rem]"
              />
            ) : (
              <div className="w-full h-full bg-secondary"></div>
            )}
          </div>

          {/** ----- 2. username + aboutme ----- */}
          <div className="flex flex-col gap-2 justify-center">
            <div className="flex gap-2 items-baseline">
              <h1 className="text-2xl font-light">{userData.displayName}</h1>
              {uid === myUid ? (
                <Link to={`edit`}>
                  <p className="text-black/20">
                    <CgMoreO />
                  </p>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setCurrentlyFollowing((prev) => !prev);
                    currentlyFollowing
                      ? unfollowUser(myUid as string, uid as string)
                      : followUser(myUid as string, uid as string);
                  }}
                  className={`  px-2 text-sm font-light
                ${
                  currentlyFollowing
                    ? `bg-black/30 text-primary`
                    : `text-black/30 border-[1px] border-black/30`
                }
                `}
                >
                  {currentlyFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
            <div className="w-full">
              <p className="text-sm font-light">{userData.aboutMe}</p>
            </div>
          </div>
        </div>

        {/** ----- 3. stats (sheets + this year + friends) ----- */}

        {/** sheets total */}
        <div className="flex flex-row justify-between items-center w-fit ">
          <Link to={`sheets`} className="hover:underline">
            {" "}
            <div className="flex flex-col gap-1 px-4 border-black/20 border-r items-center">
              <h2 className="text-xl font-serif font-bold italic">
                {sheetsTotal}
              </h2>
              <p className="text-[0.7rem] font-light text-black/40">SHEETS</p>
            </div>
          </Link>

          {/** sheets annual */}
          <Link to={`sheetsAnnual`} className="hover:underline">
            {" "}
            <div className="flex flex-col gap-1 px-4 border-black/20 border-r items-center">
              <h2 className="text-xl font-serif font-bold italic">
                {sheetsAnnual}
              </h2>
              <p className="text-[0.7rem] font-light text-black/40">ANNUAL</p>
            </div>
          </Link>

          {/** number of followers */}
          <Link
            to={`followers`}
            className="hover:underline"
            state={followersId}
          >
            {" "}
            <div className="flex flex-col gap-1 px-4 border-black/20 border-r items-center">
              <h2 className="text-xl font-serif font-bold italic">
                {followersCount}
              </h2>
              <p className="text-[0.7rem] font-light text-black/40">
                FOLLOWERS
              </p>
            </div>
          </Link>

          {/** number of following */}
          <Link
            to={`following`}
            className="hover:underline"
            state={followingsId}
          >
            {" "}
            <div className="flex flex-col gap-1 px-4 border-black/20 items-center">
              <h2 className="text-xl font-serif font-bold italic">
                {followingCount}
              </h2>
              <p className="text-[0.7rem] font-light text-black/40">
                FOLLOWING
              </p>
            </div>
          </Link>
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
        {userData.favouritePiece ? (
          <Link
            to={`/sheet/${userData.favouritePiece.sheetId}`}
            state={{
              title: userData.favouritePiece.title,
              composer: userData.favouritePiece.composer,
              sheetId: userData.favouritePiece.sheetId,
            }}
          >
            <p className="text-2xl font-serif  italic">
              {userData.favouritePiece.title}
            </p>
          </Link>
        ) : (
          <p className="text-sm font-light text-black/40">
            You haven't set your favourite piece yet.
          </p>
        )}
      </section>

      {/** ========== CURRENTLY PRACTICING ========== */}

      <section
        className="w-full h-fit
      flex flex-col gap-4"
      >
        <h2 className="text-sm font-light border-b-[1px] border-black/20 text-black/40">
          CURRENTLY PRACTICING
        </h2>
        {(userData.currentlyPracticing as []).length > 0 ? (
          (userData.currentlyPracticing as []).map(
            (piece: LogTargetType, index) => {
              return (
                <Link
                  key={index}
                  to={`/sheet/${piece.sheetId}`}
                  state={{
                    title: piece.title,
                    composer: piece.composer,
                    sheetId: piece.sheetId,
                  }}
                >
                  <p className=" font-serif italic leading-4">{piece.title}</p>
                </Link>
              );
            }
          )
        ) : (
          <p className="text-sm font-light text-black/40">
            You haven't set your favourite piece yet.
          </p>
        )}
      </section>
    </div>
  );
}
