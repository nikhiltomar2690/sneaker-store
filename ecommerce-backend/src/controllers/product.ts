import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { faker } from "@faker-js/faker";
import { myCache } from "../app.js";
import { invalidatesCache } from "../utils/features.js";

//Revalidate on New,Update,Delete and New Order
// bcoz the data will be changed and the cache will be outdated but still its there in the cache
// so it will display the old data.
// to get the new data we need to revalidate the cache
export const getlatestProducts = TryCatch(async (req, res, next) => {
  let products = [];

  if (myCache.has("latest-products")) {
    // (as string) means we are typecasting it to a string
    // so if it comes undefined then it will be converted to a string
    products = JSON.parse(myCache.get("latest-products") as string);
  } else {
    // -1 means descending order
    // 1 means ascending order
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    // set the latest products in the cache
    // we are storing the products in the cache as a string
    // because we can only store strings in the cache
    myCache.set("latest-products", JSON.stringify(products));
  }
  return res.status(200).json({
    success: true,
    products,
  });
});

//Revalidate on New,Update,Delete and New Order
export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;
  if (myCache.has("categories")) {
    categories = JSON.parse(myCache.get("categories") as string);
  } else {
    categories = await Product.distinct("category");
    myCache.set("categories", JSON.stringify(categories));
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});
//Revalidate on New,Update,Delete and New Order
export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;
  if (myCache.has("all-products")) {
    products = JSON.parse(myCache.get("admin-products") as string);
  } else {
    products = await Product.find({});
    // key value pair in cache is stored as a string
    myCache.set("all-products", JSON.stringify(products));
  }
  return res.status(200).json({
    success: true,
    products,
  });
});
//Revalidate on New,Update,Delete and New Order
export const getSingleProduct = TryCatch(async (req, res, next) => {
  let product;
  const id = req.params.id;
  if (myCache.has(`product-${id}`)) {
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  } else {
    product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Product not Found", 404));
    myCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res.status(200).json({
    success: true,
    product,
  });
});

export const newProduct = TryCatch(
  // Request is a generic type, so we need to pass in the types for the body , params and query
  //  out of the these 3, here we have taken only the body
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please upload a photo", 400));

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

    // invalidates the cache
    // removes it from cache in simple language
    // because the cache is outdated now
    // passed true becoz there is (if check condition in the function)
    await invalidatesCache({ product: true });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  }
);

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  const photo = req.file;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Invalid Product ID", 404));

  if (photo) {
    rm(product.photo, () => {
      console.log("Old Photo deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  await product.save();

  // invalidates the cache
  // removes it from cache in simple language
  // because the cache is outdated now
  // passed true becoz there is (if check condition in the function)
  await invalidatesCache({ product: true });

  return res.status(200).json({
    success: true,
    message: "Product created successfully",
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not Found", 404));

  rm(product.photo, () => {
    console.log("Product Photo deleted");
  });

  await Product.deleteOne();
  // invalidates the cache
  // removes it from cache in simple language
  // because the cache is outdated now
  // passed true becoz there is (if check condition in the function)
  await invalidatesCache({ product: true });

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

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
    // time : 3:02:00
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
  }
);

// used faker library to generate random products
// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];
//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\bf59d9ca-d185-4fe6-94f2-0e6ecfcf7aeb.png",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 1, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };
//     products.push(product);
//   }
//   await Product.create(products);
//   console.log({ success: true });
// };
// generateRandomProducts(40);

// const deleteRandomProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);

//   for (let i = 0; i < products.length; i++) {
//     let product = products[i];
//     await product.deleteOne();
//   }
//   console.log({ success: true });
// };
// deleteRandomProducts(39);
