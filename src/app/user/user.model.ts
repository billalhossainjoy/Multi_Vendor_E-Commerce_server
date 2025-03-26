import mongoose, {Document, Types} from "mongoose";
import bcrypt from "bcryptjs";


export interface User extends Document{
    _id: Types.ObjectId
    avatar: string | null
    name: string;
    email: string;
    password?: string;
    refreshToken?: string;
    role: "ADMIN"| "USER" | "VENDOR"
    createdAt: Date;
    updatedAt: Date;
    isValidate: (password: string) => Promise<boolean>
    verifyToken?: string;
    verified: boolean;
    forgottenToken: string;
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
    verified: {
        type: Boolean,
        default: false,
    },
    forgottenToken: String,
}, {timestamps: true});

UserSchema.pre<User>("save", async function (next) {
    if(!this.password || !this.isModified("password")) return next()
    try {
        this.password = await bcrypt.hash(this?.password, 10);
        next()
    }catch (err: any) {
       next(err)
    }
})

UserSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate() as Partial<User>

    if(update?.password) {
        update.password =  await bcrypt.hash(update.password, 10);
        this.setUpdate(update)
    }
    next()
})

UserSchema.methods.isValidate = async function (password: string) : Promise<boolean> {

    return await bcrypt.compare(password, this.password)
}

const UserModel = mongoose.model("User", UserSchema);

export default UserModel