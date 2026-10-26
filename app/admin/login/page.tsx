"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { adminLoginAction } from "@/lib/actions/admin-auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-pill bg-rust py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-rust-light hover:shadow-lg disabled:opacity-50"
    >
      {pending ? "Signing in..." : "Sign In to Admin Portal"}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(adminLoginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-navy flex flex-col justify-center items-center px-4 py-12">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-rust/10 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block bg-white px-3 py-1.5 rounded-card shadow-md mb-3">
            <Image
              src="/logo.png"
              alt="Payana - ಪಯಣ"
              width={160}
              height={44}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
            Admin Staff Portal
          </h1>
          <p className="text-xs text-white/60 mt-1 uppercase tracking-widest font-sans">
            Authorized Personnel Only
          </p>
        </div>

        <div className="bg-card rounded-card p-8 shadow-2xl border border-white/10">
          {state?.error && (
            <div className="mb-6 p-3.5 rounded-card bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <span>⚠️</span>
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold uppercase tracking-wider text-navy mb-1.5"
              >
                Admin Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="Enter admin username"
                className="w-full rounded-pill border border-navy/20 bg-page px-4 py-2.5 text-sm text-navy placeholder:text-muted focus:border-rust focus:outline-none focus:ring-1 focus:ring-rust"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-navy mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full rounded-pill border border-navy/20 bg-page px-4 py-2.5 text-sm text-navy placeholder:text-muted focus:border-rust focus:outline-none focus:ring-1 focus:ring-rust pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-navy text-xs"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <SubmitButton />
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-navy/10 text-center">
            <p className="text-xs text-muted">
              Default Master Admin: <span className="font-mono text-navy font-medium">admin</span>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs text-white/60 hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <span>←</span>
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
