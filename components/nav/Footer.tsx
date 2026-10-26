"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide customer footer on admin portal
  if (pathname.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="mt-24 bg-navy text-white/80 pb-20 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="bg-white px-3 py-1.5 rounded-card inline-block mb-3 shadow-sm">
              <Image
                src="/logo.png"
                alt="Payana - ಪಯಣ"
                width={160}
                height={44}
                className="h-8 w-auto object-contain"
              />
            </div>

            <p className="font-serif text-sm font-medium text-rust-light">
              ಪ್ರತಿಯೊಂದು ಹೆಜ್ಜೆ ... ಒಂದು ಕಥೆ...
            </p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/60">
              Curated luxury journeys, reserved down to the finest detail.
            </p>
          </div>


          <div>
            <p className="text-sm font-medium text-white">Explore</p>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li><Link href="/destinations" className="hover:text-white">Destinations</Link></li>
              <li><Link href="/destinations?category=Beach" className="hover:text-white">Beach</Link></li>
              <li><Link href="/destinations?category=Mountain" className="hover:text-white">Mountain</Link></li>
              <li><Link href="/destinations?category=Culture" className="hover:text-white">Culture</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-white">Contact Us</p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/60">
              <li>
                <a
                  href="https://wa.me/918970644859?text=Hello%20Payana%2C%20I%20would%20like%20to%20inquire%20about%20a%20curated%20journey."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-2"
                >
                  <span>📞</span> +91 89706 44859
                </a>
              </li>
              <li>
                <a href="https://wa.me/918970644859" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2">
                  <span>💬</span> WhatsApp Support
                </a>
              </li>
              <li>
                <a href="mailto:contact@payanakarunadu.online" className="hover:text-white flex items-center gap-2">
                  <span>✉️</span> contact@payanakarunadu.online
                </a>
              </li>
              <li><Link href="/about" className="hover:text-white">About us</Link></li>
              <li><Link href="/concierge" className="hover:text-white">Custom Plan</Link></li>

            </ul>
          </div>


          <div>
            <p className="text-sm font-medium text-white">Follow</p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/60">
              <li>
                <a
                  href="https://www.instagram.com/payana_karunadu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-2 group transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-pink-400 group-hover:scale-110 transition-transform"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span>Instagram <span className="text-white/40">(@payana_karunadu)</span></span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/918970644859?text=Hello%20Payana%2C%20I%20would%20like%20to%20inquire%20about%20a%20curated%20journey."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-2 transition-colors"
                >
                  <span>💬</span>
                  <span>WhatsApp Updates</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Payana (ಪಯಣ). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p>ಪ್ರತಿಯೊಂದು ಹೆಜ್ಜೆ ... ಒಂದು ಕಥೆ...</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
