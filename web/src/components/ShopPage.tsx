"use client"

import React, { useState, useMemo, useEffect } from "react"
import Image, { StaticImageData } from "next/image"
import { ChevronDown, Funnel, Grid2X2, ListFilter, Menu } from "lucide-react"
import Slider from "@mui/material/Slider"
import Pagination from "@mui/material/Pagination"
import { Select, MenuItem } from "@mui/material"
import { useSearchParams, useRouter } from "next/navigation"
import axios from "axios"

import ofimg5 from "@/assets/Image/tech/3.jpg";
import ofimg4 from "@/assets/Image/tech/5.jpg";
import ofimg3 from "@/assets/Image/tech/6.jpg";
import ofimg2 from "@/assets/Image/tech/7.jpg";
import ofimg1 from "@/assets/Image/tech/8.jpg";

import inimg1 from "@/assets/Image/interior/1.jpg";
import inimg2 from "@/assets/Image/interior/6.jpg";
import inimg3 from "@/assets/Image/interior/5.jpg";
import inimg4 from "@/assets/Image/interior/3.jpg";
import inimg5 from "@/assets/Image/interior/9.jpg";
import inimg6 from "@/assets/Image/interior/8.jpg";
import inimg7 from "@/assets/Image/interior/7.jpg";
import inimg8 from "@/assets/Image/interior/4.jpg";
import techimg1 from "@/assets/Image/tech/8.jpg";
import techimg2 from "@/assets/Image/tech/6.jpg";
import techimg3 from "@/assets/Image/tech/9.jpg";
import techimg4 from "@/assets/Image/tech/10.jpg";
import techimg5 from "@/assets/Image/tech/5.jpg";
import techimg6 from "@/assets/Image/tech/7.jpg";
import techimg7 from "@/assets/Image/tech/2.jpg";
import techimg8 from "@/assets/Image/tech/1.jpg";
import ShopProductCard from "./ShopProductCard"
type Product = {
  id: string | number;
  name: string;
  img: StaticImageData | string; // since you are using Next.js Image import or API strings
  price: number;
  oldPrice: number;
  discount?: number;
  category: string;
  description?:string;

  brand: string;
  rating: number;
  orders: number;
  verified: boolean;
  featured: boolean;
};


 
// const categoriesArr = [
//   "Automobiles",
//   "Clothes and wear",
//   "Home interiors",
//   "Computer and tech",
//   "Tools, equipments",
//   "Sports and outdoor",
//   "Animal and pets",
//   "Machinery tools",
// ]

const brands = ["Samsung", "Apple", "Sony", "HP", "Dell", "Lenovo", "Xiaomi"]

const images = [ofimg1, ofimg2, ofimg3, ofimg4, ofimg5]

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min)



export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("category");
  const initialSearch = searchParams.get("search");

  const [view, setView] = useState<"grid" | "list">("grid")
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{title: string, slug: string}[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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
    if (categories.length > 0 && initialCategory) {
      const found = categories.find((c: any) => c.slug === initialCategory || c.title === initialCategory);
      if (found) {
        setFilters(prev => ({ ...prev, category: found.title }));
      } else {
        setFilters(prev => ({ ...prev, category: initialCategory })); // fallback
      }
    } else if (!initialCategory) {
      setFilters(prev => ({ ...prev, category: "" }));
    }
  }, [initialCategory, categories]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "/api/user/product?";
        if (initialCategory) url += `category=${initialCategory}&`;
        if (initialSearch) url += `search=${initialSearch}&`;
        
        const { data } = await axios.get(url);
        if (data.success) {
           const enhanced = data.products.map((p: any) => ({
             ...p,
             id: p._id,
             img: p.images?.[0] || p.img || "/placeholder.png", // map API images array to img field
             category: p.catName, // assuming mapping to the shop page's 'category' filter
             brand: brands[random(0, brands.length - 1)],
             oldPrice: p.price + random(20, 120),
             rating: Number((Math.random() * 2 + 3).toFixed(1)),
             orders: random(10, 900),
             verified: Math.random() < 0.7,
             featured: Math.random() < 0.3,
           }));
           setProducts(enhanced);
        }
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, [initialCategory, initialSearch]);
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10) // default 10 items per page
 
  const [showAllCategory, setShowAllCategory] = useState(false)
  const [showAllBrand, setShowAllBrand] = useState(false)
