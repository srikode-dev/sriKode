"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { IoChevronDown, IoClose } from "react-icons/io5";

import { navLinks } from "@/data/navigation";

export default function MobileMenu({
  menuOpen,
  setMenuOpen,
}) {
  const pathname = usePathname();

  const [showCategories, setShowCategories] =
    useState(false);

  return (
    <div
      className={`
        fixed inset-0 z-50 md:hidden
        ${menuOpen ? "visible" : "invisible"}
      `}
    >
      {/* Overlay */}

      <div
        className={`
          absolute inset-0 bg-black/50
          transition-opacity duration-300
          ${menuOpen ? "opacity-100" : "opacity-0"}
        `}
        onClick={() => setMenuOpen(false)}
      />

      {/* Drawer */}

      <div
        className={`
          absolute top-0 right-0
          h-full w-80 max-w-[85vw]
          bg-white shadow-xl
          transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b p-5">
          <h2 className="font-bold text-xl">
            SRIKODE
          </h2>

          <button
            onClick={() => setMenuOpen(false)}
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Navigation */}

        <div className="p-5 space-y-4">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`block ${
                pathname === item.href
                  ? "text-blue-600 font-medium"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}


        </div>
      </div>
    </div>
  );
}