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
        className="text-lg"
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
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default SearchBox;
