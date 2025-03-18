import {Router} from "express";
import AuthController from "./auth.controller";
import Multer from "../../middleware/multer";
import Protected from "../../middleware/protected";

class AuthRouter extends AuthController{
    readonly router = Router();
    multer;

    constructor() {
        super();
        this.multer = new Multer()
        this.init();
    }

    init() {
        this.router.route("/signup").post(this.multer.upload.single("avatar"), this.signUp.bind(this));
        this.router.route("/login").post(this.login.bind(this));
        this.router.route("/logout").get(Protected(),this.logout.bind(this));
        this.router.route("/refresh-token").get(Protected(),this.refreshToken.bind(this));
        this.router.route("/verify-account/:token").get(Protected(),this.verifyUser.bind(this));
        this.router.route("/verify-account/new/token").get(Protected(),this.newVerifyToken.bind(this));

    }
}

export default new AuthRouter().router;