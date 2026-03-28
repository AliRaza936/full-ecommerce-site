'use client'
import React, { useEffect } from "react";
import NavBar from "./NavBar";
import HeroSection from "./HeroSection";
import CountdownTimer from "./CountdownTimer";

import ofimg1 from "@/assets/Image/tech/8.jpg";



import Image from "next/image";
import banner1 from "@/assets/banner1.jpg";
import banner2 from "@/assets/banner2.png";
import { ArrowRight } from "lucide-react";
import InquerySection from "./InquerySection";
import ProductCard from "./ProductCard";
import OurServices from "./OurServices";
import SuppliersByRegion from "./SuppliersByRegion";
import NewsletterSection from "./NewsletterSection";
import Footer from "./Footer";
import axios from "axios";
import Link from "next/link";
const UserDashBoard = () => {
    const [offers, setOffers] = React.useState<any[]>([]);
    const [loadingOffers, setLoadingOffers] = React.useState(true);
    const [allProducts, setAllProducts] = React.useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = React.useState(true);

    const fetchOffers = async () => {
        try {
            const { data } = await axios.get("/api/offer");
            if (data.success) {
                setOffers(data.offers);
            }
        } catch (error) {
            console.error("Error fetching offers", error);
        } finally {
            setLoadingOffers(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("/api/user/product");
            if (data.success) {
                setAllProducts(data.products);
            }
        } catch (error) {
            console.error("Error fetching products", error);
        } finally {
            setLoadingProducts(false);
        }
    };

    useEffect(() => {
        fetchOffers();
        fetchProducts();
    }, []);

    const homeProducts = allProducts
        .filter((p) => p.catSlug === "home-interiors")
        .slice(0, 8);
    const techProductsArr = allProducts
        .filter((p) => p.catSlug === "computer-and-tech")
        .slice(0, 8);

    // Get IDs of products already shown in specific sections
    const shownProductIds = new Set([
        ...homeProducts.map((p) => p._id),
        ...techProductsArr.map((p) => p._id),
    ]);

    // Recommended products are those not already shown
    const recommendedProducts = allProducts.filter(
        (p) => !shownProductIds.has(p._id)
    );

    const activeOffer = offers.length > 0 ? offers[0] : null;
    const targetDate = activeOffer ? new Date(activeOffer.endDate) : new Date();
    return (
        <>
            <NavBar />
            <br />
            <HeroSection />
            <br />
            {/* Deals and offers */}
            <div className="max-w-300 mx-auto">
                {!loadingOffers && !activeOffer ? (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-12 text-center text-white shadow-xl overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)] group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <span className="inline-block px-4 py-1.5 bg-blue-500/30 backdrop-blur-md rounded-full text-sm font-bold tracking-widest uppercase mb-4 animate-pulse border border-white/20">
                                Next Drop Brewing
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
                                Offers Coming <span className="text-blue-200 italic">Soon!</span>
                            </h1>
                            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-medium opacity-90 leading-relaxed">
                                Our flash deals are taking a breather. Stay tuned for the next wave of massive discounts on elite products!
                            </p>
                            <div className="mt-8 flex justify-center gap-4">
                                <div className="h-1 w-12 bg-white/20 rounded-full"></div>
                                <div className="h-1 w-1 bg-white/40 rounded-full animate-bounce"></div>
                                <div className="h-1 w-12 bg-white/20 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-md border border-gray-200 shadow-md">
                        <div className="lg:grid lg:grid-cols-9">
                            <div className="col-span-2 flex justify-between lg:justify-normal lg:flex-col pt-4 gap-4 px-4 ">
                                <div>
                                    <h1 className="text-xl lg:text-2xl font-semibold leading-tight">
                                        {activeOffer ? activeOffer.title : "Deals and offers"}
                                    </h1>
                                    <span className="text-[14px] lg:text-lg text-gray-500 leading-tight">
                                        {activeOffer?.description || "Electronic equipments"}
                                    </span>
                                </div>

                                {/* Timer */}
                                <CountdownTimer targetDate={targetDate} />
                            </div>

                            <div className="lg:grid lg:col-span-7 ">
                                <div className="flex overflow-x-auto scrollbar-hide">
                                    {loadingOffers ? (
                                        <div className="flex-1 flex items-center justify-center h-64 text-gray-400">
                                            Loading deals...
                                        </div>
                                    ) : activeOffer?.products?.length > 0 ? (
                                        activeOffer.products.map((prod: any, i: number) => (
                                            <Link
                                                key={prod._id}
                                                href={`/user/productDetail/${prod._id}`}
                                                className="flex-none md:flex-1 border-l border-t lg:border-t-0  border-gray-200 scrollbar-hide h-64 cursor-pointer hover:bg-slate-50 transition-colors group"
                                            >
                                                <div className="flex flex-col items-center justify-center p-2 pt-6 h-full relative">
                                                    <div className="h-32 flex items-center justify-center mb-4">
                                                        <img
                                                            src={prod.images?.[0] || ofimg1.src}
                                                            alt={prod.name}
                                                            className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    </div>
                                                    <p className="text-gray-800 font-medium text-center line-clamp-1 px-2">
                                                        {prod.name}
                                                    </p>
                                                    <span className="bg-red-100 mt-2 text-red-600 font-bold px-3 py-0.5 rounded-full text-sm">
                                                        -{activeOffer.discountPercentage}%
                                                    </span>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center h-64 text-gray-400 italic">
                                            No products in this deal.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <br />

            {/* Home and outdoor */}
            <div className="max-w-300 mx-auto bg-white  rounded-md border border-gray-200 shadow-md">

                <div className="lg:grid grid-cols-9 min-h-64">
                    <div className="lg:hidden flex p-4">
                        <h1 className="text-xl font-medium">Home and outdoor</h1>
                    </div>
                    <div className=" hidden lg:flex relative col-span-2 overflow-hidden ">
                        <Image
                            src={banner1}
                            alt="banner"
                            width={160}
                            className=" w-full h-full object-cover object-bottom-left scale-110 scale-x-[-1]"
                        />

                        <div className="absolute inset-0 bg-orange-200 opacity-30 "></div>

                        <div className="absolute inset-0 z-20 flex flex-col pt-6 px-6">
                            <h2 className="text-black text-2xl font-medium ">
                                Home and <br /> outdoor
                            </h2>
                            <button className="mt-4 w-32 cursor-pointer bg-white font-medium px-4 py-2 rounded shadow">
                                Source now
                            </button>
                        </div>
                    </div>

                    <div className="lg:grid flex flex-nowrap scrollbar-hide overflow-x-auto col-span-7 lg:grid-cols-4 lg:flex-1 ">
                        {homeProducts?.map((item, i) => (
                            <div
                                key={item._id || item.id}
                                className=" flex-none min-w-40 md:min-w-50 lg:min-w-0 col-span-1 relative border-l border-t lg:border-t-0 p-4 border-b border-gray-200 cursor-pointer"
                            >
                                <Link href={`/user/productDetail/${item._id || item.id}`} className="block h-full">
                                    <div className="flex flex-col items-center lg:items-start  gap-2 h-full">
                                        <Image
                                            src={(item.images && item.images[0]) || item.img}
                                            alt={item.name}
                                            width={90}
                                            height={80}
                                            className="lg:absolute bottom-0 right-0 w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <h2 className="font-medium capitalize ">{item.name}</h2>

                                        <p className="text-sm text-gray-400 leading-tight">
                                            From <br className="hidden lg:flex" /> USD {item.price}
                                        </p>
                                    </div>
                                </Link>

                            </div>
                        ))}
                    </div>
                    <div className="lg:hidden flex p-4 ">
                        <button className=" text-lg cursor-pointer text-blue-500 font-medium flex items-center justify-center gap-2">Source now <ArrowRight size={20} className="mt-1" /> </button>
                    </div>
                </div>
            </div>
            <br />
            {/* Electronics */}

            <div className="max-w-300 mx-auto bg-white  rounded-md border border-gray-200 shadow-md">
                <div className="lg:grid grid-cols-9 ">
                    <div className="lg:hidden flex p-4">
                        <h1 className="text-xl font-medium">Consumer electronics</h1>
                    </div>
                    <div className="lg:flex hidden relative col-span-2 min-h-64 lg:h-64 overflow-hidden">
                        <Image
                            src={banner2}
                            className="object-cover object-bottom-left w-full h-full"
                            alt="banner"
                        />

                        <div className="absolute inset-0 bg-gray-200 opacity-30 "></div>
                        <div className="absolute inset-0 z-20 flex flex-col pt-6 px-6">
                            <h2 className="text-black text-2xl font-medium ">
                                Consumer <br /> electronics and <br /> gadgets
                            </h2>
                            <button className="mt-4 w-32 cursor-pointer bg-white font-medium px-4 py-2 rounded shadow">
                                Source now
                            </button>
                        </div>
                    </div>

                    <div className="lg:grid flex col-span-7 overflow-x-auto scrollbar-hide lg:grid-cols-4 flex-1 ">
                        {techProductsArr?.map((item, i) => (
                            <div
                                key={item._id || item.id}
                                className=" flex-none min-w-40 md:min-w-50 lg:min-w-0 col-span-1 relative border-l border-t lg:border-t-0 p-4 border-b border-gray-200 cursor-pointer"
                            >
                                <Link href={`/user/productDetail/${item._id || item.id}`} className="block h-full">
                                    <div className="flex flex-col items-center lg:items-start gap-2 h-full">
                                        <Image
                                            src={(item.images && item.images[0]) || item.img}
                                            alt={item.name}
                                            width={90}
                                            height={80}
                                            className="lg:absolute bottom-0 right-0 w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <h2 className="font-medium capitalize ">{item.name}</h2>

                                        <p className="text-sm text-gray-400 leading-tight">
                                            From <br className="hidden lg:flex" /> USD {item.price}
                                        </p>
                                    </div>
                                </Link>

                            </div>
                        ))}
                    </div>
                    <div className="lg:hidden flex p-4 ">
                        <button className=" text-lg cursor-pointer text-blue-500 font-medium flex items-center justify-center gap-2">Source now <ArrowRight size={20} className="mt-1" /> </button>
                    </div>
                </div>
            </div>

            <br />


            <div className="max-w-300 mx-auto rounded-md overflow-hidden">
                <InquerySection />
            </div>
            <br />
            <div className="max-w-300 mx-auto mt-10 p-4 xl:p-0">

                <h2 className="text-2xl font-semibold mb-6">
                    Recommended items
                </h2>

                <div
                    className="
          grid 
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          lg:grid-cols-5 
          gap-4
        "
                >
                    {recommendedProducts?.map((product) => (
                        <ProductCard
                            key={product._id}
                            id={product._id}
                            name={product.name}
                            price={product.price}
                            img={product.images?.[0] || product.img}
                            showCart={false}
                        />
                    ))}
                </div>
            </div>
            <OurServices />
            <SuppliersByRegion />
            <NewsletterSection />
            <Footer />
        </>
    );
};

export default UserDashBoard;
