import { getAdminSession } from "@/lib/admin-auth";
import { getAdminUsersList } from "@/lib/actions/admin-auth";
import { AdminCreateForm } from "./admin-form";
import { AdminUsersTable } from "./admin-table";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const users = await getAdminUsersList();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-rust text-xs uppercase tracking-widest font-semibold">Access Control</span>
          <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-mono px-2 py-0.5 rounded-pill border border-emerald-500/20">
            JWT Authenticated
          </span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-navy">Administrator Management</h1>
        <p className="text-sm text-muted mt-1">
          Control portal access. Only authenticated administrators can generate credentials for new team members.
        </p>
      </div>

      {/* Create New Admin Form */}
      <AdminCreateForm />

      {/* Admin Users Table */}
      <AdminUsersTable users={users} currentAdminUsername={session.username} />
    </div>
  );
}
