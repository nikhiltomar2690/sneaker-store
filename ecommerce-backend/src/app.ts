import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv"; // importing the config function from dotenv
import morgan from "morgan"; // importing morgan for logging

// importing routes
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/products.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";

config({
  path: "./.env",
}); // calling the config function to read the .env file
console.log(process.env.port);

const port = process.env.port || 3000;

const mongoURI = process.env.MONGO_URI || "";

connectDB(mongoURI);
// will be used for caching the data
// here we are using the node-cache package
// it is a simple in-memory caching module for node.js
// we can also use redis
export const myCache = new NodeCache();

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("API working with /api/v1");
});
// using routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

// since we are storing the images locally, we need to serve them statically
// earlier they were being treated as api routes
app.use("/uploads", express.static("uploads"));
// basically it is placed below the other routes/middlewares so that it can be used after them
// they are all placed inside a stack so when any route/middleware throws an error, it moves
//  down to the errorMiddleware
// and the error is handled there, but if it is above the other routes/middlewares,
//  it will print the error in Express's default format i.e HTML format

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
