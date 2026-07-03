"use client";

import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBox = () => {
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center" ref={searchRef}>
      <button
        className="text-lg text-gray-550 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition"
        onClick={() => {
          setOpen((prev) => !prev);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 50);
        }}
      >
        <FaSearch />
      </button>
      {open && (
        <div className="absolute right-0 top-12 w-80">
          <input
            type="text"
            ref={inputRef}
            placeholder="Search ..."
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-150"
          />
        </div>
      )}
    </div>
  );
};

export default SearchBox;
