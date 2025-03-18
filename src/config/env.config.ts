import dotenv from "dotenv";
dotenv.config();

const env = {
  MONGO_URI: process.env.MONGO_URI!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY!,
  JWT_VERIFY_TOKEN_SECRET: process.env.JWT_VERIFY_TOKEN_SECRET!,
  JWT_VERIFY_TOKEN_EXPIRY: process.env.JWT_VERIFY_TOKEN_EXPIRY!,


};

export const { MONGO_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRY, JWT_REFRESH_EXPIRY , JWT_VERIFY_TOKEN_SECRET, JWT_VERIFY_TOKEN_EXPIRY} = env;
