import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getUserDetails } from "../../utils.ts";
import { UserType } from "../../types.ts";
import { DocumentData } from "firebase/firestore";
import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FiArrowUpRight } from "react-icons/fi";

export default function Followers() {
  const { uid } = useParams();
  const location = useLocation();
  const followersId = location.state;
  const [flrData, setFlrData] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function followersInit() {
      // add all followers of this user into a state variable "flrData"
      for (const flrUid of followersId) {
        const flrDetail = await getUserDetails(flrUid); // this returns a user document.
        setFlrData((prev) => [...prev, flrDetail as UserType]);
      }
    }
    followersInit();
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
        Followers
      </p>
      <ul className="flex flex-col gap-4 p-4">
        {flrData.map((flr, index) => {
          return (
            <Link to={`/${flr.uid}`}>
              <li
                key={index}
                className="flex flex-row justify-between py-2 
                border-black/10 border-b-[1px]
                items-center
                "
              >
                <div className="flex flex-col gap-2 items-baseline">
                  <h1 className="text-xl text-black/70 italic">
                    {flr.displayName}
                  </h1>
                  <p className="text-sm text-black/30">
                    {flr.sheetsTotal}{" "}
                    {flr.sheetsTotal % 2 === 0 ? "sheet" : "sheets"}
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
