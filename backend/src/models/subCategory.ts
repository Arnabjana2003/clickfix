import mongoose, { Date, Schema } from "mongoose";
import { Document, Types } from "mongoose";

export interface ISubCategory extends Document {
  name: string;
  categoryId: Types.ObjectId;
  createdBy: Types.ObjectId;
  price: number;
  estimatedTimeInMinute: number;
  image: {
    url: string;
    fileId?: string;
    metadata?: object;
  };
  isActive: boolean;
  numberOfProviders: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubCategorySchema = new Schema<ISubCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      fileId: String,
      metadata: Object,
    },
    numberOfProviders: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedTimeInMinute: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISubCategory>("SubCategory", SubCategorySchema);
