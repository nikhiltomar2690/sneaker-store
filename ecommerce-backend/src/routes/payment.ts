import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { newCoupon } from "../controllers/payment.js";

const app = express.Router();

// route - /api/v1/payment/new
// // usecase of this route: to create a new coupon
app.post("/coupon/new", newCoupon);

export default app;
