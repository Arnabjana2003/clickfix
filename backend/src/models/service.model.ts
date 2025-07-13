import mongoose, { Document, Schema, Types } from "mongoose";

export interface IService extends Document {
  serviceProviderId: Types.ObjectId;
  categoryId: Types.ObjectId;
  subCategoryId: Types.ObjectId;
  rating: number;
  tags: Array<string>;
  experienceInYear: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    serviceProviderId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    experienceInYear:{
      type:Number,
      default:0
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    rating: {
      type: Number,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

ServiceSchema.index({ category: 1, subCategory: 1 });

export default mongoose.model<IService>("Service", ServiceSchema);
