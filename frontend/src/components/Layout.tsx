import { Outlet } from "react-router-dom";
import Header from "./Header.tsx";
import { useState, createContext, useContext } from "react";
import LogSheet from "./Logging/LogSheet.tsx";
import LogSheetDetail from "./Logging/LogSheetDetail.tsx";
import { getAuth } from "firebase/auth";
import LogFinish from "./Logging/LogFinish.tsx";
import EditLogSheetDetail from "./Logging/EditLogSheetDetail.tsx";
import EditLogFinish from "./Logging/EditLogFinish.tsx";
// importing types and util functions
import { LayoutContextType, LogTargetType } from "../types.ts";

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export default function Layout() {
  const [isLogging, setIsLogging] = useState(false);
  const [isLoggingDetail, setIsLoggingDetail] = useState(false);
  const [isLoggingFinished, setIsLoggingFinished] = useState(false);
  const [isEditingLogDetail, setIsEditingLogDetail] = useState(false);
  const [isEditingLogFinished, setIsEditingLogFinished] = useState(false);
  const auth = getAuth();
  // getting fields of the auth object;
  const isLoggedIn = auth.currentUser;
  const uid = auth.currentUser?.uid;
  const displayName = auth.currentUser?.displayName;
  const photoURL = auth.currentUser?.photoURL;
  const [logTarget, setLogTarget] = useState<LogTargetType>({
    // this is the sheet that the user wants to log.
    fullName: null,
    title: null,
    composer: null,
    sheetId: null,
  });
  return (
    <LayoutContext.Provider
      value={{
        setIsLogging,
        setIsLoggingDetail,
        setIsLoggingFinished,
        setIsEditingLogDetail,
        setIsEditingLogFinished,
        isLoggingFinished,
        isEditingLogFinished,
        logTarget,
        setLogTarget,
        uid,
        displayName: displayName || "",
        photoURL: photoURL || "",
        isLoggedIn,
        auth
      }}
    >
      
      {isLogging && <LogSheet />}
      {isLoggingDetail && <LogSheetDetail />}
      {isLoggingFinished && <LogFinish />}
      {isEditingLogDetail && <EditLogSheetDetail />}
      {isEditingLogFinished && <EditLogFinish />}

      <div
        className="min-h-screen h-fit bg-primary font-HKGrotesk p-4 
        flex flex-col justifty-center items-center gap-6 md:gap-40
        "
      >
        <Header />

        <main className="w-full max-w-[55rem]">
          <Outlet />
        </main>
      </div>
    </LayoutContext.Provider>
  );
}

export { LayoutContext };

// exporting a custon useLayout hook to make sure the context is defined, so
// TypeScript won't complain when destructuring the value prop.
export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context)
    throw new Error("useLayout must be used within a Layout Provider");
  return context;
}