const [tempPrice, setTempPrice] = useState<number[]>([0, 9999])
  const [open, setOpen] = useState({
    category: true,
    brand: false,
    rating: false,
    price: false,
  })

  const [filters, setFilters] = useState({
    category: "",
    brands: [] as string[],
    ratings: [] as number[],
    price: [0, 9999] as number[],
    verified: false,
    featured: "all",
  })

  const toggleSection = (key: keyof typeof open) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }))

  const toggleBrand = (brand: string) => {
    setFilters((prev) => {
      const exists = prev.brands.includes(brand)
      return {
        ...prev,
        brands: exists
          ? prev.brands.filter((b) => b !== brand)
          : [...prev.brands, brand],
      }
    })
  }

  const toggleRating = (rating: number) => {
    setFilters((prev) => {
      const exists = prev.ratings.includes(rating)
      return {
        ...prev,
        ratings: exists
          ? prev.ratings.filter((r) => r !== rating)
          : [...prev.ratings, rating],
      }
    })
  }

  const clearFilters = () => {
    setFilters({
      category: "",
      brands: [],
      ratings: [],
      price: [0, 1000],
      verified: false,
      featured: "all",
    });
    // If there's a search, we keep it, but clear category
    const url = initialSearch ? `/user/shop?search=${initialSearch}` : "/user/shop";
    router.push(url);
  }

  const filtered = useMemo(
    () =>
      products.filter((p:any) => {
        if (filters.category && p.category !== filters.category) return false
        if (filters.brands.length && !filters.brands.includes(p.brand))
          return false
        if (filters.ratings.length && !filters.ratings.some((r) => p.rating >= r))
          return false
        if (p.price < filters.price[0] || p.price > filters.price[1]) return false
        if (filters.verified && !p.verified) return false
        if (filters.featured === "featured" && !p.featured) return false
        if (filters.featured === "non" && p.featured) return false
        return true
      }),
    [products, filters]
  )

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  useEffect(() => {
    setPage(1) // reset page when filters or perPage change
  }, [filters, perPage])

  const startIndex = (page - 1) * perPage + 1
  const endIndex = Math.min(page * perPage, filtered.length)

  return (
    <div className="max-w-300 mx-auto px-4 mt-6">
      <div className="flex gap-6">
        {/* SIDEBAR */}
        <div className="hidden lg:flex flex-col w-60">
          {/* CATEGORY */}
          <div className="border-b border-gray-200 pb-4">
            <div
              className="flex justify-between cursor-pointer"
              onClick={() => toggleSection("category")}
            >
              <h3 className="font-semibold">Category</h3>
              <ChevronDown
                size={18}
                className={`${open.category ? "rotate-180" : ""} transition`}
              />
            </div>
            {open.category && (
              <div className="mt-3">
                {(showAllCategory ? categories : categories.slice(0, 4)).map(
                  (cat) => (
                    <label key={cat.slug} className="flex gap-3 text- text-gray-500 mb-1">
                      <input
                        type="radio"
                        checked={filters.category === cat.title}
                        onChange={() => {
                          setFilters({ ...filters, category: cat.title });
                          const searchPart = initialSearch ? `&search=${initialSearch}` : "";
                          router.push(`/user/shop?category=${cat.slug}${searchPart}`);
                        }}
                      />
                      {cat.title}
                    </label>
                  )
                )}
                <button
                  className="text-blue-600"
                  onClick={() => setShowAllCategory(!showAllCategory)}
                >
                  {showAllCategory ? "Show less" : "Show all"}
                </button>
              </div>
            )}
          </div>

          {/* BRANDS */}
          <div className="border-b border-gray-200 py-4">
            <div
              className="flex justify-between cursor-pointer"
              onClick={() => toggleSection("brand")}
            >
              <h3 className="font-semibold">Brands</h3>
              <ChevronDown
                size={18}
                className={`${open.brand ? "rotate-180" : ""}`}
              />
            </div>
            {open.brand && (
              <div className="mt-3">
                {(showAllBrand ? brands : brands.slice(0, 4)).map((b) => (
                  <label key={b} className="flex gap-2 text-gray-500 mb-1">
                    <input
                      type="checkbox"
                      className="w-4"
                      checked={filters.brands.includes(b)}
                      onChange={() => toggleBrand(b)}
                    />
                    {b}
                  </label>
                ))}
                <button
                  className="text-blue-600 text-"
                  onClick={() => setShowAllBrand(!showAllBrand)}
                >
                  {showAllBrand ? "Show less" : "Show all"}
                </button>
              </div>
            )}
          </div>
<div className="py-4 border-b border-gray-200">
  <div
    className="flex justify-between cursor-pointer"
    onClick={() => toggleSection("price")}
  >
    <h3 className="font-semibold">Price</h3>
    <ChevronDown
      size={18}
      className={`${open.price ? "rotate-180" : ""}`}
    />
  </div>

  {open.price && (
    <div className="mt-4">
      {/* Slider */}
      <Slider
        value={tempPrice} // use tempPrice here
        onChange={(e, newValue) => setTempPrice(newValue as number[])}
        valueLabelDisplay="auto"
        min={0}
        max={10000}
        step={10}
      />

      {/* Inputs */}
      <div className="flex gap-2 mt-3">
        <div className="flex-1">
          <h2 className="text-sm font-medium mb-1">Min</h2>
          <input
            type="number"
            className="border w-full border-gray-200 rounded-md outline-none bg-white p-2"
            value={tempPrice[0]}
            onChange={(e) =>
              setTempPrice([Number(e.target.value), tempPrice[1]])
            }
          />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-medium mb-1">Max</h2>
          <input
            type="number"
            className="border w-full border-gray-200 rounded-md outline-none bg-white p-2"
            value={tempPrice[1]}
            onChange={(e) =>
              setTempPrice([tempPrice[0], Number(e.target.value)])
            }
          />
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={() => setFilters({ ...filters, price: tempPrice })}
        className="w-full border border-gray-200 flex justify-center items-center mt-3 py-2 text-blue-600 cursor-pointer hover:shadow font-medium"
      >
        Apply
      </button>
    </div>
  )}
</div>
          <div className="py-4">
            <div
              className="flex justify-between cursor-pointer"
              onClick={() => toggleSection("rating")}
            >
              <h3 className="font-semibold">Ratings</h3>
              <ChevronDown
                size={18}
                className={`${open.rating ? "rotate-180" : ""}`}
              />
            </div>
            {open.rating && (
              <div className="mt-3">
                {[5, 4, 3, 2].map((r) => (
                  <label key={r} className="flex gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={filters.ratings.includes(r)}
                      className="w-4"
                      onChange={() => toggleRating(r)}
                    />
                    <span className="text-yellow-500 text-2xl">
                      {"★".repeat(r)}
                      {"☆".repeat(5 - r)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="flex-1">
          {/* TOP BAR */}
          <div className="flex p-3 justify-between mb-4 items-center border   border-gray-200 rounded-md">
            <h2 className=" hidden lg:block text-lg ">
              {filtered.length} items in <span className="font-semibold">{filters.category || "All"}</span>
            </h2>

            <div className="flex justify-between lg:justify-normal w-full lg:w-auto   gap-4 items-center">
              <label className=" hidden lg:flex gap-2 text-">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  className="w-4"
                  onChange={(e) =>
                    setFilters({ ...filters, verified: e.target.checked })
                  }
                />
                Verified only
              </label>

              <select
                value={filters.featured}
                onChange={(e) =>
                  setFilters({ ...filters, featured: e.target.value })
                }
                className="hidden lg:block border border-gray-200 rounded-md outline-none p-2 text- pr-5"
              >
                <option value="all">All</option>
                <option value="featured">Featured</option>
                <option value="non">Non Featured</option>
              </select>

              {/* Mobile view only */}
 <div className="flex items-center p-2  gap-1 lg:hidden border border-gray-200 rounded-md">
  Sort:
 <h2>Newest</h2>
 </div>
 <div onClick={() => setMobileFilterOpen(true)}  className="flex items-center justify-around  gap-2 p-2 lg:hidden border border-gray-200 rounded-md">
  <h2>Filter</h2>
  <Funnel size={16} />
</div>



              
              <div className="flex ">
                <button
                className={`border border-gray-200 py-2 rounded-l-md lg:px-3 px-1 ${view === "grid" ? "bg-gray-200" : ""}`}
                onClick={() => setView("grid")}
              >
                
                  <Grid2X2 />
               
              </button>
              <button
                className={`border border-gray-200 rounded-r-md px-1 lg:px-3 ${view === "list" ? "bg-gray-200" : ""}`}
                onClick={() => setView("list")}
              >
               <Menu />
              </button>
              </div>
            </div>
          </div>

       
          {/* FILTER CHIPS */}
<div className="flex flex-wrap gap-2 mb-4">
  {filters.category && (
    <span
      className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm cursor-pointer"
      onClick={() => {
        setFilters({ ...filters, category: "" });
        const url = initialSearch ? `/user/shop?search=${initialSearch}` : "/user/shop";
        router.push(url);
      }}
    >
      {filters.category} ✕
    </span>
  )}

  {filters.brands.map((b) => (
    <span
      key={b}
      className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm cursor-pointer"
      onClick={() => toggleBrand(b)}
    >
      {b} ✕
    </span>
  ))}

  {/* Ratings chips */}
  {filters.ratings.map((r) => (
    <span
      key={r}
      className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm cursor-pointer"
      onClick={() => toggleRating(r)}
    >
      {r} Stars ✕ 
    </span>
  ))}

  {filters.category || filters.brands.length || filters.ratings.length ? (
    <button
      className="text-red-600 text-sm"
      onClick={clearFilters}
    >
      Clear filters
    </button>
  ) : null}
</div>

          {/* PRODUCTS */}
        
<div
  className={
    view === "grid" ? "grid grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-4"
  }
>
  {paginated.length === 0 ? (
    <div className="col-span-3 text-center text-gray-500 py-10">
      No products found matching your filters.
    </div>
  ) : (
    paginated.map((p: Product) => (
      <ShopProductCard
        key={p.id}
        product={p}
        view={view} // if your card handles grid/list differently
      />
    ))
  )}
</div>

          {/* PAGINATION + info */}
          <div className="flex flex-col lg:flex-row justify-between items-center mt-8 ">
            <div className="text-sm mb-2 lg:mb-0">
              Showing {startIndex}-{endIndex} of {filtered.length}
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-2">
 <Select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                size="small"
              >
                {[10, 20, 30, 50].map((n) => (
                  <MenuItem key={n} value={n}>
                    {n} per page
                  </MenuItem>
                ))}
              </Select>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, val) => setPage(val)}
              shape="rounded"
              variant="outlined"
              color="primary"
            />
            </div>
           
          </div>
        </div>
      </div>
      {/* MOBILE FILTER DRAWER */}
{mobileFilterOpen && (
  <div
    className="fixed inset-0 bg-black/40 bg-opacity-50 z-50"
    onClick={() => setMobileFilterOpen(false)} // close on overlay click
  >
    <div
      className="bg-white w-72 h-full p-4 overflow-y-auto"
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside drawer
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        <button
          className="text-red-600 font-bold"
          onClick={() => setMobileFilterOpen(false)}
        >
          ✕
        </button>
      </div>

      {/* CATEGORY */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h4 className="font-medium mb-2">Category</h4>
        {(showAllCategory ? categories : categories.slice(0, 4)).map(
          (cat) => (
            <label key={cat.slug} className="flex gap-3 text-gray-500 mb-1">
              <input
                type="radio"
                checked={filters.category === cat.title}
                onChange={() => {
                  setFilters({ ...filters, category: cat.title });
                  const searchPart = initialSearch ? `&search=${initialSearch}` : "";
                  router.push(`/user/shop?category=${cat.slug}${searchPart}`);
                }}
              />
              {cat.title}
            </label>
          )
        )}
        <button
          className="text-blue-600 text-sm"
          onClick={() => setShowAllCategory(!showAllCategory)}
        >
          {showAllCategory ? "Show less" : "Show all"}
        </button>
      </div>

      {/* BRANDS */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h4 className="font-medium mb-2">Brands</h4>
        {(showAllBrand ? brands : brands.slice(0, 4)).map((b) => (
          <label key={b} className="flex gap-2 text-gray-500 mb-1">
            <input
              type="checkbox"
              checked={filters.brands.includes(b)}
              onChange={() => toggleBrand(b)}
            />
            {b}
          </label>
        ))}
        <button
          className="text-blue-600 text-sm"
          onClick={() => setShowAllBrand(!showAllBrand)}
        >
          {showAllBrand ? "Show less" : "Show all"}
        </button>
      </div>

      {/* PRICE */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h4 className="font-medium mb-2">Price</h4>
        <Slider
          value={tempPrice}
          onChange={(e, newValue) => setTempPrice(newValue as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={10000}
          step={10}
        />
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            value={tempPrice[0]}
            onChange={(e) =>
              setTempPrice([Number(e.target.value), tempPrice[1]])
            }
            className="border p-2 w-full rounded"
          />
          <input
            type="number"
            value={tempPrice[1]}
            onChange={(e) =>
              setTempPrice([tempPrice[0], Number(e.target.value)])
            }
            className="border p-2 w-full rounded"
          />
        </div>
        <button
          className="mt-3 w-full bg-blue-100 text-blue-600 py-2 rounded"
          onClick={() => setFilters({ ...filters, price: tempPrice })}
        >
          Apply
        </button>
      </div>

      {/* RATINGS */}
      <div className="pb-4 mb-4">
        <h4 className="font-medium mb-2">Ratings</h4>
        {[5, 4, 3, 2].map((r) => (
          <label key={r} className="flex gap-2 mb-1">
            <input
              type="checkbox"
              checked={filters.ratings.includes(r)}
              onChange={() => toggleRating(r)}
              className="w-4"
            />
            <span className="text-yellow-500 text-2xl">
              {"★".repeat(r)}
              {"☆".repeat(5 - r)}
            </span>
          </label>
        ))}
      </div>

      <button
        className="mt-4 w-full bg-red-100 text-red-600 py-2 rounded"
        onClick={clearFilters}
      >
        Clear All Filters
      </button>
    </div>
  </div>
)}
    </div>
  )
}