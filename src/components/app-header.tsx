"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand-logo";
import { clearStoredUserProfile } from "@/lib/user-profile";

const authedLinks = [
  { href: "/", label: "Home" },
  { href: "/analyze", label: "Analyze" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" },
  { href: "/profile", label: "Profile" },
  { href: "/guide", label: "Guide" },
];

const guestLinks = [
  { href: "/", label: "Home" },
  { href: "/guide", label: "Guide" },
];

export function AppHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isAuthed = isClient
    ? Boolean(localStorage.getItem("rp_google_token") ?? localStorage.getItem("rp_auth_token"))
    : false;

  const navLinks = isAuthed ? authedLinks : guestLinks;

  const logout = () => {
    localStorage.removeItem("rp_google_token");
    localStorage.removeItem("rp_auth_token");
    localStorage.removeItem("rp_analysis_data");
    localStorage.removeItem("rp_repo_name");
    clearStoredUserProfile();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800/80 bg-black/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <BrandLogo compact />

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-white !text-black font-medium"
                    : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {isAuthed ? (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1 rounded-md border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-900"
            >
              <LogOut size={14} />
              Logout
            </button>
          ) : pathname !== "/login" ? (
            <Link href="/login" className="rounded-md bg-white px-3 py-1.5 text-sm font-medium !text-black hover:bg-neutral-200 hover:!text-black">
              Login
            </Link>
          ) : null}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md border border-neutral-700 p-2 text-neutral-200 md:hidden"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-neutral-800 bg-black px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm",
                    active
                      ? "bg-white !text-black font-medium"
                      : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            {isAuthed ? (
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center gap-1 rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-900"
              >
                <LogOut size={14} />
                Logout
              </button>
            ) : pathname !== "/login" ? (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-md bg-white px-3 py-2 text-center text-sm font-medium !text-black hover:bg-neutral-200 hover:!text-black"
              >
                Login
              </Link>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
