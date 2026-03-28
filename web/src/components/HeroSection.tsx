import Image from "next/image";
import heroImage from "@/assets/hero.webp"; // replace with your own image path
import userImage from "@/assets/avatar=pic1.jpg"
import { useSelector } from "react-redux";
import Link from "next/link";
// const categories = [
//   "Automobiles",
//   "Clothes and wear",
//   "Home interiors",
//   "Computer and tech",
//   "Tools, equipments",
//   "Sports and outdoor",
//   "Animal and pets",
//   "Machinery tools",
//   "More category",
// ];
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const { userData } = useSelector((state: any) => state.user);
  const [categories, setCategories] = useState<{title: string, slug: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All category");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/category");
        if (data.success) {
          const fetchedCats = data.categories.map((c: any) => ({
            title: c.title,
            slug: c.slug
          }));
          setCategories([{title: "All category", slug: "all"}, ...fetchedCats]);
        }
      } catch (error) {
        console.error("Error fetching categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  return (
    <div className="max-w-300  mx-auto md:p-4 bg-white rounded-md lg:border lg:border-gray-200 flex flex-col lg:flex-row gap-4">
      {/* Left Sidebar */}
      <div className="lg:flex hidden">
        <div className="shrink-0  lg:w-64 bg-white rounded-md">
        <ul className="flex flex-col gap-1 text-gray-700 font-">
          {loading ? (
            <li className="px-4 py-1.5 text-gray-400 animate-pulse">Loading categories...</li>
          ) : (
            categories.map((cat, index) => (
              <li
                key={index}
                onClick={() => {
                  setSelectedCategory(cat.title);
                  if (cat.slug === "all") {
                    router.push("/user/shop");
                  } else {
                    router.push(`/user/shop?category=${cat.slug}`);
                  }
                }}
                className={`px-4 py-1.5 rounded-md cursor-pointer transition-all capitalize ${
                  selectedCategory === cat.title ? "bg-blue-100 font-semibold text-blue-700" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {cat.title}
              </li>
            ))
          )}
        </ul>
      </div>
      </div>

      {/* Center Banner */}
      <div className="flex-1 relative flex items-center justify-center">
  
          <Image
            src={heroImage}
            alt="Hero"
            className="object-cover h-full w-full"
          />
        </div>
      {/* </div> */}

      {/* Right Action Boxes */}
      <div className=" hidden lg:flex flex-col gap-3 w-full lg:w-52">
        <div className="bg-blue-100 rounded-md p-4  text-gray-800 font-medium">
            <div className="flex gap-2 items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-blue-200 text-blue-700 font-bold border-2 border-blue-300">
                    {userData?.image ? (
                        <Image src={userData.image} alt="user" width={48} height={48} className="w-full h-full object-cover"/>
                    ) : userData?.email ? (
                        <span className="text-xl">{userData.email.charAt(0).toUpperCase()}</span>
                    ) : (
                        <Image src={userImage} alt="user" width={48} height={48} className="w-full h-full filter grayscale-25 object-cover"/>
                    )}
                </div> 
                <span className="leading-tight text-sm">Hi, {userData?.name ? userData.name.split(' ')[0] : 'user'} <br /> let's get started</span>
            </div>
          <div className="mt-4 flex flex-col gap-2">
            {userData ? (
              <>
                <Link href="/user/profile" className="bg-blue-600 text-white px-4 py-1.5 text-center text-sm font-normal rounded-md hover:bg-blue-700 transition">
                  My Profile
                </Link>
                <Link href="/user/orders" className="bg-white border text-center border-gray-300 px-4 py-1.5 text-sm font-normal rounded-md hover:bg-gray-100 transition">
                  Track Orders
                </Link>
              </>
            ) : (
              <>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-1.5 text-center text-sm font-normal rounded-md hover:bg-blue-700 transition">
                  Join now
                </Link>
                <Link href="/login" className="bg-white border text-center border-gray-300 px-4 py-1.5 text-sm font-normal rounded-md hover:bg-gray-100 transition">
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="bg-orange-400 text-white rounded-md p-4 text- font-thin">
          Get US $10 off <br /> with a new <br /> supplier
        </div>

        <div className="bg-teal-400 text-white rounded-md p-4 font-thin">
          Send quotes with <br /> supplier preferences
        </div>
      </div>
    </div>
  );
}