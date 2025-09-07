import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getUserDetails } from "../../utils.ts";
import { UserType } from "../../types.ts";
import { DocumentData } from "firebase/firestore";
import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FiArrowUpRight } from "react-icons/fi";

export default function Following() {
  const { uid } = useParams();
  const location = useLocation();
  const followingsId = location.state;
  const [followingData, setfollowingData] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

     async function followingsInit() {
      // add all followers of this user into a state variable "followingData"

      for (const followingUid of followingsId) {
        const followingDetail = await getUserDetails(followingUid); // this returns a user document.
        setfollowingData((prev) => [...prev, followingDetail as UserType]);
      }
    }
    followingsInit(); 
    setLoading(false);
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
        Following
      </p>
      <ul className="flex flex-col gap-4 p-4">
        {followingData.map((following, index) => {
          return (
            <Link to={`/${following.uid}`}>
              <li
                key={index}
                className="flex flex-row justify-between py-2 
                border-black/10 border-b-[1px]
                items-center
                "
              >
                <div className="flex flex-col gap-2 items-baseline">
                  <h1 className="text-xl text-black/70 italic">
                    {following.displayName}
                  </h1>
                  <p className="text-sm text-black/30">
                    {following.sheetsTotal}{" "}
                    {following.sheetsTotal % 2 === 0 ? "sheet" : "sheets"}
                  </p>
                </div>
                <FiArrowUpRight className="text-3xl text-black/20" />
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
