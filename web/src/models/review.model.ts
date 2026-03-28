import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  userImage?: string;
  rating: number; // 1-10
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema<IReview> = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups by product
ReviewSchema.index({ productId: 1, createdAt: -1 });

const ReviewModel: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default ReviewModel;
