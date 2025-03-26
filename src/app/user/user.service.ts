import UserModel, {User} from "./user.model";
import {ErrorApi} from "../../middleware/error/ErrorApi";
import {StatusCodes} from "http-status-codes";

class UserService {
    async findById(id: string): Promise<User> {
        const user = await UserModel.findById(id).select("-password");
        if(!user) throw new ErrorApi(404, "User not found")
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return UserModel.findOne({email});
    }

    async createUser(email: string, password: string): Promise<User> {
        const exitingUser = await this.findByEmail(email);
        if (exitingUser) throw new ErrorApi(StatusCodes.CONFLICT, "user already exists.");

        return UserModel.create({
            email,
            password
        })
    }

    async updateUser(user: Partial<User>): Promise<User | null> {
        return UserModel.findByIdAndUpdate(user.id, user)
    }

    async deleteUser(id: string) {
        await UserModel.findByIdAndDelete(id)
        return "User deleted successfully.";
    }
}

export default UserService