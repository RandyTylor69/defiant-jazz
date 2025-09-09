import { FaSearch } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ setIsSearching }) {
  const [searchParams, setSearchParams] = useState("");
  const navigate = useNavigate();
  function handleChange(value: string) {
    setSearchParams(value);
  }
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    navigate(`search/${searchParams}`);
    window.location.reload();
    setIsSearching(false);
  }

  return (
    <div className="flex flex-row sm:gap-2">
      <button className="text-black/20" onClick={() => setIsSearching(false)}>
        <MdCancel />
      </button>
      <form
        className="relative flex justify-center items-center"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={searchParams}
          onChange={(e) => handleChange(e.target.value)}
          className="home-search-input"
          placeholder="search sheets..."
          required
        />
        <button type="submit" className="absolute right-2 text-black/20">
          <FaSearch />
        </button>
      </form>
    </div>
  );
}
