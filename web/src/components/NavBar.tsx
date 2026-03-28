"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import {
  ShoppingCart,
  Heart,
  MessageSquare,
  User,
  ShoppingBag,
  ChevronDown,
  Menu,
  Briefcase,
  MenuIcon,
  MenuSquareIcon,
  LucideMenu,
  Search,
  SearchX,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import logo from "@/assets/Brand/logo-colored.svg"
import Sidebar from "./SideBar";

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
import Link from "next/link";
import axios from "axios";

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
export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({ title: "All category", slug: "" });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shipOpen, setShipOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[7]); // default Germany
  const shipRef = useRef<HTMLDivElement>(null);
  const desktopUserMenuRef = useRef<HTMLDivElement>(null);
  const mobileUserMenuRef = useRef<HTMLDivElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { userData } = useSelector((state: any) => state.user);
  const { items } = useSelector((state: any) => state.cart);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearch = () => {
    let url = "/user/shop?";
    if (searchQuery.trim()) {
      url += `search=${encodeURIComponent(searchQuery.trim())}&`;
    }
    if (selected.slug) {
      url += `category=${selected.slug}&`;
    }
    
    setShowSuggestions(false);
    router.push(url);
  };

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

  useEffect(() => {
    if (searchQuery.trim().length < 1) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }

    // Set loading immediately to avoid "No products found" flicker during debounce
    setLoadingSuggestions(true);

    const fetchSuggestions = async () => {
      try {
        let url = `/api/user/product?search=${searchQuery}`;
        if (selected.slug) {
          url += `&category=${selected.slug}`;
        }

        const { data } = await axios.get(url);
        if (data.success) {
          setSuggestions(data.products.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching suggestions", error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 1000);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selected]);
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shipRef.current && !shipRef.current.contains(event.target as Node)) {
        setShipOpen(false);
      }
      
      const clickInDesktop = desktopUserMenuRef.current && desktopUserMenuRef.current.contains(event.target as Node);
      const clickInMobile = mobileUserMenuRef.current && mobileUserMenuRef.current.contains(event.target as Node);
      
      if (!clickInDesktop && !clickInMobile) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="w-full bg-white border-b lg:px-4 border-gray-200">
      {/* TOP NAVBAR */}
      <div className="max-w-300 mx-auto lg:px-4 px-4 lg:py-5 py-4 flex items-center lg:gap-12 justify-between lg:justify-normal">
        {/* LEFT - LOGO */}

        <div className="flex items-center min-w-30 h-6 gap-4">
          <div className="lg:hidden flex cursor-pointer" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </div>
        <Link href={'/'}>
          <Image
            src={logo}
            alt="Brand Logo"
            // width={150}
            // height={40}
            // priority
            className="lg:w-65 w-30"

          />
        </Link>
        </div>

        {/* SEARCH BAR */}
        <div ref={searchRef} className="hidden lg:flex items-center w-full border-2 border-blue-500 rounded-md overflow-visible relative">
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="flex-1 px-4 py-2 outline-none rounded-md text-gray-700 bg-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            {loadingSuggestions && (
              <div className="absolute right-3 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {showSuggestions && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-xl border border-gray-200 mt-1 rounded-md z-50 max-h-80 overflow-y-auto">
              {loadingSuggestions ? (
                <div className="p-4 text-center text-gray-400 text-sm">Searching products...</div>
              ) : suggestions.length > 0 ? (
                suggestions.map((prod) => (
                  <div
                    key={prod._id}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input blur if any
                      setShowSuggestions(false);
                      router.push(`/user/productDetail/${prod._id}`);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer"
                  >
                    <img
                      src={prod.images?.[0] || ""}
                      alt={prod.name}
                      className="w-10 h-10 object-contain rounded bg-gray-50"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium text-gray-800 line-clamp-1">{prod.name}</span>
                      <span className="text-xs text-blue-600 font-bold">${prod.price}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400 text-sm italic">
                  No products found for "{searchQuery}"
                </div>
              )}
            </div>
          )}

          {/* CATEGORY DROPDOWN */}
          <div ref={dropdownRef} className="relative border-l border-blue-500">
            <div
              onClick={() => setOpen(!open)}
              className="px-4 py-2 flex items-center gap-1 bg-white cursor-pointer"
            >
              <span className="text-gray-700 text-sm whitespace-nowrap">{selected.title}</span>
              <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </div>

            {open && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50 py-1">
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                  onClick={() => {
                    setSelected({ title: "All category", slug: "" });
                    setOpen(false);
                  }}
                >
                  All category
                </div>
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                    onClick={() => {
                      setSelected({ title: cat.title, slug: cat.slug });
                      setOpen(false);
                    }}
                  >
                    {cat.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-r-md font-medium hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {/* RIGHT ICONS */}
        <div className="hidden lg:flex items-center gap-6 text-gray-600 font-semibold ml-4">
          <div className="relative" ref={desktopUserMenuRef}>
            <div
              className="flex flex-col items-center text-xs cursor-pointer text-gray-600 hover:text-blue-600"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div  className="w-8 flex flex-col items-center">
                {userData?.image ? (
                <Image src={userData.image} alt="User" width={28} height={28} className="rounded-full object-cover w-8 h-8 border-2 border-blue-100" />
              ) : userData?.email ? (
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center border-2 border-blue-200">
                  {userData.email.charAt(0).toUpperCase()}
                </div>
              ) : (
                <User size={20} />
              )}
              </div>
             
              <span className="mt-0">{userData ? "" : "Account"}</span>
            </div>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50 flex flex-col py-2 font-medium">
                {userData ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100 flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 truncate">{userData.name || 'User'}</span>
                      <span className="text-xs text-gray-500 truncate">{userData.email}</span>
                    </div>
                    <Link href="/user/profile" className="px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2" onClick={() => setUserMenuOpen(false)}>
                      <User size={16} /> Profile
                    </Link>
                    <Link href="/user/orders" className="px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2" onClick={() => setUserMenuOpen(false)}>
                      <ShoppingBag size={16} /> Orders
                    </Link>
                    <Link href="/user/favorites" className="px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 border-b border-gray-100" onClick={() => setUserMenuOpen(false)}>
                      <Heart size={16} /> Favorites
                    </Link>
                    <button onClick={() => { signOut(); setUserMenuOpen(false); }} className="px-4 py-2 text-left hover:bg-gray-50 text-red-600 font-semibold mt-1">Logout</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="px-4 py-2 hover:bg-gray-50 text-blue-600" onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                    <Link href="/register" className="px-4 py-2 hover:bg-gray-50 text-gray-700" onClick={() => setUserMenuOpen(false)}>Register</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center text-xs cursor-pointer">
            <MessageSquare size={20} />
            <span>Message</span>
          </div>

          <Link href={'/user/orders'}>
          <div className="flex flex-col items-center text-xs cursor-pointer">
            <Heart size={20} />
            <span>Orders</span>
          </div></Link>

          <Link href={'/user/cart'}>
            <div className="flex flex-col items-center text-xs cursor-pointer relative">
              <ShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {items.length}
                </span>
              )}
              <span className="text-nowrap mt-1">My cart</span>
            </div>
          </Link>
        </div>


        {/* mobile view icons */}


        <div className="flex lg:hidden gap-5">
          <Link href={"/user/cart"}>
            <div className="flex flex-col items-center text-xs cursor-pointer relative mt-1">
              <ShoppingCart size={24} />
               {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {items.length}
                </span>
              )}
            </div>

          </Link>
          <div className="flex flex-col items-center text-xs cursor-pointer relative" ref={mobileUserMenuRef}>
            <div onClick={() => setUserMenuOpen(!userMenuOpen)}>
              {userData?.image ? (
                <Image src={userData.image} alt="User" width={28} height={28} className="rounded-full object-cover w-7 h-7 border-2 border-blue-100" />
              ) : userData?.email ? (
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center border-2 border-blue-200">
                  {userData.email.charAt(0).toUpperCase()}
                </div>
              ) : (
                <User size={24} />
              )}
            </div>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50 flex flex-col py-2 font-medium">
                {userData ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100 flex flex-col text-left">
                      <span className="text-sm font-semibold text-gray-800 truncate">{userData.name || 'User'}</span>
                      <span className="text-xs text-gray-500 truncate">{userData.email}</span>
                    </div>
                    <Link href="/user/profile" className="px-4 py-2 text-left px-4 hover:bg-gray-50 text-gray-700 flex items-center gap-2" onClick={() => setUserMenuOpen(false)}>
                      <User size={16} /> Profile
                    </Link>
                    <Link href="/user/orders" className="px-4 py-2 text-left px-4 hover:bg-gray-50 text-gray-700 flex items-center gap-2" onClick={() => setUserMenuOpen(false)}>
                      <ShoppingBag size={16} /> Orders
                    </Link>
                    <Link href="/user/favorites" className="px-4 py-2 text-left px-4 border-b border-gray-100 hover:bg-gray-50 text-gray-700 flex items-center gap-2" onClick={() => setUserMenuOpen(false)}>
                      <Heart size={16} /> Favorites
                    </Link>
                    <button onClick={() => { signOut(); setUserMenuOpen(false); }} className="px-4 py-2 text-left hover:bg-gray-50 text-red-600 font-semibold mt-1">Logout</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="px-4 py-2 hover:bg-gray-50 text-blue-600 text-left" onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                    <Link href="/register" className="px-4 py-2 hover:bg-gray-50 text-gray-700 text-left" onClick={() => setUserMenuOpen(false)}>Register</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex lg:hidden px-4 relative" ref={searchRef}>
        <div className="bg-gray-50 flex w-full px-3 gap-2 rounded-md border border-gray-200 items-center">
          <button className="text-gray-500 ">
            <SearchIcon size={16} />
          </button>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="py-2 w-full outline-none text-gray-600 text-lg bg-transparent"
          />
          {loadingSuggestions && (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {showSuggestions && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-4 right-4 bg-white shadow-xl border border-gray-200 mt-1 rounded-md z-50 max-h-80 overflow-y-auto">
            {loadingSuggestions ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                Searching products...
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((prod) => (
                <div
                  key={prod._id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setShowSuggestions(false);
                    router.push(`/user/productDetail/${prod._id}`);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer"
                >
                  <img
                    src={prod.images?.[0] || ""}
                    alt={prod.name}
                    className="w-10 h-10 object-contain rounded bg-gray-50"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800 line-clamp-1">
                      {prod.name}
                    </span>
                    <span className="text-xs text-blue-600 font-bold">
                      ${prod.price}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400 text-sm italic">
                No products found for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex py-4 lg:hidden px-4 ">

        <div className="flex overflow-scroll text-nowrap scrollbar-hide gap-2">
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => {
                setSelected({ title: cat.title, slug: cat.slug });
                setOpen(false);
                router.push(`/user/shop?category=${cat.slug}`);
              }}
              className="bg-blue-50 px-2.5 py-1.5 text-blue-500 cursor-pointer rounded-md"
            >
              {cat.title}
            </div>
          ))}
        </div>
      </div>

      {/* SECOND NAVBAR */}
      <div className="hidden lg:flex">
        <div className="w-full   border-t border-gray-200">
          <div className="max-w-300 mx-auto px-4 py-3 flex items-center justify-between text-lg text-gray-700">
            <div className="flex items-center gap-6 font-semibold ">
              <div className="flex items-center gap-2 cursor-pointer">
                <Menu size={18} />
                <span>All category</span>
              </div>

              <span className="cursor-pointer">Hot offers</span>
              <span className="cursor-pointer">Gift boxes</span>
              <span className="cursor-pointer">Projects</span>
              <span className="cursor-pointer">Menu item</span>

              <div className="flex items-center gap-1 cursor-pointer">
                <span>Help</span>
                <ChevronDown size={14} />
              </div>
            </div>

            <div className="flex items-center gap-6 font-semibold">
              <div className="flex items-center gap-1 cursor-pointer">
                <span>English, USD</span>
                <ChevronDown size={14} />
              </div>

              <div ref={shipRef} className="relative">
                <div
                  onClick={() => setShipOpen(!shipOpen)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span>Ship to</span>

                  <Image
                    src={selectedCountry.flag}
                    alt={selectedCountry.name}
                    width={20}
                    height={14}
                    className="object-cover "
                  />

                  <span className="text-sm">{selectedCountry.name}</span>

                  <ChevronDown size={14} />
                </div>

                {shipOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                    {countries?.map((country) => (
                      <div
                        key={country.id}
                        onClick={() => {
                          setSelectedCountry(country);
                          setShipOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <Image
                          src={country.flag}
                          alt={country.name}
                          width={20}
                          height={14}
                          className="object-cover "
                        />
                        <span className="text-sm">{country.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  )
}