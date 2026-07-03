"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { IoChevronDown } from "react-icons/io5";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

import Container from "../shared/Container";
import { categories, navLinks } from "@/data/navigation";
import SearchBox from "./SearchBox";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  const isCategoryPage = pathname.startsWith("/category");

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-wide">
            SRIKODE
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((item, index) => (
              <React.Fragment key={item.name}>


                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition",
                    pathname === item.href
                      ? "text-blue-600"
                      : "hover:text-blue-600",
                  )}
                >
                  {item.name}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Desktop Search */}
            <div className="hidden md:block">
              <SearchBox />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setMenuOpen(true)}
            >
              <HiOutlineMenuAlt3 />
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer */}
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </header>
  );
};

export default Header;
