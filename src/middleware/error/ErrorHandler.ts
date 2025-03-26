import {NextFunction, Request, response, Response} from "express";
import {ErrorApi} from "./ErrorApi";
import {ZodError} from "zod";
import {StatusCodes} from "http-status-codes";

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
        error: err
    }

    if(err instanceof ErrorApi) {
        return ErrorApi.handler(res, err.status, err.message, err.error)
    }
    if(err instanceof ZodError) {
        return ErrorApi.handler(res, StatusCodes.BAD_REQUEST, err.message, err)
    }

    res.status(defaultError.statusCode).json(defaultError)
}

export default  ErrorHandler