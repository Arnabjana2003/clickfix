import mongoose, { Date, Schema } from "mongoose";
import { Document, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  image: {
    url: string;
    fileId?: string;
    metadata?: object;
  };
  isActive: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      url: {
        type: String,
        required: true,
        trim: true,
      },
      fileId: String,
      metadata: Object,
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

export default mongoose.model<ICategory>("Category", CategorySchema);
