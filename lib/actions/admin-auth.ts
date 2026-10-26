"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_COOKIE_NAME,
  hashPassword,
  verifyPassword,
  signAdminToken,
  getAdminSession,
} from "@/lib/admin-auth";

export async function adminLoginAction(prevState: any, formData: FormData) {
  const username = (formData.get("username") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  try {
    let admin = null;
    if (prisma) {
      admin = await prisma.adminUser.findUnique({
        where: { username },
      });

      // If no admin accounts exist yet, seed default master admin
      if (!admin) {
        const adminCount = await prisma.adminUser.count();
        if (adminCount === 0 && username === "admin" && password === "Payana@Admin2026") {
          admin = await prisma.adminUser.create({
            data: {
              username: "admin",
              password: hashPassword("Payana@Admin2026"),
              name: "Master Admin",
              role: "superadmin",
            },
          });
        }
      }
    }

    // --- Fallback removed ---
    // Previously allowed login with hardcoded credentials when DB was
    // unavailable. This was a security backdoor. If the database is
    // unreachable, admin login is now correctly denied.

    if (!admin) {
      return { error: "Invalid username or password." };
    }

    const isValid = verifyPassword(password, admin.password);
    if (!isValid) {
      return { error: "Invalid username or password." };
    }

    // Generate secure JWT token
    const token = await signAdminToken({
      id: admin.id,
      username: admin.username,
      role: admin.role,
      name: admin.name,
    });

    // Set secure HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours
    });
  } catch (err: any) {
    console.error("Admin login error:", err);
    return { error: "An unexpected error occurred during login. Please try again." };
  }

  redirect("/admin");
}

export async function adminLogoutAction() {
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}

import { revalidatePath } from "next/cache";

export async function createAdminUserAction(prevState: any, formData: FormData) {
  const session = await getAdminSession();
  if (!session || session.role !== "superadmin") {
    return { error: "Unauthorized. Only superadmins can create admin accounts." };
  }

  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const password = (formData.get("password") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const role = ((formData.get("role") as string)?.trim() || "admin");

  if (!username || username.length < 3) {
    return { error: "Username must be at least 3 characters." };
  }

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  try {
    if (!prisma) {
      return { error: "Database not connected." };
    }

    const existing = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (existing) {
      return { error: `Admin username '${username}' already exists.` };
    }

    await prisma.adminUser.create({
      data: {
        username,
        password: hashPassword(password),
        name: name || username,
        role,
      },
    });

    revalidatePath("/admin/users");
    return { success: `Admin account '${username}' created successfully.` };
  } catch (err: any) {
    console.error("Error creating admin user:", err);
    return { error: "Failed to create admin account." };
  }
}

export async function deleteAdminUserAction(id: string) {
  const session = await getAdminSession();
  if (!session || session.role !== "superadmin") {
    return { error: "Unauthorized. Only superadmins can delete admin accounts." };
  }

  if (session.id === id) {
    return { error: "You cannot delete your own account while logged in." };
  }

  try {
    if (!prisma) return { error: "Database not connected." };

    const total = await prisma.adminUser.count();
    if (total <= 1) {
      return { error: "Cannot delete the only existing admin account." };
    }

    await prisma.adminUser.delete({
      where: { id },
    });

    revalidatePath("/admin/users");
    return { success: "Admin deleted successfully." };
  } catch (err: any) {
    return { error: "Failed to delete admin." };
  }
}

export async function getAdminUsersList() {
  const session = await getAdminSession();
  if (!session || !prisma) return [];

  try {
    const list = await prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return list;
  } catch {
    return [];
  }
}
