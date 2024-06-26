import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
export const newProduct = TryCatch(
// Request is a generic type, so we need to pass in the types for the body , params and query
//  out of the these 3, here we have taken only the body
async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Please upload a photo", 400));
    if (!name || !price || !stock || !category) {
        // Delete the photo if the fields are not filled
        // because due to multer it got stored locally on the hardisk
        // and we don't want to keep it if the fields are not filled
        // this is an os module function
        // it takes the path of the file and a callback function
        rm(photo.path, () => {
            console.log("Photo deleted");
        });
        return next(new ErrorHandler("Please fill in all fields", 400));
    }
    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo.path,
    });
    return res.status(201).json({
        success: true,
        message: "Product created successfully",
    });
});
