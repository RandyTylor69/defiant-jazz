import { Outlet } from "react-router-dom";
import Header from "./Header.tsx";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen h-fit bg-primary font-HKGrotesk
    p-4 
    flex flex-col justifty-center items-center gap-6 md:gap-40
    ">
      <Header />
      <main className="w-full max-w-[55rem]">
        <Outlet />
      </main>
    </div>
  );
}
