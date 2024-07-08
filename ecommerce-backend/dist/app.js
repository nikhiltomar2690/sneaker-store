import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
// importing routes
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/products.js";
const port = 3000;
connectDB();
// will be used for caching the data
// here we are using the node-cache package
// it is a simple in-memory caching module for node.js
// we can also use redis
export const myCache = new NodeCache();
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("API working with /api/v1");
});
// using routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
// since we are storing the images locally, we need to serve them statically
// earlier they were being treated as api routes
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
