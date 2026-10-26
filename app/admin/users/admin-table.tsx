"use client";

import { useState } from "react";
import { deleteAdminUserAction } from "@/lib/actions/admin-auth";

interface AdminUserRow {
  id: string;
  username: string;
  name: string | null;
  role: string;
  createdAt: Date;
}

export function AdminUsersTable({
  users,
  currentAdminUsername,
}: {
  users: AdminUserRow[];
  currentAdminUsername?: string;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleDelete(id: string, username: string) {
    if (!confirm(`Are you sure you want to delete admin account '${username}'? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    setErrorMsg(null);
    try {
      const res = await deleteAdminUserAction(id);
      if (res?.error) {
        setErrorMsg(res.error);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete admin");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="bg-card rounded-card border border-navy/10 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-navy/10 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-navy flex items-center gap-2">
            <span>🛡️</span> Active Administrator Accounts
          </h2>
          <p className="text-xs text-muted mt-1">
            Accounts with privileged access to Payana management portal.
          </p>
        </div>
        <span className="text-xs font-mono bg-navy/5 text-navy px-2.5 py-1 rounded-pill">
          {users.length} {users.length === 1 ? "Admin" : "Admins"}
        </span>
      </div>

      {errorMsg && (
        <div className="m-4 p-3 rounded-card bg-red-500/10 border border-red-500/20 text-red-700 text-xs">
          {errorMsg}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-sand/40 border-b border-navy/10 uppercase tracking-wider text-[11px] text-muted font-semibold">
            <tr>
              <th className="py-3.5 px-6">Username</th>
              <th className="py-3.5 px-6">Display Name</th>
              <th className="py-3.5 px-6">Role</th>
              <th className="py-3.5 px-6">Provisioned Date</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/10">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 px-6 text-center text-muted">
                  No admin users recorded yet.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isCurrent = user.username.toLowerCase() === currentAdminUsername?.toLowerCase();

                return (
                  <tr key={user.id} className="hover:bg-sand/20 transition-colors">
                    <td className="py-4 px-6 font-medium text-navy">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{user.username}</span>
                        {isCurrent && (
                          <span className="bg-rust/10 text-rust text-[9px] font-semibold px-2 py-0.5 rounded-pill">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-navy/80">{user.name || "—"}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-pill text-[10px] font-semibold uppercase tracking-wider ${
                          user.role === "superadmin"
                            ? "bg-purple-500/10 text-purple-700 border border-purple-500/20"
                            : "bg-blue-500/10 text-blue-700 border border-blue-500/20"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-muted font-mono">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }) : "—"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {isCurrent ? (
                        <span className="text-[11px] text-muted italic">Active Session</span>
                      ) : (
                        <button
                          onClick={() => handleDelete(user.id, user.username)}
                          disabled={deletingId === user.id}
                          className="text-red-600 hover:text-red-800 font-medium hover:underline disabled:opacity-50 text-[11px]"
                        >
                          {deletingId === user.id ? "Deleting..." : "Revoke Access"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
