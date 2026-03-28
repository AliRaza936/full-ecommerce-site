import mongoose from "mongoose";
import { ICartItem } from "./cart.model";

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
  shippingInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  status: "pending" | "shipped" | "delivered" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new mongoose.Schema<ICartItem>({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema<IOrder>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "completed", "cancelled"],
    default: "pending",
  },
}, { timestamps: true });

delete mongoose.models.Order;
const Order = mongoose.model("Order", orderSchema);
export default Order;
