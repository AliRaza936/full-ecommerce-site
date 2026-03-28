import { StaticImageData } from "next/image"

export interface Product {
  id: number
  name: string
  price: number
  oldPrice?: number
  rating: number
  orders: number
  brand: string
  category: string
  features: string[]
  condition: string
  verified: boolean
  img: StaticImageData
}