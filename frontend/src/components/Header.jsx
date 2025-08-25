import { FaPlus } from "react-icons/fa6";
export default function Header() {
  return (
    <header className="w-full max-w-[45rem]">
      <nav className="w-full flex flex-row justify-between
      pt-4">
        {/** ---- left nav div ------- */}
        <div className="flex flex-row justify-between gap-4">
          <button className="btn-primary">Home</button>
          <button className="btn-secondary">Community</button>
        </div>

        {/** ---- rightnav div ------- */}
        <button className="btn-tertiary"><FaPlus /></button>
      </nav>
    </header>
  );
}
