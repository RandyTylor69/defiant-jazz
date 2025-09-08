import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import SearchBar from "./SearchBar.tsx";
import { FaUserLarge } from "react-icons/fa6";
import { useAuth } from "./AuthProvider.tsx";
import { useLayout } from "./Layout.tsx";

export default function Header() {
  const [isSearching, setIsSearching] = useState(false);
  const { currentUser, userLoggedIn } = useAuth();
  const { setIsLogging, setIsAnyLogWindowOpen, isAnyLogWindowOpen } =
    useLayout();

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
          // --------- search
          <div className="flex flex-row gap-4">
            <button
              className="btn-tertiary"
            >
              <FaSearch />
            </button>
            {/** -------user  */}
            {userLoggedIn && (
              <NavLink
                to={`${currentUser?.uid}`}
              >
                {({ isActive }) => (
                  <button
                    className={`btn-tertiary ${
                      isActive ? "bg-black/70 text-primary" : ""
                    }`}
                  >
                    <FaUserLarge />
                  </button>
                )}
              </NavLink>
            )}
            {userLoggedIn && (
              <button
                className="btn-tertiary"
                onClick={() => {
                  setIsLogging((prev) => !prev);
                  setIsAnyLogWindowOpen(true);
                }}
              >
                <FaPlus />
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
