"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Logo } from "@/components/logo";
import { getLenis } from "@/components/providers";

const links = [
  { href: "/#collection", label: "Collection" },
  { href: "/#philosophy", label: "Philosophy" },
  { href: "/#inquiry", label: "Inquiry" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openPath, setOpenPath] = useState(pathname);
  if (pathname !== openPath) {
    setOpenPath(pathname);
    setOpen(false);
  }
  const isHome = pathname === "/";
  const showLogo = !isHome || scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function onNavigate(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("/#") || pathname !== "/") return;
    const id = href.slice(2);
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    setOpen(false);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { offset: -12 });
    else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", href);
  }

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        open
          ? "pointer-events-auto bg-transparent"
          : scrolled
            ? "pointer-events-auto bg-[#0a0a0a]/80 backdrop-blur-md"
            : "pointer-events-none bg-transparent"
      }`}
    >
      <div className="relative flex items-center justify-between px-[6vw] py-5">
        <Link
          href="/"
          aria-label="Lord Bae, home"
          className={`transition-opacity duration-700 ${showLogo ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <Logo className="h-14 w-auto max-w-[62vw] sm:h-16 sm:max-w-none" />
        </Link>
        <nav className="pointer-events-auto hidden items-center gap-9 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => onNavigate(event, link.href)}
              className="text-[0.68rem] tracking-[0.22em] text-[#d9d2c6] uppercase transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="pointer-events-auto text-[0.68rem] tracking-[0.22em] uppercase md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
    </header>
      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-[#0a0a0a] px-[6vw] pt-28 pb-16 md:hidden"
          >
            <ul className="space-y-6">
              {links.map((link, index) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(event) => onNavigate(event, link.href)}
                    className="display block text-6xl"
                    style={{ transitionDelay: `${index * 40}ms` }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}
