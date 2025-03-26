import {Response} from "express";

export class ErrorApi extends Error {
    public status : number;
    public message : string;
    public error : unknown;

    constructor(status: number, message: string, error?: unknown) {
        super(message);
        this.status = status;
        this.message = message;
        this.error = error;

        Object.setPrototypeOf(this, ErrorApi.prototype)
    }

    public static handler(res: Response, status: number, message: string, error?: unknown ) {
        res.status(status).json(
        {
            success: false,
            statusCode: status,
            message,
            error
        })
    }
}

