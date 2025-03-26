import asyncHandler from "../../lib/asyncHandler";
import UserService from "../user/user.service";
import {EmailSchema, LoginSchema, PasswordSchema, SignUpSchema} from "../../schema/auth.schema";
import {ResponseApi} from "../../lib/responseApi";
import {User} from "../user/user.model";
import AuthService from "./auth.service";
import JWTService from "../../lib/jwt";
import {accessCookieOptions, refreshCookieOptions} from "../../utils/constants";
import {JWT_REFRESH_SECRET, JWT_VERIFY_TOKEN_SECRET} from "../../config/env.config";
import {ErrorApi} from "../../middleware/error/ErrorApi";
import UserModel from "../user/user.model";
import {StatusCodes} from "http-status-codes";
import NodeMailer from "../../lib/node-mailer/nodeMailer";
import {verificationEmail} from "../../lib/node-mailer/verification-mail/verification-mail";
import {forgottenPasswordEmail} from "../../lib/node-mailer/forgotten-password/forgotten-password";


class AuthController {
    constructor(
        private readonly userService = new UserService(),
        private readonly authService = new AuthService(),
        private readonly  jwt = new JWTService()
    ) {}

    signUp = asyncHandler(async (req, res) => {
        try {
            await UserModel.deleteMany()
            const body = { ...req.body}
            if(req.file) body.avatar = req.file

            const {email, password, avatar} = SignUpSchema.parse(body);

            if(avatar) {
                console.log((avatar))
            }

            const newUser = await this.userService.createUser(email, password)

            const refreshToken = this.jwt.generateRefreshToken({id: newUser.id})
            const accessToken = this.jwt.generateAccessToken({id: newUser.id, role: newUser.role})

            newUser.refreshToken = refreshToken;
            newUser.verifyToken = this.jwt.generateToken(newUser.id);

            res.cookie("accessToken", accessToken,accessCookieOptions);
            res.cookie("refreshToken", refreshToken,accessCookieOptions);

            await newUser.save()
            const mailer =new NodeMailer(verificationEmail(newUser.email, newUser.verifyToken));
            mailer.sendMail()

            const userObject = newUser.toObject()
            delete userObject.password;
            delete userObject.refreshToken;
            delete userObject.verifyToken;

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
            delete userObject.verifyToken
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
            const decoded = JWTService.verifyToken(token, JWT_VERIFY_TOKEN_SECRET)
            if(!decoded || !(decoded.id === req.user._id.toString()) ) throw new ErrorApi(StatusCodes.FORBIDDEN, "Invalid token");

            if(req.user.verified) return ResponseApi(res, StatusCodes.OK, "Already verified.", );

            const user = await UserModel.findOneAndUpdate({
                verifyToken: token,
            }, {
                verified: true,
                $unset: {
                    verifyToken: 1
                },
            },{new: true})

            if(!user?.verified) throw new ErrorApi(StatusCodes.FORBIDDEN, "Invalid token.");

            return ResponseApi(res, StatusCodes.OK, "Successfully verified.");
        }catch(err) {
            console.log(err)
            throw err;
        }
    })

    newVerifyToken = asyncHandler(async (req,res) => {
        try {
            const user = await this.userService.findById(req.user._id.toString());

            user.verifyToken = this.jwt.generateToken(user.id);
            await user.save();

            return ResponseApi(res, StatusCodes.OK, "Verify token refreshed." );
        }catch(err) {
            throw err;
        }
    })

    forgotPassword = asyncHandler(async (req,res) => {
        try {
            const email = EmailSchema.parse(req.body.email);

            const user = await this.userService.findByEmail(email);
            if(!user) throw new ErrorApi(StatusCodes.FORBIDDEN, "Invalid email.");

            const token = this.jwt.generateToken(user._id.toString(), "1Hour")

            user.forgottenToken = token

            await user.save()

            const mailer = new NodeMailer(forgottenPasswordEmail(email, token))
            mailer.sendMail()

            return ResponseApi(res, StatusCodes.OK, "Email sent successfully." );
        }catch(err) {
            throw err;
        }
    })

    resetPassword = asyncHandler(async (req,res) => {
        try {
            const token = req.params.token
            if(!token) throw new ErrorApi(StatusCodes.FORBIDDEN, "Invalid token.");

            const password = PasswordSchema.parse(req.body.password);

            const decoded = JWTService.verifyToken(token, JWT_VERIFY_TOKEN_SECRET)
            if(!decoded) throw new ErrorApi(StatusCodes.FORBIDDEN, "Invalid token.");

            const user = await UserModel.findOneAndUpdate({
                forgottenToken: token,
            }, {
                password,
                $unset: {
                    forgottenToken: 1
                }
            })
            if(!user) throw new ErrorApi(StatusCodes.FORBIDDEN, "Invalid token.");


            return ResponseApi(res, StatusCodes.OK, "Reset successfully." );

        }catch (err) {
            throw err;
        }
    })


}

export default AuthController;