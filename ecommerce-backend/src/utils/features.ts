import mongoose from "mongoose";
import { invalidatesCacheProps } from "../types/types.js";
import { Product } from "../models/product.js";
import { myCache } from "../app.js";

// file to connect with db
export const connectDB = async () => {
  mongoose
    .connect(
      "mongodb+srv://freakyhell6:X9gQuQxMZVPX2X4L@cluster0.0dbd9ma.mongodb.net/",
      {
        dbName: "Sneaker-Store",
      }
    )
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export const invalidatesCache = async ({
  product,
  order,
  admin,
}: invalidatesCacheProps) => {
  if (product) {
    const productKeys: string[] = [
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
