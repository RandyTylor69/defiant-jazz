import { Outlet } from "react-router-dom";
import Header from "./Header.tsx";
import { useState, createContext, useContext } from "react";
import LogSheet from "./LogSheet.tsx";
import LogSheetDetail from "./LogSheetDetail.tsx";
import { getAuth } from "firebase/auth";

type LayoutContextType = {
  setIsLogging: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggingDetail: React.Dispatch<React.SetStateAction<boolean>>;
  logTarget: LogTargetType;
  setLogTarget: React.Dispatch<React.SetStateAction<LogTargetType>>;
  uid: string | undefined;
  slugify:(fullName:string) => string;
};

type LogTargetType = {
  fullName: string | null;
  title: string | null;
  composer: string | null;
  sheetId: string | null;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export default function Layout() {
  const [isLogging, setIsLogging] = useState(false);
  const [isLoggingDetail, setIsLoggingDetail] = useState(false);
  const auth = getAuth();
  const uid = auth.currentUser?.uid
  const [logTarget, setLogTarget] = useState<LogTargetType>({
    // this is the sheet that the user wants to log.
    fullName: null,
    title: null,
    composer: null,
    sheetId: null
  });
  return (
    <LayoutContext.Provider
      value={{ setIsLogging, setIsLoggingDetail, logTarget, setLogTarget, slugify, uid }}
    >
      {isLogging && <LogSheet />}
      {isLoggingDetail && <LogSheetDetail />}

      <div
        className="min-h-screen h-fit bg-primary font-HKGrotesk
    p-4 
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

// a function that turns a sheet's full name into URL-friendly slug strings.
 function slugify(fullName: string):string {
    return fullName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")  // remove special chars
      .replace(/\s+/g, "-")          // replace spaces with dashes
      .replace(/-+/g, "-");          // remove repeated dashes
  }
