import express from "express";
import { newProduct } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
// POST /api/v1/product/new
// singleUpload is a middleware that uploads a single file locally
app.post("/new", singleUpload, newProduct);
export default app;
