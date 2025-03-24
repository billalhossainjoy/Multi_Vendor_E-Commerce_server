import asyncHandler from "../lib/asyncHandler";
import Jwt from "../lib/jwt";
import {JWT_ACCESS_SECRET} from "../config/env.config";
import {ErrorApi} from "./error/ErrorApi";
import {StatusCodes} from "http-status-codes";
import UserService from "../app/user/user.service";
import {Role} from "../constants/role";
import {User} from "../app/user/user.model";
import {JsonWebTokenError} from 'jsonwebtoken'
import jwtHandler from "./error/JwtHandler";

declare global{
    namespace Express {
        interface Request {
            user: User
        }
    }
}

const Protected = (...args: Role[]) =>  asyncHandler(async (req,res, next) => {
    const userService = new UserService()
    try {
        const token = req.cookies.accessToken
        if(!token) throw new ErrorApi(StatusCodes.UNAUTHORIZED, "Unauthorized");

        const decoded = Jwt.verifyToken(token, JWT_ACCESS_SECRET)
        if(!decoded || !decoded.id ) throw new ErrorApi(StatusCodes.UNAUTHORIZED, "Unauthorized");
        const user = await userService.findById(decoded.id)
        const resUser = user.toObject()

        delete resUser.password
        delete resUser.refreshToken;
        delete resUser.verifyToken;

        req.user = resUser;

        if(args.length === 0 ) return next();

        if(!args.includes(req.user.role as Role)) throw new ErrorApi(StatusCodes.UNAUTHORIZED, "Unauthorized");
        next()
    }catch (error) {
        if(error instanceof JsonWebTokenError) {
            if(error.message === "jwt expired" && req.cookies.refreshToken) {
                await jwtHandler.RefreshTokenHandler(req, res)
                next();
                return;
            }
        }

        throw error
    }
})

export default Protected