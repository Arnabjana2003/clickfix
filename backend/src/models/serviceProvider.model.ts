import mongoose, { Schema, Document, Types } from "mongoose";

export interface IServiceProvider extends Document {
  userId: Types.ObjectId;
  isProfileCompleted: boolean;
  isVerified: boolean;
  isAvailable: boolean;
  workingRadiusInKm: number;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  skills: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceProviderSchema = new Schema<IServiceProvider>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    workingRadiusInKm: {
      type: Number,
      default: 5,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

ServiceProviderSchema.index({ location: "2dsphere" });

export default mongoose.model<IServiceProvider>(
  "ServiceProvider",
  ServiceProviderSchema
);
