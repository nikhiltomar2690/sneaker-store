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
export const getlatestProducts = TryCatch(async (req, res, next) => {
    // -1 means descending order
    // 1 means ascending order
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    return res.status(200).json({
        success: true,
        products,
    });
});
export const getAllCategories = TryCatch(async (req, res, next) => {
    const categories = await Product.distinct("category");
    return res.status(200).json({
        success: true,
        categories,
    });
});
export const getAdminProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({});
    return res.status(200).json({
        success: true,
        products,
    });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Product not Found", 404));
    return res.status(200).json({
        success: true,
        product,
    });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Invalid Product ID", 404));
    if (photo) {
        rm(product.photo, () => {
            console.log("Old Photo deleted");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    return res.status(200).json({
        success: true,
        message: "Product created successfully",
    });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product not Found", 404));
    rm(product.photo, () => {
        console.log("Product Photo deleted");
    });
    await Product.deleteOne();
    return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});
export const getAllProducts = TryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    if (search) {
        baseQuery.name = {
            // $regex is a mongodb operator
            // used for searching in the database with a regular expression
            // what is a regular expression?
            // it is a sequence of characters that define a search pattern
            $regex: search,
            // options make the search case insensitive
            $options: "i",
        };
    }
    if (price) {
        baseQuery.price = {
            $lte: Number(price),
        };
    }
    if (category) {
        baseQuery.category = category;
    }
    // find all the products that match the baseQuery
    // sort them by price in ascending or descending order
    // code works this way : if sort is not present, it will return all the products
    // if sort is present, it will sort the products by price in ascending or descending order
    const productsPromise = Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);
    // here we are using promise all to get the products and the filtered products
    // why we used Promise.all?
    // because we want to get the total number of products that match the baseQuery
    // and we also want to get the products that match the baseQuery
    // if we use await, then we will have to wait for the first query to complete
    // and then we can run the second query
    // but we don't want to wait for the first query to complete
    // we want to run both the queries in parallel
    const [products, filteredOnlyProduct] = await Promise.all([
        productsPromise,
        Product.find(baseQuery),
    ]);
    const TotalPage = Math.ceil(filteredOnlyProduct.length / limit);
    return res.status(200).json({
        success: true,
        products,
        TotalPage,
    });
});
