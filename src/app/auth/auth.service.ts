import {User} from "../user/user.model";
import UserService from "../user/user.service";
import {ErrorApi} from "../../middleware/error/ErrorApi";


class AuthService extends UserService{
    async authenticatedUser(email: string, password: string): Promise<User> {
        const user = await this.findByEmail(email);
        if (!user) throw new ErrorApi(404, 'User not found');
        const validatePassword =await user.isValidate(password)
        if (!validatePassword) throw new ErrorApi(401, 'Invalid password');
        return user;
    }

}

export default AuthService