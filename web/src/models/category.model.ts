import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICategory extends Document {
  title: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema<ICategory> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a category title'],
      unique: true,
      trim: true,
      maxLength: [50, 'Title cannot be more than 50 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// Protect against OverwriteModelError
const CategoryModel: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default CategoryModel;
