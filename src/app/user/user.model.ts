import mongoose, {Document} from "mongoose";
import bcrypt from "bcryptjs";


export interface User extends Document{
    avatar: string | null
    name: string;
    email: string;
    password?: string;
    refreshToken?: string;
    role: "ADMIN"| "USER" | "VENDOR"
    createdAt: Date;
    updatedAt: Date;
    isValidate: (password: string) => boolean
    verifyToken: string;
    verified: boolean;
}

const UserSchema = new mongoose.Schema<User>({
    avatar: String,
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: String,
    role: {
        type: String,
        required: true,
        enum: ["ADMIN", "USER", "VENDOR"],
        default: 'USER',
    },
    verifyToken: String,
    verified: Boolean
}, {timestamps: true});

UserSchema.pre("save", async function (next) {
    if(!this.password) return next()
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next()
    }catch (err: any) {
       next(err)
    }
})

UserSchema.methods.isValidate = function (password: string) {
    return bcrypt.compare(password, this.password)
}

const UserModel = mongoose.model("User", UserSchema);

export default UserModel