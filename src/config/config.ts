import path from "node:path";
import dotenv from "dotenv";

const envPath = path.join(__dirname, `../../.env.${process.env.NODE_ENV}`)

export default dotenv.config({path: envPath});

