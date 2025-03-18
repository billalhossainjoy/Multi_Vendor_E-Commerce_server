import {Router} from "express";
import UserController from "./user.controller";
import Protected from "../../middleware/protected";
import {Role} from "../../constants/role";

class UserRouter extends  UserController {
    readonly router = Router();

    constructor() {
        super()
        this.init();
    }

    init(): void {
        this.router.route("/get").get(Protected(), this.getUser)
    }
}

export default new UserRouter().router;