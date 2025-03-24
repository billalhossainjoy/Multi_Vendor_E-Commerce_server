import nodeMailer from "nodemailer";
import {SMTP_CLIENT_ID, SMTP_CLIENT_SECRET, SMTP_REFRESH_TOKEN, SMTP_SERVICE} from "../../config/env.config";
import {Options} from "nodemailer/lib/mailer";

export interface EmailOptions {
    from: string;
    email: string;
    subject: string;
    text?: string;
    html?: string;
}

class NodeMailer {
    transporter

    constructor(private mailOptions: Options) {
        this.transporter = nodeMailer.createTransport({
            service: SMTP_SERVICE,
            secure: false,
            pool: true,
            auth: {
                type: "OAuth2",
                user: "billalhossain.cuse@gmail.com",
                clientId: SMTP_CLIENT_ID,
                clientSecret: SMTP_CLIENT_SECRET,
                refreshToken: SMTP_REFRESH_TOKEN
            },
        })
    }

    sendMail()  {
        console.log("Sending mail...")
        this.transporter.sendMail(this.mailOptions, (err, info) => {
            if (err) {
                console.log(err)
            }
        })
    }
}

export default NodeMailer;