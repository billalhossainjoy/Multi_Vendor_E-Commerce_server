import mongoose from "mongoose";
import {MONGO_URI} from "./env.config";

const ConnectDB = async () => {
  try {
    const db = await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
    return db;
  } catch (error) {
    throw error;
  }
};

export default ConnectDB;
