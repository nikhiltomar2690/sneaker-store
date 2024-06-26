import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { newProduct } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
// POST /api/v1/product/new
// singleUpload is a middleware that uploads a single file locally
app.post("/new", adminOnly, singleUpload, newProduct);
// video time 2:13:00
export default app;
