import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
// middleware to make sure only admin is allowed to access certain routes
export const adminOnly = TryCatch(async (req, res, next) => {
    console.log("reached here");
    const { id } = req.query;
    if (!id)
        return next(new ErrorHandler("Please provide the id", 401));
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("User not found", 404));
    if (user.role !== "admin")
        return next(new ErrorHandler("Admin access only", 401));
    next();
});
