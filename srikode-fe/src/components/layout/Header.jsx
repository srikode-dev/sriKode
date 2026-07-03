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
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  const isCategoryPage = pathname.startsWith("/category");

  return (
    <header className="sticky top-0 z-50 border-b border-sk-border bg-sk-bg/85 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold tracking-wider text-sk-text hover:text-sk-primary transition-colors">
            SRIKODE
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((item, index) => (
              <React.Fragment key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-semibold transition-colors duration-200",
                    pathname === item.href
                      ? "text-sk-primary"
                      : "text-sk-text-muted hover:text-sk-primary",
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

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-2xl text-sk-text hover:text-sk-primary transition-colors"
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
