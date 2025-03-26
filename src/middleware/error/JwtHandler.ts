import JWTService from "../../lib/jwt";
import {JWT_REFRESH_SECRET} from "../../config/env.config";
import {ErrorApi} from "./ErrorApi";
import {accessCookieOptions, refreshCookieOptions} from "../../utils/constants";
import {ResponseApi} from "../../lib/responseApi";
import {Request, Response} from "express";
import UserModel, {User} from "../../app/user/user.model";


class JwtHandler {
    static RefreshTokenHandler = async (req:Request, res: Response) => {
        const jwt = new JWTService();
        try{
            const decoded = JWTService.verifyToken(req.cookies.refreshToken, JWT_REFRESH_SECRET)
            if(!decoded || !decoded.id) throw new ErrorApi(401, "Invalid Token");

            const user = await UserModel.findById(decoded.id)
            if(!user) throw new ErrorApi(401, "Invalid User");

            const refreshToken = jwt.generateRefreshToken({id: user.id})
            const accessToken = jwt.generateAccessToken({id: user.id, role: user.role})

            user.refreshToken = refreshToken
            await user.save()

            const resUser = user.toObject()

            delete resUser.password
            delete resUser.refreshToken;
            delete resUser.verifyToken;

            req.user = resUser;

            res.cookie("accessToken", accessToken,accessCookieOptions);
            res.cookie("refreshToken", refreshToken,refreshCookieOptions);

        } catch (error) {
           console.log(error)
            throw error
        }
    }
}

export default JwtHandler