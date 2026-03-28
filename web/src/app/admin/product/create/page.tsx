"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, X, Trash2 } from "lucide-react";

export default function CreateProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { userData } = useSelector((state: any) => state.user);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  
  // Image states
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const init = async () => {
      const cats = await fetchCategories();
      if (editId) {
        await fetchProduct(cats);
      }
    };
    init();
  }, [editId]);

  const fetchCategories = async (): Promise<any[]> => {
    try {
      const { data } = await axios.get("/api/admin/category");
      if (data.success) {
        setCategories(data.categories);
        return data.categories;
      }
    } catch (error) {
      toast.error("Failed to load categories");
    }
    return [];
  };

  const fetchProduct = async (cats: any[]) => {
    setFetching(true);
    try {
      const { data } = await axios.get(`/api/admin/product/${editId}`);
      if (data.success) {
        const prod = data.product;
        setName(prod.name);
        setDescription(prod.description);
        setPrice(prod.price.toString());
        setStock(prod.stock.toString());
        setExistingImages(prod.images || []);
        // Match catName back to a category _id for the dropdown
        const matchedCat = cats.find(
          (c: any) => c.title === prod.catName || c.slug === prod.catSlug
        );
        if (matchedCat) setCategory(matchedCat._id);
      } else {
        toast.error("Product not found");
        router.push("/admin/product");
      }
    } catch (error) {
      toast.error("Failed to load product details");
    } finally {
      setFetching(false);
    }
  };

  const getTotalImages = () => {
    return existingImages.length + newImages.length;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      if (getTotalImages() + filesArray.length > 6) {
        toast.error("You can only upload a maximum of 6 images in total.");
        return;
      }
      
      const newFiles = [...newImages, ...filesArray];
      setNewImages(newFiles);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...newPreviews]);
    }
  };

  const removeNewImage = (index: number) => {
    const updatedNewImages = [...newImages];
    updatedNewImages.splice(index, 1);
    setNewImages(updatedNewImages);

    const updatedPreviews = [...previewImages];
    URL.revokeObjectURL(updatedPreviews[index]); // Free memory
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);
  };

  const removeExistingImage = (index: number) => {
    const updatedExisting = [...existingImages];
    const removedUrl = updatedExisting.splice(index, 1)[0];
    
    setExistingImages(updatedExisting);
    setDeletedImages([...deletedImages, removedUrl]);
  };

  // Move existing image
  const moveExistingImage = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index > 0) {
      const updated = [...existingImages];
      [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
      setExistingImages(updated);
    } else if (direction === 'right' && index < existingImages.length - 1) {
      const updated = [...existingImages];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      setExistingImages(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userData?.role !== "admin") {
      toast.error("Only Admins can modify products.");
      return;
    }

    if (!name || !description || !price || !category || !stock) {
      toast.error("All fields are required");
      return;
    }

    if (getTotalImages() === 0) {
      toast.error("At least one image is required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("stock", stock);

      if (editId) {
        formData.append("existingImages", JSON.stringify(existingImages));
        formData.append("deletedImages", JSON.stringify(deletedImages));
        
        newImages.forEach(file => {
          formData.append("newImages", file);
        });

        const { data } = await axios.put(`/api/admin/product/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (data.success) {
          toast.success("Product updated!");
          router.push("/admin/product");
        }
      } else {
        newImages.forEach(file => {
          formData.append("images", file);
        });

        const { data } = await axios.post("/api/admin/product", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (data.success) {
          toast.success("Product created!");
          router.push("/admin/product");
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
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {editId ? "Edit Product" : "Create New Product"}
          </h1>
          <p className="text-slate-500 mt-1">
            {editId ? "Modify existing product details." : "Add a new product to your store catalog."}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name *</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Wireless Bluetooth Headphones"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Describe your product comprehensively..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Price ($) *</label>
              <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Stock Quantity *</label>
              <input 
                type="number" 
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                min="0"
                placeholder="0"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 bg-white"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.title}</option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Image Upload Area */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-800">Product Images</h3>
              <p className="text-sm text-slate-500 mt-1">
                Upload up to 6 images. You have {getTotalImages()} / 6 uploaded.
              </p>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
              
              {/* Existing Images (Edit mode only) */}
              {existingImages.map((url, index) => (
                <div key={`existing-${index}`} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <button 
                      type="button" 
                      onClick={() => removeExistingImage(index)}
                      className="self-end bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                    {/* Reorder Buttons */}
                    {existingImages.length > 1 && (
                      <div className="flex gap-2 justify-center">
                        <button 
                          type="button" 
                          onClick={() => moveExistingImage(index, 'left')} 
                          disabled={index === 0}
                          className="bg-white/80 hover:bg-white text-slate-800 p-1 text-xs px-2 rounded disabled:opacity-50"
                        >
                          &lt;
                        </button>
                        <button 
                          type="button" 
                          onClick={() => moveExistingImage(index, 'right')} 
                          disabled={index === existingImages.length - 1}
                          className="bg-white/80 hover:bg-white text-slate-800 p-1 text-xs px-2 rounded disabled:opacity-50"
                        >
                          &gt;
                        </button>
                      </div>
                    )}
                  </div>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-medium">Main</span>
                  )}
                </div>
              ))}

              {/* New/Preview Images */}
              {previewImages.map((src, index) => (
                <div key={`new-${index}`} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-green-200 border-dashed bg-green-50">
                  <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-start justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      type="button" 
                      onClick={() => removeNewImage(index)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-sm"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded font-medium">New</span>
                </div>
              ))}

              {/* Upload Button */}
              {getTotalImages() < 6 && (
                <label className="cursor-pointer aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 bg-slate-50 gap-2">
                  <ImageIcon size={24} />
                  <span className="text-xs font-medium">Add Image</span>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden" 
                  />
                </label>
              )}
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
               {editId ? "Update Product" : "Save Product"}
            </button>
            {userData?.role !== "admin" && (
                <p className="text-red-500 text-sm mt-3 absolute right-8 bottom-12">Admin permissions required</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
