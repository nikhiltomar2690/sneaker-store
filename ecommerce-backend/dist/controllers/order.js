import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { invalidatesCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";
export const newOrder = TryCatch(
// the other two empty braces are for params and query
async (req, res, next) => {
    // why did I use NewOrderRequestBody here?
    // because I wanted to enforce the type of the request body
    const { shippingInfo, orderItems, user, subTotal, tax, shippingCharges, discount, total, } = req.body;
    if (!shippingInfo || !orderItems || !user || !subTotal || !tax || !total) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }
    await Order.create({
        shippingInfo,
        orderItems,
        user,
        subTotal,
        tax,
        shippingCharges,
        discount,
        total,
    });
    await reduceStock(orderItems);
    // passed as true because now new changes have been made to the products as their stock has been reduced
    // so we have to invalidate the cache
    await invalidatesCache({ product: true, order: true, admin: true });
    return res.status(201).json({
        success: true,
        message: "Order Placed Successfully",
    });
});
export const myOrders = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    const key = `my-orders-${id}`;
    let orders = [];
    if (myCache.has(key)) {
        orders = JSON.parse(myCache.get(key));
    }
    else {
        orders = await Order.find({ user: id });
        myCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
    });
});
export const allOrders = TryCatch(async (req, res, next) => {
    const key = `all-orders`;
    let orders = [];
    if (myCache.has(key)) {
        orders = JSON.parse(myCache.get(key));
    }
    else {
        orders = await Order.find().populate("user", "name");
        myCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
    });
});
export const getSingleOrder = TryCatch(async (req, res, next) => {
    const key = `all-orders`;
    let orders = [];
    if (myCache.has(key)) {
        orders = JSON.parse(myCache.get(key));
    }
    else {
        orders = await Order.find().populate("user", "name");
        myCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
    });
});
