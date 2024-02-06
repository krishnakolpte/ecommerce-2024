/** @format */

import ErrorHandler from "../utils/utility-class.js";

export const errorMiddleware = (err, req, res, next) => {
    err.message ||= "Internal Server Error";
    err.statuscode ||= 500;

    if (err.name === "CastError") err.message = "Invalid Id";

    if (err.code === 11000) {
        const message = `Resourse not found. Duplicate Key`;
        err = new ErrorHandler(message, 400);
    }

    return res.status(err.statuscode).json({
        success: false,
        message: err.message,
    });
};

export const TryCatch = (passedFunction) => (req, res, next) => {
    Promise.resolve(passedFunction(req, res, next)).catch(next);
};
