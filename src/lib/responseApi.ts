import {Response} from "express";


export const ResponseApi =<T = any> (res: Response, status: number, message: string, data?: T) => {
    res.status(status).json(
        {
            success: true,
            message: message,
            data: data
        }
    );
}