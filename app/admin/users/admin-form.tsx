"use client";

import { useState } from "react";
import { createAdminUserAction } from "@/lib/actions/admin-auth";

export function AdminCreateForm() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: string; error?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("name", name);
    formData.append("password", password);
    formData.append("role", role);

    try {
      const res = await createAdminUserAction(null, formData);
      if (res?.error) {
        setResult({ error: res.error });
      } else if (res?.success) {
        setResult({ success: res.success });
        setUsername("");
        setName("");
        setPassword("");
        setRole("admin");
      }
    } catch (err: any) {
      setResult({ error: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-card p-6 sm:p-8 rounded-card border border-navy/10 shadow-sm">
      <div className="border-b border-navy/10 pb-4 mb-6">
        <h2 className="font-serif text-xl font-bold text-navy flex items-center gap-2">
          <span>➕</span> Add New Admin Account
        </h2>
        <p className="text-xs text-muted mt-1">
          Only authenticated admins can provision new administrator accounts. Passwords are encrypted with cryptographic scrypt hashing.
        </p>
      </div>

      {result?.error && (
        <div className="mb-6 p-4 rounded-card bg-red-500/10 border border-red-500/20 text-red-700 text-xs flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{result.error}</span>
        </div>
      )}

      {result?.success && (
        <div className="mb-6 p-4 rounded-card bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{result.success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-1.5">
              Username <span className="text-rust">*</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. kiran, travel_lead"
              className="w-full px-4 py-2.5 bg-sand/30 border border-navy/15 rounded-card text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust transition-colors"
            />
            <p className="text-[10px] text-muted mt-1">Unique alphanumeric identifier for login</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-1.5">
              Full Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kiran Kumar"
              className="w-full px-4 py-2.5 bg-sand/30 border border-navy/15 rounded-card text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust transition-colors"
            />
            <p className="text-[10px] text-muted mt-1">Admin representative name</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-1.5">
              Temporary / Permanent Password <span className="text-rust">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-2.5 pr-10 bg-sand/30 border border-navy/15 rounded-card text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy text-xs"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-[10px] text-muted mt-1">Must be at least 8 characters long</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-1.5">
              Admin Role & Permission
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-sand/30 border border-navy/15 rounded-card text-sm text-navy focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust transition-colors"
            >
              <option value="admin">Administrator (Standard Access)</option>
              <option value="superadmin">Super Administrator (Full System Control)</option>
            </select>
            <p className="text-[10px] text-muted mt-1">Defines management privileges</p>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-navy hover:bg-navy-light text-white text-xs font-semibold uppercase tracking-wider rounded-pill transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Admin Account...</span>
              </>
            ) : (
              <span>Create Admin Account</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
