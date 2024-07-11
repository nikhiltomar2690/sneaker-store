import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  allOrders,
  deleteOrder,
  getSingleOrder,
  myOrders,
  newOrder,
  processOrder,
} from "../controllers/order.js";

const app = express.Router();
// route: /api/v1/order/new
// description: create a new order
app.post("/new", newOrder);

// route: /api/v1/order/my
// purpose: get all orders of a user
app.get("/my", myOrders);

// route: /api/v1/order/all
// purpose: get all orders of all users
app.get("/all", adminOnly, allOrders);

app
  .route("/:id")
  .get(getSingleOrder)
  .put(adminOnly, processOrder)
  .delete(adminOnly, deleteOrder);

export default app;
