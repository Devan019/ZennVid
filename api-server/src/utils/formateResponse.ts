import { Response } from "express";

export const formatResponse = <T>(
    res: Response,
    statusCode: number,
    message: string,
    success: boolean,
    data?: T,
    error?: string
) => {
    return res.status(statusCode).json({
        MESSAGE: message,
        SUCCESS: success,
        ERROR: error ?? null,
        DATA: data ?? null
    });
};