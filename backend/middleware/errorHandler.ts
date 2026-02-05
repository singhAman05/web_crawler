import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";

export const errorHandler = (err: Error,req: Request,res: Response,_next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.status).json({
        error: err.code,
        message: err.message
        });
    }

    console.error("Unhandled error:", err);

    return res.status(500).json({
        error: "INTERNAL_ERROR",
        message: "Internal server error"
    });
}
