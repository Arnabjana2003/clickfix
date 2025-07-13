import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export type TRoles = "customer" | "service_provider" | "admin"

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "customer" | "service_provider" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (v) => v.length === 10,
        message: "Phone number must be 10 digits",
      },
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "service_provider", "admin"],
      default: "customer",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

export default mongoose.model<IUser>("User", UserSchema);
