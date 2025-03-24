import "../config/config"

// mongodb
export const {MONGO_URI} = {
  MONGO_URI: process.env.MONGO_URI!,
}

// json-web-token
export const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_EXPIRY,
  JWT_VERIFY_TOKEN_SECRET,
  JWT_VERIFY_TOKEN_EXPIRY,
} = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY!,
  JWT_VERIFY_TOKEN_SECRET: process.env.JWT_VERIFY_TOKEN_SECRET!,
  JWT_VERIFY_TOKEN_EXPIRY: process.env.JWT_VERIFY_TOKEN_EXPIRY!,
};

// SMTP
export const {
  SMTP_SERVICE,
  SMTP_CLIENT_ID,
  SMTP_CLIENT_SECRET,
  SMTP_REFRESH_TOKEN
} = {
  SMTP_SERVICE: process.env.SMTP_SERVICE!,
  SMTP_CLIENT_ID: process.env.SMTP_CLIENT_ID!,
  SMTP_CLIENT_SECRET: process.env.SMTP_CLIENT_SECRET!,
  SMTP_REFRESH_TOKEN: process.env.SMTP_REFRESH_TOKEN!,
}

// Cloudinary
export const {CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} = {
  CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
}