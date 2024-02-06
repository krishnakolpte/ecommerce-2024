/** @format */

import { nodeCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import {
    calculatePercentage,
    getChartData,
    getInventories,
} from "../utils/feature.js";
import ErrorHandler from "../utils/utility-class.js";

export const stats = TryCatch(async (req, res, next) => {
    let stats;

    const key = "admin-stats";

    if (nodeCache.has(key)) {
        stats = JSON.parse(nodeCache.get(key));
    } else {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today,
        };

        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            end: new Date(today.getFullYear(), today.getMonth(), 0),
        };

        const thisMonthProducts = await Product.find({
            createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
        });

        const lastMonthProducts = await Product.find({
            createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
        });

        const thisMonthUsers = await User.find({
            createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
        });

        const lastMonthUsers = await User.find({
            createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
        });

        const thisMonthOrders = await Order.find({
            createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
        });

        const lastMonthOrders = await Order.find({
            createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
        });

        const lastSixMonthOrders = await Order.find({
            createdAt: { $gte: sixMonthsAgo, $lte: today },
        });

        const thisMonthRevenue = thisMonthOrders.reduce(
            (total, order) => total + (order.total || 0),
            0
        );
        const lastMonthRevenue = lastMonthOrders.reduce(
            (total, order) => total + (order.total || 0),
            0
        );

        const percents = {
            revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
            product: calculatePercentage(
                thisMonthProducts.length,
                lastMonthProducts.length
            ),
            user: calculatePercentage(
                thisMonthUsers.length,
                lastMonthUsers.length
            ),
            order: calculatePercentage(
                thisMonthOrders.length,
                lastMonthOrders.length
            ),
        };

        const productCount = await Product.countDocuments();
        const usersCount = await User.countDocuments();
        const allOrders = await Order.find({}).select("total");
        const allUniqueCategories = await Product.distinct("category");
        const femaleUsersCount = await User.countDocuments({
            gender: "female",
        });
        const latestTransactions = await Order.find({})
            .select(["orderItems", "discount", "total", "status"])
            .sort({ createdAt: -1 })
            .limit(5);

        const revenue = allOrders.reduce(
            (total, order) => total + (order.total || 0),
            0
        );

        const counts = {
            revenue,
            product: productCount,
            user: usersCount,
            order: allOrders.length,
        };

        const orderMonthCounts = getChartData({
            length: 6,
            docArr: lastSixMonthOrders,
            today,
        });

        const orderMonthlyRevenue = getChartData({
            length: 6,
            docArr: lastSixMonthOrders,
            today,
            property: "total",
        });

        const categoryCounts = await getInventories({
            categories: allUniqueCategories,
            productCount: productCount,
        });

        const genderRatio = {
            male: usersCount - femaleUsersCount,
            female: femaleUsersCount,
        };

        const modifiedTopTransactions = latestTransactions.map((i) => ({
            _id: i._id,
            discount: i.discount,
            amount: i.total,
            quantity: i.orderItems.length,
            status: i.status,
        }));

        stats = {
            percents,
            counts,
            chart: {
                order: orderMonthCounts,
                revenue: orderMonthlyRevenue,
            },
            categoryCounts,
            genderRatio,
            latestTopTransactions: modifiedTopTransactions,
        };

        nodeCache.set(key, JSON.stringify(stats));
    }

    return res.status(200).json({
        success: true,
        stats,
    });
});

