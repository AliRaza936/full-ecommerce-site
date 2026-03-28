import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOffer extends Document {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  discountPercentage: number;
  isActive: boolean;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema: Schema<IOffer> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an offer title'],
      trim: true,
      maxLength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date'],
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Please provide a discount percentage'],
      min: [0, 'Discount cannot be less than 0'],
      max: [100, 'Discount cannot exceed 100'],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const OfferModel: Model<IOffer> =
  mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);

export default OfferModel;
