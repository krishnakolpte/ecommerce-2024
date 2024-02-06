/** @format */

import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

export const AdminOnly = TryCatch(async (req, res, next) => {
    const id = req.query.id;

    if (!id) return next(new ErrorHandler("Please Login First", 401));

    const user = await User.findById(id);

    if (!user)
        return next(new ErrorHandler("Invalid Id,Please login first", 401));

    if (user.role !== "admin")
        return next(
            new ErrorHandler("The role user cannot access this resource", 403)
        );

    next();
});
