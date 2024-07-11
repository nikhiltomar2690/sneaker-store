import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";

export const newCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;
  if (!coupon || !amount) {
    return next(
      new ErrorHandler("Please enter the coupon code and discount amount", 400)
    );
  }
  await Coupon.create({ code: coupon, amount });
  return res.status(201).json({
    success: true,
    message: "Coupon created Successfully",
  });
});
