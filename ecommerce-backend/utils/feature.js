/** @format */

import { nodeCache } from "../app.js";
import { Product } from "../models/product.js";

export const invalidateCache = ({
    product,
    order,
    admin,
    userId,
    orderId,
    productId,
}) => {
    if (product) {
        const productKeys = ["latest-products", "categories", "admin-products"];

        if (typeof productId === "string")
            productKeys.push(`product-${productId}`);

        if (typeof productId === "object") {
            productId.forEach((i) => {
                productKeys.push(`product-${i}`);
            });
        }

        nodeCache.del(productKeys);
    }
    if (order) {
        const orderKeys = [
            `my-orders-${userId}`,
            "admin-all-orders",
            `order-${orderId}`,
        ];

        nodeCache.del(orderKeys);
    }

    if (admin) {
        const adminKeys = [
            "admin-stats",
            "admin-pie-chart",
            "admin-bar-chart",
            "admin-line-chart",
        ];

        nodeCache.del(adminKeys);
    }
};

export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);

        if (!product) throw new Error("Product not found");

        if (product.stock <= 0) {
            throw new Error("Product stock not available");
        }
        product.stock -= order.quantity;

        await product.save();
    }
};

export const calculatePercentage = (thisMonth, lastMonth) => {
    if (thisMonth === 0) return thisMonth * 100;
    const percentage = (thisMonth / lastMonth) * 100;
    return Number(percentage.toFixed(0));
};

export const getInventories = async ({ categories, productCount }) => {
    let categoriesCountPromis = categories.map(async (category) => {
        const count = await Product.countDocuments({ category });
        return count;
    });

    const categoriesCount = await Promise.all(categoriesCountPromis);

    const categoryCounts = [];

    categories.forEach((category, i) => {
        categoryCounts.push({
            [category]: Math.round((categoriesCount[i] / productCount) * 100),
        });
    });

    return categoryCounts;
};

export const getChartData = ({ length, docArr, today, property }) => {
    const data = new Array(length).fill(0);

    docArr.forEach((order) => {
        const createdDate = order.createdAt;
        const monthDiff = (today.getMonth() - createdDate.getMonth() + 12) % 12;

        if (monthDiff < length) {
            if (property) {
                data[length - monthDiff - 1] += order[property];
            } else {
                data[length - monthDiff - 1] += 1;
            }
        }
    });

    return data;
};
