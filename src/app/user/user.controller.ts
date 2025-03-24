import AsyncHandler from "../../lib/asyncHandler";
import {ResponseApi} from "../../lib/responseApi";
import {StatusCodes} from "http-status-codes";
import {User} from "./user.model";


class UserController {
    getUser = AsyncHandler(async (req,res) => {
        try {
            return ResponseApi<User>(res, StatusCodes.OK, "ok", req.user)
        }catch (err) {
            throw err;
        }
    })
}

export default UserController;