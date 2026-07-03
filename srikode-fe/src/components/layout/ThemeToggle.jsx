"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-lg" />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 active:scale-95 hover:bg-sk-primary-light/50"
      style={{
        backgroundColor: "var(--sk-bg-card)",
        borderColor: "var(--sk-border-strong)",
        color: "var(--sk-text)",
      }}
    >
      {theme === "dark" ? (
        <FiSun size={15} style={{ color: "var(--sk-primary)" }} />
      ) : (
        <FiMoon size={15} style={{ color: "var(--sk-text)" }} />
      )}
    </button>
  );
}
