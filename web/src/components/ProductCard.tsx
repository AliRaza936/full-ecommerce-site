"use client";

import { LucideShoppingCart } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { setCart } from "../redux/cartSlice";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  img: StaticImageData | string;
  description?: string;
  showCart:boolean
}

const ProductCard = ({ id, name, price, img, description,showCart }: ProductCardProps) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Stop Link navigation
    e.stopPropagation();

    if (!session) {
      toast.error("Please login to add to cart");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/user/cart", {
        productId: id,
        name,
        image: typeof img === 'string' ? img : (img as any).src,
        price,
        qty: 1
      });

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Added to cart");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/user/productDetail/${id}`} className="block h-full group">
    <div className="bg-white border border-gray-200 rounded-md p-4 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer h-full flex flex-col group-hover:-translate-y-1 relative">
      
      {/* Image */}
      <div className="flex justify-center items-center h-48">
        <Image
          src={img}
          alt={name}
          width={200}
          height={200}
          className="object-contain max-h-full max-w-full"
        />
      </div>

      {/* Price */}
      <h3 className="mt-4 font-semibold text-gray-900">
        ${price.toFixed(2)}
      </h3>

      {/* Description */}
      <p className="capitalize text-gray-400 mt-1 leading-snug">
        {name}
      </p>

      {showCart && (
        <button 
          onClick={handleAddToCart}
          disabled={loading}
          className="flex w-full lg:w-[70%] rounded-md hover:shadow hover:scale-105 transition-all duration-300 justify-center py-2 items-center mt-3 gap-2 text-blue-600 border border-gray-200 bg-white disabled:opacity-50"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
             <LucideShoppingCart size={20} />
          )}
          <h2 className="lg:font-medium text-center">{loading ? "Adding..." : "Move to cart"}</h2>
        </button>
      )}
    </div>
    </Link>
  );
};

export default ProductCard;