import mongoose from "mongoose";
import { Product } from "../models/product.js";
import { myCache } from "../app.js";
// file to connect with db
export const connectDB = async (uri) => {
    mongoose
        .connect(uri, {
        dbName: "Sneaker-Store",
    })
        .then((c) => console.log(`DB connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
export const invalidatesCache = async ({ product, order, admin, }) => {
    if (product) {
        const productKeys = [
            "latest-products",
            "all-products",
            "categories",
        ];
        // one more is there i.e removal of ids from cache from singleproduct function
        // we have to clear all existing ids from cache
        // so we fetch only that field from the mongodb usign select function
        const products = await Product.find({}).select("_id");
        products.forEach((product) => {
            productKeys.push(`product-${product._id}`);
        });
        myCache.del(productKeys);
    }
    if (order) {
    }
    if (admin) {
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product) {
            throw new Error("Product not found");
        }
        else {
            product.stock -= order.quantity;
            await product.save();
        }
    }
};
