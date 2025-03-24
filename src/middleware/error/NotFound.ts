import {StatusCodes} from "http-status-codes"
import {NextFunction, Request, Response} from "express";
import {ErrorApi} from "./ErrorApi";


const NotFoundHandler = (req:Request, res: Response, next: NextFunction) => {
    next(new ErrorApi(StatusCodes.NOT_FOUND, "This page not found"))
}

export default NotFoundHandler