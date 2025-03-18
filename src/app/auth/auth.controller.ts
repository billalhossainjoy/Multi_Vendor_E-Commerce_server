import asyncHandler from "../../lib/asyncHandler";
import UserService from "../user/user.service";
import { LoginSchema, SignUpSchema } from "../../schema/auth.schema";
import {ResponseApi} from "../../lib/responseApi";
import userModel, {User} from "../user/user.model";
import AuthService from "./auth.service";
import JWTService from "../../lib/jwt";
import {accessCookieOptions, refreshCookieOptions} from "../../utils/constants";
import Jwt from "../../lib/jwt";
import {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_VERIFY_TOKEN_SECRET} from "../../config/env.config";
import {ErrorApi} from "../../utils/ErrorApi";
import jwt from "jsonwebtoken";
import UserModel from "../user/user.model";
import {StatusCodes} from "http-status-codes";


class AuthController {
    constructor(
        private readonly userService = new UserService(),
        private readonly authService = new AuthService(),
        private readonly  jwt = new JWTService()
    ) {}

    signUp = asyncHandler(async (req, res) => {
        try {
            await userModel.deleteMany()
            const body = { ...req.body}
            if(req.file) body.avatar = req.file

            const {email, password, avatar} = SignUpSchema.parse(body);

            console.log(avatar)

            const newUser = await this.userService.createUser(email, password)

            const refreshToken = this.jwt.generateRefreshToken({id: newUser.id})
            const accessToken = this.jwt.generateAccessToken({id: newUser.id, role: newUser.role})

            newUser.refreshToken = refreshToken
            newUser.verifyToken = this.jwt.generateToken(newUser.id)

            res.cookie("accessToken", accessToken,accessCookieOptions);
            res.cookie("refreshToken", refreshToken,accessCookieOptions);

            await newUser.save()

            const userObject = newUser.toObject()
            delete userObject.password;
            delete userObject.refreshToken;
            userObject.accessToken = accessToken
            return ResponseApi<User>(res, 200, "User Created successfully", userObject);
        } catch (err) {
            console.log(err);
            throw err;
        }
    })

    login = asyncHandler(async (req, res) => {
        try {
            const {email, password} = LoginSchema.parse(req.body);

            const user = await this.authService.authenticatedUser(email, password);

            const refreshToken = this.jwt.generateRefreshToken({id: user.id})
            const accessToken = this.jwt.generateAccessToken({id: user.id, role: user.role})

            user.refreshToken = refreshToken

            res.cookie("accessToken", accessToken,accessCookieOptions);
            res.cookie("refreshToken", refreshToken,accessCookieOptions);

            await user.save()

            const userObject = user.toObject()
            delete userObject.password;
            delete userObject.refreshToken
            userObject.accessToken = accessToken
            return ResponseApi<User>(res, 200, "User Login Successfully", userObject);
        } catch (err) {
            throw err;
        }
    })

    logout = asyncHandler(async (req, res) => {
        try {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");

            return ResponseApi(res, 200, "User Logout Successfully", null);
        } catch (err) {
            throw err;
        }
    })

    refreshToken = asyncHandler(async (req, res) => {
        try {
            const user = await this.userService.findById(req.user.id);
            const token = user.refreshToken || ""

            const decoded = JWTService.verifyToken(token, JWT_REFRESH_SECRET)
            if(!decoded) throw new ErrorApi(401, "Invalid Token");

            const refreshToken = this.jwt.generateRefreshToken({id: user.id})
            const accessToken = this.jwt.generateAccessToken({id: user.id, role: user.role})

            user.refreshToken = refreshToken

            res.cookie("accessToken", accessToken,accessCookieOptions);

            await user.save()

            return ResponseApi(res, 200, "Refresh token.", {
                refreshToken: refreshToken,
                accessToken: accessToken,
            });
        } catch (err) {
            throw err;
        }
    })

    verifyUser = asyncHandler(async (req,res) => {
        try {
            const token = req.params.token
            const decoded = JWTService.verifyToken(token, JWT_VERIFY_TOKEN_SECRET);
            if(!decoded || !(decoded.id === req.user.id) ) throw new ErrorApi(StatusCodes.FORBIDDEN, "Invalid token");

            if(req.user.verified) return ResponseApi(res, StatusCodes.OK, "Already verified.", );

            await userModel.findByIdAndUpdate(req.user.id, {
                verified: true,
            })

            return ResponseApi(res, StatusCodes.OK, "Successfully verified.");
        }catch(err) {
            console.log(err)
            throw err;
        }
    })

    newVerifyToken = asyncHandler(async (req,res) => {
        try {
            const user = await this.userService.findById(req.user.id);

            user.verifyToken = this.jwt.generateToken(user.id);
            await user.save();

            return ResponseApi(res, StatusCodes.OK, "Verify token refreshed." );
        }catch(err) {
            throw err;
        }
    })
}

export default AuthController;