"use client";

import React from "react";
import { Menu, User, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface AdminNavbarProps {
  onMenuClick: () => void;
}

export default function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const { userData } = useSelector((state: any) => state.user);

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
      {/* Left side: Mobile menu toggle */}
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
        >
          <Menu size={24} />
        </button>
        <span className="hidden lg:block font-semibold text-slate-800 text-lg">
          Dashboard Overview
        </span>
      </div>

      {/* Right side: User Profile */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {userData?.name || "Admin User"}
            </p>
            <p className="text-xs text-slate-500 capitalize">{userData?.role || "Admin"}</p>
          </div>
          
          <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden">
            {userData?.image ? (
              <Image src={userData.image} alt="Admin" width={36} height={36} className="w-full h-full object-cover" />
            ) : userData?.email ? (
              <span className="text-sm font-bold text-slate-600">{userData.email.charAt(0).toUpperCase()}</span>
            ) : (
              <User size={20} className="text-slate-600" />
            )}
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
          title="Sign Out"
        >
          <LogOut size={20} />
          <span className="hidden sm:block text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
