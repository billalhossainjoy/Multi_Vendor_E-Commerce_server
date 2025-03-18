import asyncHandler from "../lib/asyncHandler";
import Jwt from "../lib/jwt";
import {JWT_ACCESS_SECRET} from "../config/env.config";
import {ErrorApi} from "../utils/ErrorApi";
import {StatusCodes} from "http-status-codes";
import UserService from "../app/user/user.service";
import {Role} from "../constants/role";
import {User} from "../app/user/user.model";

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
        delete user.password

        req.user = user

        if(args.length === 0 ) return next()

        if(!args.includes(req.user.role as Role)) throw new ErrorApi(StatusCodes.UNAUTHORIZED, "Unauthorized");
        next()
    }catch (error) {
        throw error
    }
})

export default Protected