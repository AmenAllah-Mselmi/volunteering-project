"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Logo from "@/app/favicon.ico";

export default function Navbar() {
  const [open, setOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div className="w-full text-gray-700 bg-white dark:text-gray-200 dark:bg-gray-800 fixed top-0 left-0 z-20 ">
      <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
        {/* Logo & Mobile Menu Toggle */}
        <div className="p-4 flex flex-row items-center justify-between">
          <a href="/" className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark:text-white flex items-center">
            <Image src={Logo} alt="RocketBot Logo" width={70} height={70} className="mr-2" />
            BridgeVolunteer
          </a>
          <button className="md:hidden rounded-lg focus:outline-none" onClick={() => setOpen(!open)}>
            {open ? (
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className={`flex-col flex-grow pb-4 md:pb-0 md:flex md:justify-end md:flex-row ${open ? "flex" : "hidden"}`}>
          <a href="/" className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-gray-200">Home</a>
          <a href="/about" className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-gray-200 md:ml-4">About</a>
          <a href="/team" className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-gray-200 md:ml-4">Team</a>
          <a href="/login" className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-gray-200 md:ml-4">Login</a>
          <a href="/contact" className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-gray-200 md:ml-4">Contact</a>
        </nav>
      </div>
    </div>
  );
}
