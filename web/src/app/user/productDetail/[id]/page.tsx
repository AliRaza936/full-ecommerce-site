"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import InquerySection from "@/components/InquerySection";
import flag8 from "@/assets/flag/grmerny.png";
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
import ofimg1 from "@/assets/Image/tech/3.jpg";
import ofimg2 from "@/assets/Image/tech/5.jpg";
import ofimg3 from "@/assets/Image/tech/6.jpg";
import ofimg4 from "@/assets/Image/tech/7.jpg";
import ofimg5 from "@/assets/Image/tech/8.jpg";
import InquiryForm from "@/components/InquiryForm";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageSquareMoreIcon,
  Star,
  ShoppingBag,
  User,
} from "lucide-react";

import Footer from "@/components/Footer";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Rating } from "@mui/material";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/cartSlice";

export default function ProductPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [showInquiry, setShowInquiry] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [youMayLike, setYouMayLike] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [newRating, setNewRating] = useState<number | null>(5);
  const [newComment, setNewComment] = useState("");
  const [offer, setOffer] = useState<any>(null);

  const handleAddToCart = async () => {
    if (!session) {
      toast.error("Please login to add to cart");
      return;
    }
    try {
      setCartLoading(true);
      const res = await axios.post("/api/user/cart", {
        productId: id,
        name: product.name,
        image: product.images?.[0] || "",
        price: offer ? (product.price * (1 - offer.discountPercentage / 100)) : product.price,
        qty: 1
      });

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Added to cart");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const fetchReviews = async (productId: string) => {
    try {
      const { data } = await axios.get(`/api/user/review?productId=${productId}`);
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews", error);
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await axios.get(`/api/user/product/${id}`);
        if (data.success) {
          setProduct(data.product);
          setOffer(data.offer);
          // Fetch related products after getting the category
          const relatedRes = await axios.get(`/api/user/product?category=${data.product.catSlug}`);
          if (relatedRes.data.success) {
            const others = relatedRes.data.products.filter((p: any) => p._id !== id);
            setYouMayLike(others.slice(0, 5));
            setRelatedProducts(others.slice(5, 10));
          }
          fetchReviews(id as string);
        }
      } catch (error) {
        console.error("Error fetching product", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProductDetails();
  }, [id]);

  const images = product?.images || [ofimg1, ofimg2, ofimg3, ofimg4, ofimg5];
  const text = product?.description || `Lorem ipsum dolor sit amet consectetur adipisicing elit...`;
  const limit = 150;
  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="max-w-300 mx-auto p-4 flex items-center justify-center h-64 text-gray-400">
          Loading product...
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <NavBar />
        <div className="max-w-300 mx-auto p-4 flex items-center justify-center h-64 text-red-500">
          Product not found.
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />

      <div className="max-w-300 mx-auto p-0 mt-2 lg:p-4">
        <div className="grid lg:grid-cols-8 gap-6 bg-white border border-gray-200 rounded-lg p-4">
          {/* LEFT IMAGE SECTION */}

          <div className="lg:col-span-3">
            <div className="relative border  border-gray-200 rounded-lg p-4 flex items-center justify-center">
              <Image
                src={images[activeImage]}
                alt="product"
                width={500}
                height={400}
                className="object-contain h-72"
              />

              {/* Mobile arrows */}
              <button
                onClick={prevImage}
                className="lg:hidden absolute left-2 bg-white shadow p-2 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={nextImage}
                className="lg:hidden absolute right-2 bg-white shadow p-2 rounded-full"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Thumbnails desktop */}
            <div className="hidden lg:flex gap-3 mt-4">
              {images.map((img: any, index: any) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`border  rounded p-1 ${activeImage === index
                      ? "border-blue-500"
                      : "border-gray-200"
                    }`}
                >
                  <Image
                    src={img}
                    alt="thumb"
                    width={56}
                    height={56}
                    className="w-14 h-14 object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCT DETAILS */}

          <div className="lg:col-span-3">
            <p className="text-green-600 text-sm font-medium">✔ In stock</p>

            <h1 className="text-xl font-semibold mt-1">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-2 text-sm">
              <div className="flex text-orange-400">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} />
              </div>

              <span className="text-orange-500 font-semibold">
                {reviews.length > 0
                  ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                  : "0.0"}
              </span>
              <span className="text-gray-500 flex gap-2 items-center">
                <MessageSquareMoreIcon size={18} /> {reviews.length} reviews
              </span>
              <span className="text-gray-500 flex gap-2 items-center">
                {" "}
                <ShoppingBag size={18} /> 154 sold
              </span>
            </div>
            {/* PRICE TIERS */}
            {offer ? (
              <div className="flex mt-4 border border-red-200 rounded overflow-hidden text-center shadow-sm">
                <div className="flex-1 bg-red-50 p-3 flex flex-col justify-center border-r border-red-100">
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-red-600 font-bold text-2xl">
                      ${(product.price * (1 - offer.discountPercentage / 100)).toFixed(2)}
                    </p>
                    <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                      -{offer.discountPercentage}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-through decoration-red-400">
                    Was ${product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex-1 bg-white p-3 flex flex-col justify-center">
                  <p className="text-red-500 font-bold text-sm uppercase tracking-wider">
                    Limited Time Offer
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {offer.title}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex mt-4 border border-gray-200 rounded overflow-hidden text-center">
                <div className="flex-1 bg-red-50 p-3">
                  <p className="text-red-500 font-bold text-lg  ">${product.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Sale Price</p>
                </div>

              
              </div>
            )}

            <div className="lg:hidden flex gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {cartLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Add to cart</>
                )}
              </button>

              <button className="border border-gray-300 px-3 rounded flex items-center justify-center">
                <Heart size={20} />
              </button>
            </div>
            {/* DETAILS TABLE */}

            <div className="mt-4 space-y-2 text-">
              <div className="flex  border-b pb-1 border-gray-200">
                <span className="text-gray-500  w-[50%] ">Price:</span>
                <span className="text-gray-700">Negotiable</span>
              </div>

              <div className="flex   border-gray-200 pb-1">
                <span className="text-gray-500 w-[50%]">Type:</span>
                <span className="text-gray-700">Classic shoes</span>
              </div>

              <div className="flex  border-gray-200 pb-1">
                <span className="text-gray-500  w-[50%]">Material:</span>
                <span className="text-gray-700">Plastic material</span>
              </div>

              <div className="flex  border-b border-gray-200 pb-1">
                <span className="text-gray-500  w-[50%]">Design:</span>
                <span className="text-gray-700">Modern nice</span>
              </div>

              <div className="flex  border-gray-200 pb-1">
                <span className="text-gray-500  w-[50%]">Customization:</span>
                <span className="text-gray-700">Custom logo & packages</span>
              </div>

              <div className="flex  border-b border-gray-200 pb-1">
                <span className="text-gray-500  w-[50%]">Warranty:</span>
                <span className="text-gray-700 mb-2  ">
                  2 years full warranty
                </span>
              </div>
            </div>

            <div className=" text-gray-600 text-sm  lg:hidden">
              <p className="">
                {showMore
                  ? text
                  : text.substring(0, limit) +
                  (text.length > limit ? "..." : "")}
              </p>
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-blue-600 text-sm font-medium mt-2"
              >
                {showMore ? "Show less" : "Show more"}
              </button>
            </div>
          </div>

          {/* SUPPLIER CARD */}

          <div className="flex items-center flex-col lg:col-span-2 flex-1 w-full ">
            <div className="border w-full border-gray-200 rounded-lg p-4 h-fit">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-200 rounded flex items-center justify-center font-bold">
                  R
                </div>

                <div>
                  <p className="font-semibold text-sm">Supplier</p>
                  <p className="text-sm text-gray-600">Guangxi Trading LLC</p>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-500 space-y-1 flex lg:flex-col items-center lg:items-start text-center">
                <p className="flex items-center gap-2">
                  {" "}
                  <Image src={flag8} alt="flag" width={20} /> Germany, Berlin
                </p>
                <p>✔ Verified Seller</p>
                <p>🌐 Worldwide shipping</p>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="mt-4 w-full bg-blue-600 hidden lg:flex items-center justify-center gap-2 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {cartLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Add to cart</>
                )}
              </button>

              <button className="mt-2 hidden lg:block  w-full border border-gray-200 py-2 rounded text-sm text-blue-600 font-medium">
                Seller's profile
              </button>
            </div>
            <button className="mt-3 hidden  lg:flex  items-center justify-center gap-2 font-semibold text-lg text-blue-600">
              <Heart size={20} />
              Save for later
            </button>
          </div>
        </div>
      </div>

      {/* DESCRIPTION + SIDEBAR */}

      <div className="max-w-300 mx-auto p-4 hidden lg:grid lg:grid-cols-4 gap-6">
        {/* LEFT TABS SECTION */}

        <div className="lg:col-span-3 border border-gray-200 rounded-lg bg-white">
          {/* TAB HEADER */}

          <div className="flex gap-6 border-b border-gray-200 px-6">
            <button
              onClick={() => setActiveTab("description")}
              className={`py-3 text-sm border-b-2 ${activeTab === "description"
                  ? "border-blue-600 text-blue-600 font-medium"
                  : "border-transparent text-gray-500"
                }`}
            >
              Description
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-3 text-sm border-b-2 ${activeTab === "reviews"
                  ? "border-blue-600 text-blue-600 font-medium"
                  : "border-transparent text-gray-500"
                }`}
            >
              Reviews
            </button>

            <button
              onClick={() => setActiveTab("shipping")}
              className={`py-3 text-sm border-b-2 ${activeTab === "shipping"
                  ? "border-blue-600 text-blue-600 font-medium"
                  : "border-transparent text-gray-500"
                }`}
            >
              Shipping
            </button>

            <button
              onClick={() => setActiveTab("seller")}
              className={`py-3 text-sm border-b-2 ${activeTab === "seller"
                  ? "border-blue-600 text-blue-600 font-medium"
                  : "border-transparent text-gray-500"
                }`}
            >
              About seller
            </button>
          </div>

          {/* TAB CONTENT */}

          <div className="p-6 text-sm text-gray-600">
            {/* DESCRIPTION TAB */}

            {activeTab === "description" && (
              <div className="space-y-4">
                <p>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel
                  fugiat, facilis accusantium doloremque praesentium repellendus
                  non. Maiores sint id vero cum illum quasi dicta qui quaerat,
                  aperiam, quos perferendis iste inventore veniam repudiandae
                  temporibus, commodi harum? Cum maxime, necessitatibus tempore
                  accusamus totam quidem error, maiores illum, magnam odio natus
                  accusantium!
                </p>

                <div className="grid grid-cols-2 w-105 border border-gray-200 text-sm">
                  <div className="bg-gray-100 p-2 border border-gray-200">
                    Model
                  </div>
                  <div className="p-2 border border-gray-200">#8786867</div>

                  <div className="bg-gray-100 p-2 border border-gray-200">
                    Style
                  </div>
                  <div className="p-2 border border-gray-200">
                    Classic style
                  </div>

                  <div className="bg-gray-100 p-2 border border-gray-200">
                    Certificate
                  </div>
                  <div className="p-2 border border-gray-200">
                    ISO-898921212
                  </div>

                  <div className="bg-gray-100 p-2 border border-gray-200">
                    Size
                  </div>
                  <div className="p-2 border border-gray-200">34mm x 450mm</div>

                  <div className="bg-gray-100 p-2 border border-gray-200">
                    Memory
                  </div>
                  <div className="p-2 border border-gray-200">36GB RAM</div>
                </div>

                <ul className="space-y-2 mt-4">
                  <li>✔ Some great feature name here</li>
                  <li>✔ Lorem ipsum dolor sit amet</li>
                  <li>✔ Duis aute irure dolor in reprehenderit</li>
                  <li>✔ Some great feature name here</li>
                </ul>
              </div>
            )}

            {/* REVIEWS TAB */}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Customer Reviews</h3>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition shadow-sm text-sm font-medium"
                  >
                    Write a review
                  </button>
                </div>

                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border border-blue-100">
                            {review.userImage ? (
                              <img src={review.userImage} alt={review.userName} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-blue-600 font-bold uppercase">{review.userEmail.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{review.userName}</p>
                            <Rating value={review.rating / 2} precision={0.5} readOnly size="small" />
                          </div>
                          <span className="ml-auto text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-400 italic">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SHIPPING TAB */}

            {activeTab === "shipping" && (
              <div className="space-y-3">
                <p>🚚 Worldwide shipping available</p>
                <p>📦 Delivery time: 5-10 business days</p>
                <p>💰 Shipping cost depends on quantity</p>
              </div>
            )}

            {/* SELLER TAB */}

            {activeTab === "seller" && (
              <div className="space-y-3">
                <p className="font-semibold">Guangxi Trading LLC</p>

                <p>📍 Berlin, Germany</p>

                <p>✔ Verified supplier</p>

                <p>🌐 Exporting worldwide since 2015</p>
              </div>
            )}
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg bg-white p-4 h-fit">
          <h3 className="font-semibold mb-4">You may like</h3>

          <div className="space-y-4">
            {youMayLike.map((item) => (
              <Link key={item._id} href={`/user/productDetail/${item._id}`} className="flex gap-3 group">
                <Image
                  src={item.images?.[0] || ""}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain rounded bg-gray-50 group-hover:scale-105 transition-transform"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</p>
                  <p className="text-sm text-gray-500 mt-1">${item.price}</p>
                </div>
              </Link>
            ))}
            {youMayLike.length === 0 && <p className="text-sm text-gray-400 italic">No similar products found.</p>}
          </div>
        </div>
      </div>
      {/* RELATED PRODUCTS */}

      <div className="max-w-300 mx-auto lg:p-4">
        <div className="bg-white border border-gray-200 p-4 rounded-md">
          <h2 className="font-semibold text-lg mb-4">Related products</h2>{" "}
          {/* Container */}{" "}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide lg:grid lg:grid-cols-6 lg:gap-4">
            {relatedProducts.map((item) => (
              <Link
                key={item._id}
                href={`/user/productDetail/${item._id}`}
                className="shrink-0 w-40 border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition lg:shrink lg:w-auto overflow-hidden group"
              >
                <div className="aspect-square relative mb-2">
                  <Image
                    src={item.images?.[0] || ""}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm mt-2 font-medium text-gray-800 line-clamp-2">
                  {item.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">${item.price}</p>
              </Link>
            ))}
            {relatedProducts.length === 0 && (
              <div className="col-span-full py-4 text-center text-gray-400 italic text-sm">
                No more related products.
              </div>
            )}
          </div>
          {" "}
        </div>

      </div>
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-1">Write a Review</h2>
            <p className="text-sm text-gray-500 mb-6">Share your thoughts with other customers</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                <div className="flex items-center gap-3">
                  <Rating
                    value={newRating ? newRating / 2 : 2.5}
                    precision={0.5}
                    onChange={(_, value) => setNewRating(value ? value * 2 : null)}
                    size="large"
                  />
                  <span className="text-lg font-bold text-blue-600">{newRating}/10</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What did you like or dislike?"
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                />
              </div>

              <button
                disabled={reviewLoading}
                onClick={async () => {
                  if (!session) {
                    toast.error("Please login to write a review");
                    return;
                  }
                  if (!newComment.trim()) {
                    toast.error("Please add a comment");
                    return;
                  }

                  setReviewLoading(true);
                  try {
                    const res = await axios.post("/api/user/review", {
                      productId: id,
                      rating: newRating,
                      comment: newComment
                    });
                    if (res.data.success) {
                      toast.success("Review submitted!");
                      setShowReviewModal(false);
                      setNewComment("");
                      fetchReviews(id as string);
                    }
                  } catch (error: any) {
                    toast.error(error.response?.data?.message || "Error submitting review");
                  } finally {
                    setReviewLoading(false);
                  }
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-md"
              >
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* banner */}
      <div>
        <div className='max-w-300  mx-auto bg-blue-600 rounded-md hidden lg:flex items-center text-white justify-between p-8 mt-5'>
          <div>
            <h2 className='text-2xl font-medium'>Super discount on more than 100 USD</h2>
            <p className='text-[16px] text-gray-300'>Have you ever finally just write dummy info</p>
          </div>
          <button className='bg-amber-500 text-white px-4 py-2 rounded-md'>Shop now</button>
        </div>
      </div>
      <Footer />
    </>
  );
}
