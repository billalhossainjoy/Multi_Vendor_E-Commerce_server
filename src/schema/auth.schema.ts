import { z } from 'zod';

export const FileValidate = (size : number) =>  z.custom<File | null>((file) =>  {
    if(file && (file.mimetype as string)) {
        console.log("test")
        const isValidType: boolean = file.mimetype &&  file.mimetype.startsWith('image/')
        const validSize =  file.size <= size * 1024 * 1024;
        return  validSize && isValidType
    }
    return true
}, {message: `File size must be less than ${size}MB`}).nullable()

export const SignUpSchema = z.object({
    avatar: FileValidate(5),
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export const LoginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export type TSignupSchema = z.infer<typeof SignUpSchema>
export type TLoginSchema = z.infer<typeof LoginSchema>