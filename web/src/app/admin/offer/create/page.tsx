"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  Loader2,
  Search,
  Check,
  CalendarDays,
  Clock,
} from "lucide-react";

export default function CreateOfferPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { userData } = useSelector((state: any) => state.user);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // For "today" quick-set vs custom pickers
  const [dateMode, setDateMode] = useState<"today" | "custom">("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Products list
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Set default "today" start time on mount
  useEffect(() => {
    const now = new Date();
    const localNow = toLocalDateTimeString(now);
    setStartDate(localNow);

    // default end: 7 days from now
    const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    setEndDate(toLocalDateTimeString(sevenDays));
  }, []);

  useEffect(() => {
    fetchAllProducts();
    if (editId) fetchOffer();
  }, [editId]);

  const toLocalDateTimeString = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const fetchAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/admin/product");
      if (data.success) setAllProducts(data.products);
    } catch {
      toast.error("Failed to load products");
    }
  };

  const fetchOffer = async () => {
    setFetching(true);
    try {
      const { data } = await axios.get(`/api/admin/offer/${editId}`);
      if (data.success) {
        const o = data.offer;
        setTitle(o.title);
        setDescription(o.description || "");
        setDiscountPercentage(String(o.discountPercentage));
        setIsActive(o.isActive);
        setStartDate(toLocalDateTimeString(new Date(o.startDate)));
        setEndDate(toLocalDateTimeString(new Date(o.endDate)));
        setSelectedProducts(o.products.map((p: any) => (typeof p === "object" ? p._id : p)));
        setDateMode("custom");
      } else {
        toast.error("Offer not found");
        router.push("/admin/offer");
      }
    } catch {
      toast.error("Failed to load offer details");
    } finally {
      setFetching(false);
    }
  };

  const handleSetToday = () => {
    const now = new Date();
    setStartDate(toLocalDateTimeString(now));
    setDateMode("today");
  };

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userData?.role !== "admin") {
      toast.error("Only Admins can manage offers.");
      return;
    }

    if (!title || !startDate || !endDate) {
      toast.error("Title, start date, and end date are required");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product for this offer");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        discountPercentage: Number(discountPercentage),
        isActive,
        products: selectedProducts,
      };

      if (editId) {
        const { data } = await axios.put(`/api/admin/offer/${editId}`, payload);
        if (data.success) {
          toast.success("Offer updated!");
          router.push("/admin/offer");
        }
      } else {
        const { data } = await axios.post("/api/admin/offer", payload);
        if (data.success) {
          toast.success("Offer created!");
          router.push("/admin/offer");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.category?.title || "").toLowerCase().includes(productSearch.toLowerCase())
  );

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {editId ? "Edit Offer" : "Create New Offer"}
          </h1>
          <p className="text-slate-500 mt-1">
            {editId ? "Update your promotional deal details." : "Set up a new time-limited deal for selected products."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            Offer Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Offer Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Summer Flash Sale"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief description of this offer..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Discount Percentage (%)</label>
              <input
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                min="0"
                max="100"
                step="1"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isActive ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <label className="text-sm font-semibold text-slate-700">
                {isActive ? "Offer is Active" : "Offer is Inactive"}
              </label>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            Schedule
          </h2>

          {/* Quick Set Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleSetToday}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                dateMode === "today"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"
              }`}
            >
              <Clock size={15} />
              Start from Today
            </button>
            <button
              type="button"
              onClick={() => setDateMode("custom")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                dateMode === "custom"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"
              }`}
            >
              <CalendarDays size={15} />
              Custom Date & Time
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date & Time *</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setDateMode("custom"); }}
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">End Date & Time *</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 bg-white"
              />
            </div>
          </div>

          {startDate && endDate && new Date(startDate) < new Date(endDate) && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-xl px-4 py-3">
              <Check size={16} />
              Duration: {(() => {
                const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                return `${days > 0 ? days + "d " : ""}${hrs}h`;
              })()}
            </div>
          )}
        </div>

        {/* Product Selection */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              Select Products
            </h2>
            <span className="text-sm text-slate-500">
              {selectedProducts.length} selected
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Select All / Deselect All */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSelectedProducts(allProducts.map((p) => p._id))}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Select All
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => setSelectedProducts([])}
              className="text-xs font-medium text-red-500 hover:underline"
            >
              Deselect All
            </button>
          </div>

          {/* Product List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-1">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-10 text-slate-400">
                <Search className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                No products found
              </div>
            ) : (
              filteredProducts.map((product) => {
                const isSelected = selectedProducts.includes(product._id);
                return (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => toggleProduct(product._id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 flex-shrink-0 rounded flex items-center justify-center border-2 transition-all ${
                        isSelected ? "bg-blue-600 border-blue-600" : "border-slate-300"
                      }`}
                    >
                      {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>

                    {/* Thumbnail */}
                    <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          No img
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-slate-800 text-sm truncate">{product.name}</div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs text-slate-400 truncate">
                          {product.catName || "Uncategorized"}
                        </span>
                        <span className="text-xs font-semibold text-slate-600 ml-1 flex-shrink-0">
                          ${product.price?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex justify-end gap-3 relative">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || userData?.role !== "admin"}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-white shadow-sm transition-all ${
              loading || userData?.role !== "admin"
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
            }`}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {editId ? "Update Offer" : "Save Offer"}
          </button>

          {userData?.role !== "admin" && (
            <p className="text-red-500 text-sm absolute right-8 -bottom-7">Admin permissions required</p>
          )}
        </div>
      </form>
    </div>
  );
}
