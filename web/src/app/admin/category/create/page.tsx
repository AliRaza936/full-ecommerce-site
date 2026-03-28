"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function CreateCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { userData } = useSelector((state: any) => state.user);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // If edit mode, fetch category details
  useEffect(() => {
    if (editId) {
      fetchCategory();
    }
  }, [editId]);

  const fetchCategory = async () => {
    setFetching(true);
    try {
      const { data } = await axios.get("/api/admin/category");
      if (data.success) {
        const cat = data.categories.find((c: any) => c._id === editId);
        if (cat) {
          setTitle(cat.title);
          setSlug(cat.slug);
        } else {
          toast.error("Category not found");
          router.push("/admin/category");
        }
      }
    } catch (error) {
      toast.error("Failed to load category details");
    } finally {
      setFetching(false);
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!editId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userData?.role !== "admin") {
      toast.error("Only Admins can modify categories.");
      return;
    }

    if (!title || !slug) {
      toast.error("Title and slug are required");
      return;
    }

    setLoading(true);

    try {
      const payload = { title, slug };

      if (editId) {
        // Update
        const { data } = await axios.put(`/api/admin/category/${editId}`, payload);
        if (data.success) {
          toast.success("Category updated!");
          router.push("/admin/category");
        }
      } else {
        // Create
        const { data } = await axios.post("/api/admin/category", payload);
        if (data.success) {
          toast.success("Category created!");
          router.push("/admin/category");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {editId ? "Edit Category" : "Create New Category"}
          </h1>
          <p className="text-slate-500 mt-1">
            {editId ? "Modify existing category details." : "Add a new product category to your store."}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title & Slug */}
            <div className="space-y-6 md:col-span-2 max-w-2xl">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category Title *</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={handleTitleChange}
                  required
                  placeholder="e.g. Smart Watches"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2"> Slug *</label>
                <input 
                  type="text" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  placeholder="e.g. smart-watches"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-600 font-mono text-sm"
                />
               
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 relative">
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
                loading || userData?.role !== "admin" ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
              }`}
            >
               {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
               {editId ? "Update Category" : "Save Category"}
            </button>
            {userData?.role !== "admin" && (
                <p className="text-red-500 text-sm mt-3 absolute right-8 bottom-6">Admin permissions required</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
