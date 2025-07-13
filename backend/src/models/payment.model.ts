import mongoose, { Date, Schema } from "mongoose";
import { Document, Types } from "mongoose";

export interface IPayment extends Document{
    bookingId: Types.ObjectId;
    userId: Types.ObjectId;
    transactionId: string;
    amount: number;
    paymentGateway:string,
    status: "initiated" | "success" | "pending" | "failed";
    pgResponse: any;
    createdAt: Date;
    updateedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
    bookingId:{
        type: Schema.Types.ObjectId,
        ref:"Booking",
        required: true,
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    transactionId:{
        type: String,
        required: true,
    },
    paymentGateway:{
        type: String,
        default: 'Phonepe'
    },
    status:{
        type: String,
        enum: ["initiated" , "success" , "pending" , "failed"],
        default: "initiated",
    },
    pgResponse:Object
},{timestamps:true})

export default mongoose.model<IPayment>("Payment",PaymentSchema)