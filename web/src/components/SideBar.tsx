"use client";

import {
  X,
  Home,
  List,
  Heart,
  ShoppingBag,
  Globe,
  Headphones,
  Info,
} from "lucide-react";
import flag1 from "@/assets/flag/uae.png";
import flag2 from "@/assets/flag/autralia.png";
import flag3 from "@/assets/flag/us.png";
import flag4 from "@/assets/flag/ru.png";
import flag5 from "@/assets/flag/it.png";
import flag6 from "@/assets/flag/dk.png";
import flag7 from "@/assets/flag/fr.png";
import flag8 from "@/assets/flag/grmerny.png";
import flag9 from "@/assets/flag/china.png";
import flag10 from "@/assets/flag/uk.png";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import Link from "next/link";
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
import user from "@/assets/avatar=pic1.jpg"
import Image from "next/image";
import axios from "axios";
import { useEffect } from "react";
export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { data: session } = useSession();
  const { userData } = useSelector((state: any) => state.user);

const countries = [
  { id: 1, name: "Arabic Emirates", flag: flag1 },
  { id: 2, name: "Australia", flag: flag2 },
  { id: 3, name: "United States", flag: flag3 },
  { id: 4, name: "Russia", flag: flag4 },
  { id: 5, name: "Italy", flag: flag5 },
  { id: 6, name: "Denmark", flag: flag6 },
  { id: 7, name: "France", flag: flag7 },
  { id: 8, name: "Germany", flag: flag8 },
  { id: 9, name: "China", flag: flag9 },
  { id: 10, name: "Great Britain", flag: flag10 },
];
const [shipOpen, setShipOpen] = useState(false);
const [selectedCountry, setSelectedCountry] = useState(countries[7]);
const [categoriesOpen, setCategoriesOpen] = useState(false);
const [categories, setCategories] = useState<any[]>([]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/category");
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };
  fetchCategories();
}, []);
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
  className={`fixed top-0 left-0 h-full w-70 bg-white z-50 transform transition-transform duration-300 overflow-y-auto scrollbar-hide ${
    isOpen ? "translate-x-0" : "-translate-x-full"
  }`}
>
        {/* Header */}
        <div className="p-5 px-8 border-b flex flex-col bg-gray-100">
            <div className="flex justify-between mb-2">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-blue-100 text-blue-600 font-bold border-2 border-blue-200">
                    {userData?.image ? (
                        <Image src={userData.image} alt="user" width={48} height={48} className="w-full h-full object-cover" />
                    ) : userData?.email ? (
                        <span className="text-xl">{userData.email.charAt(0).toUpperCase()}</span>
                    ) : (
                        <Image src={user} alt="user" className="w-full h-full filter grayscale-75"/>
                    )}
                </div> 
                <X className="cursor-pointer" onClick={onClose} />
            </div>
          
            
            <div className="flex flex-col mt-2 gap-1">
              {userData ? (
                <>
                  <p className="font-semibold text-gray-800">{userData.name || 'User'}</p>
                  <p className="text-sm text-gray-500">{userData.email}</p>
                  <div className="flex gap-3 mt-2">
                    <Link href="/user/profile" onClick={onClose} className="text-sm text-blue-600 font-medium hover:underline">Edit Profile</Link>
                    <span className="text-gray-300">|</span>
                    <button onClick={() => { signOut(); onClose(); }} className="text-sm text-red-500 hover:underline">Sign out</button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2 font-semibold">
                  <Link href="/login" onClick={onClose} className="hover:text-blue-600">Sign in</Link> 
                  <span className="text-gray-400">|</span> 
                  <Link href="/register" onClick={onClose} className="hover:text-blue-600">Register</Link>
                </div>
              )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-5 px-8 space-y-6 text-gray-700">
          <div className="flex items-center gap-3 cursor-pointer">
            <Home size={20} />
            <span>Home</span>
          </div>

          <div 
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => setCategoriesOpen(!categoriesOpen)}
          >
            <div className="flex items-center gap-3">
              <List size={20} className="group-hover:text-blue-600 transition-colors" />
              <span className="group-hover:text-blue-600 transition-colors font-medium">Categories</span>
            </div>
            <ChevronDown 
              size={18} 
              className={`transition-transform duration-300 ${categoriesOpen ? "rotate-180" : ""}`} 
            />
          </div>

          {categoriesOpen && (
            <div className="ml-8 mt-2 space-y-1 border-l-2 border-blue-50 pl-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {categories.length > 0 ? (
                categories.map((cat: any) => (
                  <Link href={`/user/shop?category=${cat.slug}`}>
                  <div 
                    key={cat._id} 
                    className="py-2.5 text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
                    onClick={onClose}
                  >
                    {cat.title}
                  </div></Link>
                ))
              ) : (
                <div className="py-2 text-xs text-gray-400 italic">No categories found</div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 cursor-pointer">
            <Heart size={20} />
            <span>Favorites</span>
          </div>

          <div className="flex items-center gap-3 cursor-pointer">
            <ShoppingBag size={20} />
            <span>My orders</span>
          </div>

          <hr />

         <div className="space-y-3">

  {/* Language */}
  <div className="flex items-center gap-3 cursor-pointer">
    <Globe size={20} />
    <span>English | USD</span>
  </div>

  {/* Ship To */}
  <div>
    <div
      onClick={() => setShipOpen(!shipOpen)}
      className="flex items-center justify-between cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <Image
          src={selectedCountry.flag}
          alt={selectedCountry.name}
          width={20}
          height={14}
          className="rounded-sm object-cover"
        />
        <span className="text-sm">{selectedCountry.name}</span>
      </div>

      <ChevronDown size={16} />
    </div>

    {shipOpen && (
      <div className="mt-3 bg-gray-50 rounded-md p-2 max-h-52 overflow-y-auto">
        {countries.map((country,i) => (
          <div
            key={country.id || i}
            onClick={() => {
              setSelectedCountry(country);
              setShipOpen(false);
            }}
            className="flex items-center gap-3 px-2 py-2 hover:bg-gray-200 rounded cursor-pointer"
          >
            <Image
              src={country.flag}
              alt={country.name}
              width={20}
              height={14}
              className="rounded-sm object-cover"
            />
            <span className="text-sm">{country.name}</span>
          </div>
        ))}
      </div>
    )}
  </div>

</div>
          <div className="flex items-center gap-3 cursor-pointer">
            <Headphones size={20} />
            <span>Contact us</span>
          </div>

          <div className="flex items-center gap-3 cursor-pointer">
            <Info size={20} />
            <span>About</span>
          </div>

          <hr />

          <div className="px-10 flex flex-col gap-5">
            <p className="text-sm text-gray-500 cursor-pointer">
            User agreement
          </p>
          <p className="text-sm text-gray-500 cursor-pointer">
            Partnership
          </p>
          <p className="text-sm text-gray-500 cursor-pointer">
            Privacy policy
          </p>
          </div>
        </div>
      </div>
    </>
  );
}