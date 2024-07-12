import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";
export const getDashboardStats = TryCatch(async (req, res, next) => {
    let stats = {};
    if (myCache.has("admin-stats")) {
        stats = JSON.parse(myCache.get("admin-stats"));
    }
    else {
        const today = new Date();
        // for the chart of revenue & transactions of the last 6 months
        // we use setMonth method to get the date of 6 months ago
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);
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
        // here we are getting all orders of last 6 months
        const lastSixMonthOrdersPromise = Order.find({
            createdAt: {
                gte: sixMonthsAgo,
                lte: today,
            },
        });
        // here we are running all the queries in parallel
        // this is an optimisation technique to reduce the time taken to run all queries
        // we take corresponding values for each property from the promises
        const [thisMonthOrders, thisMonthProducts, thisMonthUsers, lastMonthOrders, lastMonthProducts, lastMonthUsers, productsCount, usersCount, allOrders, lastSixMonthOrders,] = await Promise.all([
            thisMonthOrdersPromise,
            thisMonthProductsPromise,
            thisMonthUsersPromise,
            lastMonthOrdersPromise,
            lastMonthProductsPromise,
            lastMonthUsersPromise,
            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total"),
            lastSixMonthOrdersPromise,
        ]);
        // reduce function to get the total revenue of this month
        // how reduce works? It takes an initial value and a callback function
        // the callback function takes two arguments, the first argument is the total value,second is the current value
        // The reduce method continues to iterate over each element in the array, each time calling the
        // callback function with the updated total and the next order in the array.
        const thisMonthRevenue = thisMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
        const lastMonthRevenue = lastMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
        const changePercent = {
            revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
            product: calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
            user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
            order: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length),
        };
        const revenue = allOrders.reduce((total, order) => total + (order.total || 0), 0);
        const count = {
            user: usersCount,
            product: productsCount,
            order: allOrders.length,
            revenue,
        };
        const orderMonthCounts = new Array(6).fill(0);
        const orderMonthlyRevenue = new Array(6).fill(0);
        lastSixMonthOrders.forEach((order) => {
            const creationDate = order.createdAt;
            const monthDiff = today.getMonth() - creationDate.getMonth();
            if (monthDiff < 6) {
                orderMonthCounts[5 - monthDiff] += 1;
                orderMonthlyRevenue[5 - monthDiff] += order.total;
            }
        });
        // time : 6:04:00
        stats = {
            changePercent,
            count,
            chart: { order: orderMonthCounts, revenue: orderMonthlyRevenue },
        };
    }
    return res.status(200).json({
        success: true,
        stats,
    });
});
export const getPieCharts = TryCatch(async (req, res, next) => { });
export const getBarCharts = TryCatch(async (req, res, next) => { });
export const getLineCharts = TryCatch(async (req, res, next) => { });
