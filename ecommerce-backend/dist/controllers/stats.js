import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";
export const getDashboardStats = TryCatch(async (req, res, next) => {
    let stats;
    if (myCache.has("admin-stats")) {
        stats = JSON.parse(myCache.get("admin-stats"));
    }
    else {
        const today = new Date();
        // created month based object to make the code clean and highly readable
        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today,
        };
        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            // to get the last date of the prev month
            // suppose current month is November , so I go to NoVEMBER 0th day which is October last day
            end: new Date(today.getFullYear(), today.getMonth(), 0),
        };
        // get all products created this month
        const thisMonthProductsPromise = Product.find({
            createdAt: {
                gte: thisMonth.start,
                lte: thisMonth.end,
            },
        });
        // get all products created last month\
        // could have used await syntax here but I want to run all queries in parallel
        // which doesnt happen here, so I will convert them to promise and run them in parallel
        // using Promise.all
        const lastMonthProductsPromise = Product.find({
            createdAt: {
                gte: lastMonth.start,
                lte: lastMonth.end,
            },
        });
        // get all users created this month
        const thisMonthUsersPromise = User.find({
            createdAt: {
                gte: thisMonth.start,
                lte: thisMonth.end,
            },
        });
        // get all users created last month
        const lastMonthUsersPromise = User.find({
            createdAt: {
                gte: lastMonth.start,
                lte: lastMonth.end,
            },
        });
        // get all orders created this month
        const thisMonthOrdersPromise = Order.find({
            createdAt: {
                gte: thisMonth.start,
                lte: thisMonth.end,
            },
        });
        // get all orders created last month
        const lastMonthOrdersPromise = Order.find({
            createdAt: {
                gte: lastMonth.start,
                lte: lastMonth.end,
            },
        });
        // here we are running all the queries in parallel
        // this is an optimisation technique to reduce the time taken to run all queries
        // we take corresponding values for each property from the promises
        const [thisMonthOrders, thisMonthProducts, thisMonthUsers, lastMonthOrders, lastMonthProducts, lastMonthUsers,] = await Promise.all([
            thisMonthOrdersPromise,
            thisMonthProductsPromise,
            thisMonthUsersPromise,
            lastMonthOrdersPromise,
            lastMonthProductsPromise,
            lastMonthUsersPromise,
        ]);
        const userChangePercent = calculatePercentage(thisMonthUsers.length, lastMonthUsers.length);
        const productChangePercent = calculatePercentage(thisMonthProducts.length, lastMonthProducts.length);
        const orderChangePercent = calculatePercentage(thisMonthOrders.length, lastMonthOrders.length);
    }
    return res.status(200).json({
        success: true,
        stats,
    });
});
export const getPieCharts = TryCatch(async (req, res, next) => { });
export const getBarCharts = TryCatch(async (req, res, next) => { });
export const getLineCharts = TryCatch(async (req, res, next) => { });
