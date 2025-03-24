import {EmailOptions} from "../nodeMailer";
import path from "node:path";
import * as fs from "node:fs";
import {Options} from "nodemailer/lib/mailer";
import appConfig from "../../../config/app.config";


export const verificationEmail= (email: string,token: string): Options => {
    const htmlPath = path.join(__dirname, "email.html");
    let htmlContent = fs.readFileSync(htmlPath, "utf-8") ?? ""
    htmlContent = htmlContent.replace("{{verificationLink}}", `${appConfig.CLIENT_URL+"/auth/verify/" + token}`);

    return {
        from: "billalhossain.cuse@gmail.com",
        to: email,
        subject: "Activate account",
        html: htmlContent,
    }
}