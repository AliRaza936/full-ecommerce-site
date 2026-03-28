"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { userData } = useSelector((state: any) => state.user);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      // Allow if either NextAuth session has role 'admin'/'dummy_admin' or Redux state has role 'admin'/'dummy_admin'
      const validAdminRoles = ["admin", "dummy_admin"];
      const sessionRole = (session?.user as any)?.role;
      const isSessionAdmin = sessionRole && validAdminRoles.includes(sessionRole);
      const isReduxAdmin = userData?.role && validAdminRoles.includes(userData.role);
      
      if (!isSessionAdmin && !isReduxAdmin) {
        router.push("/unauthorized");
      }
    }
  }, [status, session, userData, router]);

  if (status === "loading") {
    return <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">Authenticating...</div>;
  }

  // Prevent rendering admin layout if it's confirmed they are not admin, to avoid UI flicker
  const validAdminRoles = ["admin", "dummy_admin"];
  const isSessionAdmin = (session?.user as any)?.role && validAdminRoles.includes((session?.user as any).role);
  if (status === "authenticated" && !isSessionAdmin && (!userData?.role || !validAdminRoles.includes(userData.role))) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20">
          {children}
        </main>
      </div>
    </div>
  );
}
