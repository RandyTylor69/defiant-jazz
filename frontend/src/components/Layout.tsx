import { Outlet } from "react-router-dom";
import Header from "./Header.tsx";
import { useState, createContext, useContext } from "react";
import LogSheet from "./LogSheet.tsx";

type LayoutContextType = {
  setIsLogging: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggingDetail: React.Dispatch<React.SetStateAction<boolean>>;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export default function Layout() {
  const [isLogging, setIsLogging] = useState(false);
  const [isLoggingDetail, setIsLoggingDetail] = useState(false)
  return (
    <LayoutContext.Provider value={{ setIsLogging, setIsLoggingDetail }}>

      {isLogging && <LogSheet />}

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
