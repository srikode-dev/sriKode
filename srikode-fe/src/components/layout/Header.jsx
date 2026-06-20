"use client";

import Link from "next/link";

import { FaSearch } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

import Container from "../shared/Container";

import { categories, navLinks } from "@/data/navigation";
import React from "react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* logo  */}
          <Link href="/" className="text-2xl font-bold tracking-wide">
            SRIKODE
          </Link>

          {/* nav  */}
          <nav
            className="flex items-center gap-8
            "
            // add hidden ad md:flex
          >
            {navLinks.map((item, index) => (
              <React.Fragment key={item.name}>
                {index === 2 && (
                  <div className="group relative">
                    <button className="flex items-center gap-1 text-sm font-medium">
                      Categories
                      <IoChevronDown />
                    </button>
                    <div className=" absolute left-0 top-full invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 min-w-55 rounded-lg border  bg-white shadow-lg py-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/category/${cat.slug}`}
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          {cat?.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  href={item.href}
                  className="text-sm font-medium hover:text-blue-600 transition"
                >
                  {item.name}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          {/* search  */}

          <button className="text-lg">
            <FaSearch />
          </button>
        </div>
      </Container>
    </header>
  );
};

export default Header;
