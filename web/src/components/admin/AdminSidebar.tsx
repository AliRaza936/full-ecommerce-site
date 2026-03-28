"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/Brand/logo-colored.svg"
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  ChevronDown,
  X,
  Percent
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  // Dropdown states
  const [productOpen, setProductOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(pathname.includes("/admin/category"));
  const [offerOpen, setOfferOpen] = useState(pathname.includes("/admin/offer"));

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 bg-slate- border-b border-slate-800 shrink-0">
          <Image src={logo} alt="Brand" className="h-8 w-auto" />
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
          
          <Link href="/admin">
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${isActive("/admin") ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </div>
          </Link>

          {/* Products Dropdown */}
          <div className="pt-2">
            <div 
              onClick={() => setProductOpen(!productOpen)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Package size={20} />
                <span className="font-medium">Products</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${productOpen ? "rotate-180" : ""}`} />
            </div>
            
            <div className={`overflow-hidden transition-all duration-300 ${productOpen ? "max-h-40 mt-1" : "max-h-0"}`}>
              <div className="ml-9 flex flex-col space-y-1">
                <Link href="/admin/product">
                  <span className={`block px-3 py-2 text-sm rounded-lg ${isActive("/admin/product") ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`}>All Products</span>
                </Link>
                <Link href="/admin/product/create">
                  <span className={`block px-3 py-2 text-sm rounded-lg ${isActive("/admin/product/create") ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`}>Add Product</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Categories Dropdown */}
          <div className="pt-2">
            <div 
              onClick={() => setCategoryOpen(!categoryOpen)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${pathname.includes("/admin/category") ? "text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
            >
              <div className="flex items-center gap-3">
                <Tags size={20} />
                <span className="font-medium">Categories</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`} />
            </div>
            
            <div className={`overflow-hidden transition-all duration-300 ${categoryOpen ? "max-h-40 mt-1" : "max-h-0"}`}>
              <div className="ml-9 flex flex-col space-y-1">
                <Link href="/admin/category">
                  <span className={`block px-3 py-2 text-sm rounded-lg ${isActive("/admin/category") ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`}>All Categories</span>
                </Link>
                <Link href="/admin/category/create">
                  <span className={`block px-3 py-2 text-sm rounded-lg ${isActive("/admin/category/create") ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`}>Add Category</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Offers Dropdown */}
          <div className="pt-2">
            <div 
              onClick={() => setOfferOpen(!offerOpen)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${pathname.includes("/admin/offer") ? "text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
            >
              <div className="flex items-center gap-3">
                <Percent size={20} />
                <span className="font-medium">Offers & Deals</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${offerOpen ? "rotate-180" : ""}`} />
            </div>
            
            <div className={`overflow-hidden transition-all duration-300 ${offerOpen ? "max-h-40 mt-1" : "max-h-0"}`}>
              <div className="ml-9 flex flex-col space-y-1">
                <Link href="/admin/offer">
                  <span className={`block px-3 py-2 text-sm rounded-lg ${isActive("/admin/offer") ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`}>All Offers</span>
                </Link>
                <Link href="/admin/offer/create">
                  <span className={`block px-3 py-2 text-sm rounded-lg ${isActive("/admin/offer/create") ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`}>Add Offer</span>
                </Link>
              </div>
            </div>
          </div>

          <Link href="/admin/orders">
            <div className={`flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg transition-colors cursor-pointer ${isActive("/admin/orders") ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
              <ShoppingCart size={20} />
              <span className="font-medium">Orders</span>
            </div>
          </Link>

        </div>
      </div>
    </>
  );
}