export const getPieChart = TryCatch(async (req, res, next) => {
    let charts;

    const key = "admin-pie-chart";

    if (nodeCache.has(key)) {
        charts = JSON.parse(nodeCache.get(key));
    } else {
        const allOrdersPromise = Order.find({}).select([
            "total",
            "discount",
            "subtotal",
            "tax",
            "shippingCharges",
        ]);

        const [
            processingOrder,
            shippedOrder,
            deliveredOrder,
            allCategories,
            productCount,
            productsOutOfStock,
            allOrders,
            allUsers,
            adminUsers,
            customerUsers,
        ] = await Promise.all([
            Order.countDocuments({ status: "processing" }),
            Order.countDocuments({ status: "shipped" }),
            Order.countDocuments({ status: "delivered" }),
            Product.distinct("category"),
            Product.countDocuments(),
            Product.countDocuments({ stock: 0 }),
            allOrdersPromise,
            User.find({}).select(["dob"]),
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ role: "user" }),
        ]);

        const orderFullFillment = {
            processing: processingOrder,
            shipped: shippedOrder,
            delivered: deliveredOrder,
        };

        const categoryCounts = await getInventories({
            categories: allCategories,
            productCount: productCount,
        });

        const stockAvailability = {
            instock: productCount - productsOutOfStock,
            outOfStock: productsOutOfStock,
        };

        const grossIncome = allOrders.reduce(
            (prev, order) => prev + (order.total || 0),
            0
        );

        const discount = allOrders.reduce(
            (prev, order) => prev + (order.discount || 0),
            0
        );
        const productionCost = allOrders.reduce(
            (prev, order) => prev + (order.shippingCharges || 0),
            0
        );
        const burnt = allOrders.reduce(
            (prev, order) => prev + (order.tax || 0),
            0
        );
        const marketingCost = Math.round(grossIncome * (30 / 100));

        const netmargin =
            grossIncome - discount - productionCost - burnt - marketingCost;

        const revenueDistribution = {
            netmargin,
            discount,
            productionCost,
            burnt,
            marketingCost,
        };

        const adminAndUsersRatio = {
            admin: adminUsers,
            customers: customerUsers,
        };

        const usersAgeGroupRatio = {
            teen: allUsers.filter((i) => i.age < 20).length,
            adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
            old: allUsers.filter((i) => i.age >= 40).length,
        };

        charts = {
            orderFullFillment,
            productsCategories: categoryCounts,
            stockAvailability,
            revenueDistribution,
            usersAgeGroupRatio,
            adminAndUsersRatio,
        };

        nodeCache.set(key, JSON.stringify(charts));
    }

    return res.status(200).json({
        success: true,
        charts,
    });
});

export const getBarChart = TryCatch(async (req, res, next) => {
    let charts;

    const key = "admin-bar-chart";

    if (nodeCache.has(key)) {
        charts = JSON.parse(nodeCache.get(key));
    } else {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const lastSixMonthProductsPromise = Product.find({
            createdAt: { $gte: sixMonthsAgo, $lte: today },
        }).select("createdAt");

        const lastSixMonthUsersPromise = User.find({
            createdAt: { $gte: sixMonthsAgo, $lte: today },
        }).select("createdAt");

        const lastTwelveMonthOrdersPromise = Order.find({
            createdAt: { $gte: twelveMonthsAgo, $lte: today },
        }).select("createdAt");

        const [products, users, orders] = await Promise.all([
            lastSixMonthProductsPromise,
            lastSixMonthUsersPromise,
            lastTwelveMonthOrdersPromise,
        ]);

        const productCount = getChartData({
            length: 6,
            docArr: products,
            today,
        });
        const userCount = getChartData({
            length: 6,
            docArr: users,
            today,
        });
        const orderCount = getChartData({
            length: 12,
            docArr: orders,
            today,
        });

        charts = {
            products: productCount,
            users: userCount,
            orders: orderCount,
        };

        nodeCache.set(key, JSON.stringify(charts));
    }

    return res.status(200).json({
        success: true,
        charts,
    });
});

export const getLineChart = TryCatch(async (req, res, next) => {
    let charts;

    const key = "admin-line-chart";

    if (nodeCache.has(key)) {
        charts = JSON.parse(nodeCache.get(key));
    } else {
        const today = new Date();

        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const query = {
            createdAt: { $gte: twelveMonthsAgo, $lte: today },
        };

        const lastTwelveMonthProductsPromise =
            Product.find(query).select("createdAt");

        const lastTwelveMonthUsersPromise =
            User.find(query).select("createdAt");

        const lastTwelveMonthOrdersPromise = Order.find(query).select([
            "createdAt",
            "discount",
            "total",
        ]);

        const [products, users, orders] = await Promise.all([
            lastTwelveMonthProductsPromise,
            lastTwelveMonthUsersPromise,
            lastTwelveMonthOrdersPromise,
        ]);

        const productCount = getChartData({
            length: 12,
            docArr: products,
            today,
        });
        const userCount = getChartData({
            length: 12,
            docArr: users,
            today,
        });
        const orderCount = getChartData({
            length: 12,
            docArr: orders,
            today,
        });

        const discount = getChartData({
            length: 12,
            docArr: orders,
            today,
            property: "discount",
        });

        const revenue = getChartData({
            length: 12,
            docArr: orders,
            today,
            property: "total",
        });

        charts = {
            products: productCount,
            users: userCount,
            orders: orderCount,
            discount,
            revenue,
        };

        nodeCache.set(key, JSON.stringify(charts));
    }

    return res.status(200).json({
        success: true,
        charts,
    });
});
