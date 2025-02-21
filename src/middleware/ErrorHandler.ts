import {NextFunction, Request, response, Response} from "express";
import {ErrorApi} from "../utils/ErrorApi";

type TDefaultError = {
    success: boolean
    statusCode: number;
    message: string;
    error?: unknown;
    stack?: string;
}


const ErrorHandler = (err: unknown, req:Request, res: Response, next:NextFunction) => {

    let defaultError : TDefaultError = {
        success: false,
        statusCode: 500,
        message: "Unexpected error.",
    }

    if(err instanceof ErrorApi) {
        return ErrorApi.handler(res, err.status, err.message, err.error)
    }

    res.status(defaultError.statusCode).json(response)
}

export default  ErrorHandler