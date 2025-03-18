import {CookieOptions} from "express";
import { NODE_ENV } from "../config/app.config";

export const accessCookieOptions:CookieOptions = {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite : false,
    maxAge: 60 * 60 * 1000,
}

export const refreshCookieOptions:CookieOptions = {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite : false,
    maxAge: 60 * 60 * 1000,
}