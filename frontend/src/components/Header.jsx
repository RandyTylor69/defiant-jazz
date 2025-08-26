import { FaPlus } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
export default function Header() {
  return (
    <header className="w-full max-w-[55rem]">
      <nav
        className="w-full flex flex-row justify-between
      pt-4"
      >
        {/** ---- left nav div ------- */}
        <div className="flex flex-row justify-between gap-4">
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
        <button className="btn-tertiary">
          <FaPlus />
        </button>
      </nav>
    </header>
  );
}
