import Image, { StaticImageData } from "next/image"
import { Star, Heart } from "lucide-react"
import { useState } from "react"
import { Rating } from "@mui/material";
import Link from "next/link";
type Product = {
  id: string | number;
  name: string;
  img: StaticImageData | string; // since you are using Next.js Image import or API strings
  price: number;
  oldPrice: number;
  discount?: number;
  description?:string;
  category: string;
  brand: string;
  rating: number;
  orders: number;
  verified: boolean;
  featured: boolean;
};


const ShopProductCard = ({
  product,
  view,
}: {
  product: Product
  view: "grid" | "list"
}) => {
  const [favorite, setFavorite] = useState(false)

  return (
    <div
      className={
        view === "grid"
          ? "border border-gray-200 rounded-lg  lg:min-h-54 bg-white relative hover:shadow-md transition"
          : "border border-gray-200 rounded-lg  bg-white flex lg:gap-4 relative hover:shadow-md transition"
      }
    >
      {/* Heart icon */}
    

<Link href={`/user/productDetail/${product.id}`}>
    <div
  className={`lg:p-4 flex items-center justify-center rounded-lg  ${
    view === "list" ? "w-28 lg:w-auto shrink-0" : ""
  }`}
>
  <Image
    src={product.img}
    alt={product.name}
    width={view === "grid" ? 220 : 220}   // smaller for list
    height={view === "grid" ? 190 : 120}  // smaller for list
    className="object-cover w-full"
  />
</div>
</Link>
    {
        view == 'grid' && <hr className="text-gray-200" />
    }
 {/* <hr /> */}
      <div className="flex relative flex-col  flex-1 lg:p-4 p-2 ">
        {
            view == 'list' &&
        <Link href={`/user/productDetail/${product.id}`}>
          <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors uppercase">{product.name}</h3>
        </Link>
        }

        <div className="flex items-center gap-2 lg:mt-1">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
          {/* <span className="line-through text-gray-400">${product.oldPrice}</span> */}
        </div>

        <div className="flex lg:flex-row flex-col lg:items-center lg:gap-2 lg:mt-2 text-sm text-gray-600">
         <div className="flex">
             <div className="flex items-center gap-2">
  {/* <Rating
    name="product-rating"
    value={product.rating} 
    precision={0.5}        
    max={5}                
    readOnly               
    size="small"           
  /> */}
  {/* <span className="text-yellow-600 text-lg">{product.rating.toFixed(1)}</span> */}
</div>
{
    view == 'list' &&<div className="flex items-center gap-2">
    <span className="text-2xl mb-1 text-gray-400" >•</span>
          <span className="text-gray-500">{product.orders} orders</span>
    </div>
}
         </div>
          

          {view == 'list' && (
            <div className="flex items-center gap-2">
              <span className="text-2xl mb-1 text-gray-400" >•</span>
              <span className="text-green-600  text-lg">Free Shipping</span>
            </div>
          )}
        </div>

        {view == 'list' && (
          <p className="text-gray-500 text- mt-2 line-clamp-2 hidden lg:block">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit quae optio omnis ad beatae expedita. Vero minus earum ex cumque!
          </p>
        )}

        
        {
            view == 'list' &&
          <Link href={`/user/productDetail/${product.id}`} className="text-blue-600 hidden lg:flex mt-2 font-medium text-lg w-28 justify-center hover:underline">
            View details
          </Link>
        }
        {
            view == 'grid' &&
        <Link href={`/user/productDetail/${product.id}`}>
          <h3 className=" text-lg text-gray-400 hover:text-blue-600 transition-colors">{product.name}</h3>
        </Link>
        }

        {/* {product.featured && view == 'list' && (
          <span className="mt-2 w-fit px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
            Featured
          </span>
        )} */}
       
         <div className="hidden lg:block border border-gray-200 p-2 rounded absolute top-4 right-4 cursor-pointer" onClick={() => setFavorite(!favorite)}>
             <Heart
        size={24}
        className={` transition-colors  ${
          favorite ? "text-red-500 fill-red-500" : "text-blue-400"
        }`}
        
      />
         </div>
      </div>
    </div>
  )
}

export default ShopProductCard