import { useEffect, useState } from "react";
import { doSignout } from "../../firebase/auth.ts";
import { updateProfile } from "firebase/auth";
import { useLayout } from "../../components/Layout.tsx";
import { MdCancel } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import LogSheetProfile from "../../components/Logging/LogSheetProfile.tsx";
import { LogTargetType } from "../../types.ts";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig.js";

export default function EditProfile() {
  // either a File type object or null
  const [photoFile, setPhotoFile] = useState<File | undefined>(undefined);
  const [newProfileURL, setNewProfileURL] = useState<string | null>(null);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newAboutMe, setNewAboutMe] = useState("");
  // package 1 (for the LogSheetProfile component so it knows which state to put the result)
  const [isLoggingFavourite, setIsLoggingFavourite] = useState(false);
  const [favouritePiece, setFavouritePiece] = useState<LogTargetType | null>(
    null
  );
  // package 2
  const [isLoggingCurrentlyPracticing, setIsLoggingCurrentlyPracticing] =
    useState(false);
  const [currentlyPracticing, setCurrentlyPracticing] = useState<
    LogTargetType[]
  >([]);
  const [isLoggingProfile, setIsLoggingProfile] = useState(false);
  const { displayName, uid, photoURL } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    // fetch from db for the user info
    async function fetchUserInfo() {
      const userRef = doc(db, "users", uid as string);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const {displayName, aboutMe, favouritePiece, currentlyPracticing} = userSnapshot.data();
        setNewDisplayName(displayName)
        setNewAboutMe(aboutMe)
        setFavouritePiece(favouritePiece)
        setCurrentlyPracticing(currentlyPracticing)
      }
    }

    fetchUserInfo()

    setNewDisplayName(displayName);
  }, []);

  

  async function handleSignOut() {
    await doSignout();
    console.log("User signed out.");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // 1. Add the new profile picture's URL to firebase storage
    if (photoFile) {
      const formData = new FormData();
      formData.append("file", photoFile); // named it "file"

      const res = await fetch(
        `${process.env.REACT_APP_SERVER_ROUTE}/api/uploadProfilePicture`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) console.log("Error while uploading file: ", data.error);

      setNewProfileURL(data.url);
    }

    // 2. Updating the user document
    try {
      await updateDoc(doc(db, "users", uid as string), {
        photoURL: newProfileURL ? newProfileURL : photoURL,
        aboutMe: newAboutMe,
        displayName: newDisplayName,
        favouritePiece: favouritePiece,
        currentlyPracticing: currentlyPracticing
      });

      navigate("..");
      console.log("successful submit!");
      console.log(auth.currentUser, displayName);
    } catch (err) {
      console.error("error from updating doc: ", err);
    }

    // 4. update the Auth object (displayName, photoURL)
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName,
        photoURL: newProfileURL ? newProfileURL : photoURL,
      });
    }
  }

  return (
    <div
      className="w-full h-full 
    flex flex-col text-black/70 gap-12"
    >
      <Link to={".."}>
        <p className="flex gap-2 items-center font-light text-black/40 text-sm hover:underline">
          <IoArrowBack /> Go back
        </p>
      </Link>
      <form
        onSubmit={handleSubmit}
        className="w-full h-fit relative
      flex flex-col gap-12 pb-20"
      >
        {/** ---- Updating Profile Picture ---- */}
        <div className="flex flex-col gap-4">
          <p className="small-titletext-uppercase">Profile Picture</p>
          <div className="flex flex-row gap-2 items-baseline">
            <label
              htmlFor="file-upload"
              className="btn-secondary w-fit rounded-[0rem]"
            >
              Upload new
              <input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0])
                    // only set the file if the file exists
                    setPhotoFile(e.target.files[0]);
                }}
              />
            </label>

            {photoFile && (
              <div className="flex gap-2 items-center font-light text-black/40 italic underline text-xs">
                <p>{photoFile.name}</p>
                <button onClick={() => setPhotoFile(undefined)} type="button">
                  <MdCancel />
                </button>
              </div>
            )}
          </div>
        </div>

        {/** ---- Updating Username ---- */}
        <div className="flex flex-col gap-4">
          <p className="small-titletext-uppercase">Username</p>
          <input
            type="text"
            className="general-text-input"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
          />
        </div>

        {/** ---- Updating AboutMe ---- */}
        <div className="flex flex-col gap-4">
          <p className="small-titletext-uppercase">About me</p>
          <input
            type="text"
            className="general-text-input"
            value={newAboutMe as string}
            onChange={(e) => setNewAboutMe(e.target.value)}
            placeholder="i.e. I'm like a cog built to fit only one machine..."
          />
        </div>

        {/** ---- Favourite Piece ---- */}

        <div className="flex flex-col gap-4">
          <p className="small-titletext-uppercase">
            Favourite piece ({favouritePiece ? "1" : "0"}/1){" "}
          </p>
          {favouritePiece && (
            <div className="flex gap-2 items-center font-light text-black/70 font-serif italic underline text-sm">
              <p>{favouritePiece.title}</p>
              <button onClick={() => setFavouritePiece(null)} type="button">
                <MdCancel />
              </button>
            </div>
          )}{" "}
          <button
            type="button"
            className="btn-secondary rounded-[0rem] w-fit"
            onClick={() => {
              setIsLoggingProfile(true);
              setIsLoggingFavourite(true);
            }}
          >
            {favouritePiece ? "Change" : "Add new"}
          </button>
        </div>

        {/** ---- Currently Practicing ---- */}

        <div className="flex flex-col gap-4">
          <p className="small-titletext-uppercase">
            Currently Practicing ({currentlyPracticing.length}/4)
          </p>

          {currentlyPracticing.length > 0 &&
            currentlyPracticing.map((piece) => (
              <div className="flex gap-2 items-center font-light text-black/70 font-serif italic underline text-sm">
                <p>{piece.title}</p>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentlyPracticing((prev) =>
                      prev.filter((i) => i.sheetId != piece.sheetId)
                    )
                  }
                >
                  <MdCancel />
                </button>
              </div>
            ))}

          {/** only render the add button when the list is not full */}
          {currentlyPracticing.length < 4 && (
            <button
              type="button"
              className="btn-secondary rounded-[0rem] w-fit"
              onClick={() => {
                setIsLoggingProfile(true);
                setIsLoggingCurrentlyPracticing(true);
              }}
            >
              Add new
            </button>
          )}
        </div>

        {/** ---- Submit Form Button ---- */}
        <button
          className="btn-primary w-fit absolute bottom-0 right-0"
          type="submit"
        >
          Save changes
        </button>
      </form>

      {/** ---- Conditionally rendered absolute component for the
       * "favourite piece" & "currently practicing" sections. ---------*/}
      {isLoggingProfile && (
        <LogSheetProfile
          setIsLoggingProfile={setIsLoggingProfile}
          isLoggingFavourite={isLoggingFavourite}
          setIsLoggingFavourite={setIsLoggingFavourite}
          setFavouritePiece={setFavouritePiece}
          isLoggingCurrentlyPracticing={isLoggingCurrentlyPracticing}
          setIsLoggingCurrentlyPracticing={setIsLoggingCurrentlyPracticing}
          setCurrentlyPracticing={setCurrentlyPracticing}
        />
      )}

      {/** ---- log out button */}
      <button
        className="text-sm text-black/40 underline mt-10"
        onClick={handleSignOut}
      >
        Log out
      </button>
    </div>
  );
}
