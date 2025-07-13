import mongoose from "mongoose";
import envConfig from "../envConfig";

const connectDB = async () => {
  try {
    const mongoURI = envConfig.database.url;

    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // exit process if DB fails to connect
  }
};

export default connectDB;
