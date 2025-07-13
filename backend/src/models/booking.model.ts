import mongoose, { Document, Schema, Types } from "mongoose";
import { IAddress } from "./address.model";

export interface IBooking extends Document {
  userId: Types.ObjectId;
  subCategoryId: Types.ObjectId;
  preferredTime: Date;
  isProviderAssigned:boolean;
  serviceProviderId:Types.ObjectId;
  scheduledAt:Date;
  endTime:Date;
  status: "pending" | "confirmed" | "ongoing" | "completed" | "cancelled";
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: IAddress;
  notes: string;
  paymentMode: "cod" | "online";
  totalPrice: number;
  paymentDetails: {
    amount: number;
    status: "not_initiated" | "initiated";
    paymentId: Types.ObjectId;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    address: Object,
    status: {
      type: String,
      enum: ["pending", "confirmed", "ongoing", "completed", "cancelled"],
      default: "pending",
    },
    preferredTime: Date,
    isProviderAssigned:{
      type:Boolean,
      default:false
    },
    serviceProviderId:{
      type:Schema.Types.ObjectId,
      ref:"ServiceProvider"
    },
    scheduledAt: Date,
    endTime: Date,
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
    notes: String,
    paymentMode: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },
    paymentDetails: {
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ["not_initiated", "initiated"],
        default: "not_initiated",
      },
      paymentId: {
        type: Schema.Types.ObjectId,
        ref: "Payment",
        validate: {
          validator: function (this: any, value: Types.ObjectId | undefined) {
            if (this.paymentDetails?.status === "initiated") {
              return !!value;
            }
            return true;
          },
          message: "paymentId is required when payment status is 'initiated'",
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", BookingSchema);
