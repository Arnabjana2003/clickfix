import mongoose, { Date, Document } from "mongoose";
import { Schema, Types } from "mongoose";

export interface IAdmin extends Document {
  userId: Types.ObjectId;
  createdAt: Date;
  updateddAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAdmin>("Admin", AdminSchema);
