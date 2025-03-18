import {Request, Response, NextFunction} from "express";

const AsyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => void) => {
    return function (req: Request, res: Response, next: NextFunction) {
        Promise.resolve(fn(req,res,next)).catch(err => next(err))
    }
}

export default AsyncHandler