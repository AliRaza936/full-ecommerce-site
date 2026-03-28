import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  catName: string;
  catSlug: string;
  images: string[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxLength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      default: 0,
    },
    catName: {
      type: String,
      required: [true, 'Please provide a category name'],
      trim: true,
    },
    catSlug: {
      type: String,
      required: [true, 'Please provide a category slug'],
      trim: true,
      lowercase: true,
    },
    images: {
      type: [String],
      validate: [
        (v: string[]) => v.length <= 6,
        'Cannot have more than 6 images'
      ],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide product stock'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Protect against OverwriteModelError
const ProductModel: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default ProductModel;
