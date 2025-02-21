import dotenv from "dotenv";
dotenv.config();

const env = {
  MONGO_URI: process.env.MONGO_URI!,
};

export const { MONGO_URI } = env;
