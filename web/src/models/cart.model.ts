import mongoose from "mongoose";

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  qty: number;
}

export interface ICart {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new mongoose.Schema<ICartItem>({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
}, { _id: false });

const cartSchema = new mongoose.Schema<ICart>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [itemSchema],
  totalAmount: {
  },
}, { timestamps: true });

delete mongoose.models.Cart;
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
