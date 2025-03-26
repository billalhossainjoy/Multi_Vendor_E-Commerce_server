import jwt, {JwtPayload} from 'jsonwebtoken';
import ms from 'ms';
import {JWT_ACCESS_EXPIRY, JWT_ACCESS_SECRET, JWT_REFRESH_EXPIRY, JWT_REFRESH_SECRET, JWT_VERIFY_TOKEN_EXPIRY, JWT_VERIFY_TOKEN_SECRET} from "../config/env.config";


class JWTService {
    generateToken(id: string, time?: ms.StringValue) {
        return jwt.sign({id}, JWT_VERIFY_TOKEN_SECRET, {
            expiresIn:time || JWT_VERIFY_TOKEN_EXPIRY as ms.StringValue
        })
    }

    generateAccessToken (user: Object) {
        return jwt.sign(user,JWT_ACCESS_SECRET,{
            expiresIn: JWT_ACCESS_EXPIRY as ms.StringValue,
        })
    }

    generateRefreshToken(user: Object) {
        return jwt.sign(user,JWT_REFRESH_SECRET,{
            expiresIn: JWT_REFRESH_EXPIRY as ms.StringValue,
        })
    }

    static verifyToken<T,>(token: string, secret: string) {
        return jwt.verify(token, secret) as JwtPayload
    }
}

export default JWTService