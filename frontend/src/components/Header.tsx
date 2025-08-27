import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import SearchBar from "./SearchBar.tsx";

export default function Header() {

  const [isSearching, setIsSearching] = useState(false);

  return (
    <header className="w-full max-w-[55rem]">
      <nav
        className="w-full flex flex-row justify-between
      pt-4"
      >
        {/** ---- left nav div ------- */}

        <div
          className={`flex flex-row justify-between gap-2 md:gap-4
         
          `}
        >
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              isActive ? "btn-primary" : "btn-secondary"
            }
          >
            <button>Home</button>
          </NavLink>
          <NavLink
            to={"community"}
            className={({ isActive }) =>
              isActive ? "btn-primary" : "btn-secondary"
            }
          >
            <button>Community</button>
          </NavLink>
        </div>

        {/** ---- rightnav div ------- */}
        {isSearching ? (
          <SearchBar setIsSearching={setIsSearching} />
        ) : (
          <div className="flex flex-row gap-4">
            <button
              className="btn-tertiary"
              onClick={() => setIsSearching(true)}
            >
              <FaSearch />
            </button>
            <button className="btn-tertiary">
              <FaPlus />
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
