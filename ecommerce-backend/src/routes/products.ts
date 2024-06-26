import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  deleteProduct,
  getAdminProducts,
  getAllCategories,
  getSingleProduct,
  getlatestProducts,
  newProduct,
  updateProduct,
} from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

// POST /api/v1/product/new
// singleUpload is a middleware that uploads a single file locally
app.post("/new", adminOnly, singleUpload, newProduct);
// video time
// GET /api/v1/product/latest for getting the latest 5 products
app.get("/latest", getlatestProducts);
// GET /api/v1/product/categories for getting all the categories
app.get("/categories", getAllCategories);
// GET /api/v1/product/admin-products for getting all the products for admin
app.get("/admin-products", adminOnly, getAdminProducts);

// to get a single product, update a product, and delete a product
app
  .route("/:id")
  .get(getSingleProduct)
  .put(adminOnly, singleUpload, updateProduct)
  .delete(adminOnly, deleteProduct);

export default app;
