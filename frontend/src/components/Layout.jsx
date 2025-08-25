import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen h-fit bg-primary font-HKGrotesk
    p-4 
    flex flex-col justifty-center items-center gap-4 md:gap-12 lg:gap-20
    ">
      <Header />
      <main className="w-full max-w-[60rem]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
