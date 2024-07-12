import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { applyDiscount, deleteCoupon, getAllCoupons, newCoupon, } from "../controllers/payment.js";
const app = express.Router();
// route - /api/v1/payment/coupon/new
// // usecase of this route: to create a new coupon
app.post("/coupon/new", adminOnly, newCoupon);
// route : /api/v1/payment/discount/
// usecase: to apply discount code if valid
app.get("/discount ", applyDiscount);
// route: /api/v1/payment/coupon/all
// usecase : allow admin to see all coupons
app.get("/coupon/all", adminOnly, getAllCoupons);
// route: /api/v1/payment/coupon/:id
// usecase: admin can delete a coupon
app.delete("/coupon/:id", adminOnly, deleteCoupon);
export default app;
