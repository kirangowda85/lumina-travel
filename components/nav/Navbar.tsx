"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const links = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/bookings", label: "My Bookings" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  // Hide public customer navbar on admin portal pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-page/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Payana - ಪಯಣ"
            width={160}
            height={44}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>


        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-1 text-sm font-medium transition-colors ${
                isActive(link.href) ? "text-navy" : "text-muted hover:text-navy"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] rounded-full bg-rust" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/919876543210?text=Hello%20Payana%2C%20I%20would%20like%20to%20inquire%20about%20a%20curated%20journey."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-navy bg-navy/5 hover:bg-navy/10 px-3 py-1.5 rounded-pill transition-colors"
            title="Chat on WhatsApp"
          >
            <span>📞</span>
            <span>+91 98765 43210</span>
          </a>

          <Link
            href="/concierge"
            className="hidden rounded-pill bg-rust px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-rust-light sm:inline-block"
          >
            Custom Plan
          </Link>



          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{ elements: { userButtonAvatarBox: "h-9 w-9" } }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Identity verification"
                  href="/profile/verification"
                  labelIcon={<VerificationIcon />}
                />
                <UserButton.Link
                  label="My bookings"
                  href="/bookings"
                  labelIcon={<BookingsIcon />}
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>


          <SignedOut>
            <Link
              href="/sign-in"
              className="rounded-pill border border-navy/20 px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-navy hover:text-white"
            >
              Sign in
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}

function VerificationIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" strokeWidth={1.6}>
      <path d="M9 12.5 11 14.5l4-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" />
    </svg>
  );
}

function BookingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" strokeWidth={1.6}>
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}



