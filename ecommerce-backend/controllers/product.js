/** @format */

import { nodeCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import { getFileDataUri } from "../utils/dataUri.js";
import { invalidateCache } from "../utils/feature.js";
import ErrorHandler from "../utils/utility-class.js";
import cloudinary from "cloudinary";

export const getLatestProducts = TryCatch(async (req, res, next) => {
    let products;

    if (nodeCache.has("latest-products")) {
        products = JSON.parse(nodeCache.get("latest-products"));
    } else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5);

        nodeCache.set("latest-products", JSON.stringify(products));
    }

    return res.status(200).json({
        success: true,
        products,
    });
});

export const getAllCategories = TryCatch(async (req, res, next) => {
    let categories;

    if (nodeCache.has("categories")) {
        categories = JSON.parse(nodeCache.get("categories"));
    } else {
        categories = await Product.distinct("category");
        nodeCache.set("categories", JSON.stringify(categories));
    }

    return res.status(200).json({
        success: true,
        categories,
    });
});

export const getAdminProducts = TryCatch(async (req, res, next) => {
    let products;

    if (nodeCache.has("admin-products")) {
        products = JSON.parse(nodeCache.get("admin-products"));
    } else {
        products = await Product.find({});
        nodeCache.set("admin-products", JSON.stringify(products));
    }

    return res.status(200).json({
        success: true,
        products,
    });
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
    let product;
    const id = req.params.id;

    if (nodeCache.has(`product-${id}`)) {
        product = JSON.parse(nodeCache.get(`product-${id}`));
    } else {
        product = await Product.findById(id);
        if (!product) return next(new ErrorHandler("Product not found", 404));
        nodeCache.set(`product-${id}`, JSON.stringify(product));
    }

    return res.status(200).json({
        success: true,
        product,
    });
});

export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if (!name || !price || !photo || !stock || !category) {
        return next(new ErrorHandler("Please Enter all Fields", 400));
    }

    const fileUri = getFileDataUri(photo);

    const mycloude = await cloudinary.v2.uploader.upload(fileUri.content, {
        folder: "ecommerce-2024",
    });

    await Product.create({
        name,
        photo: {
            public_id: mycloude.public_id,
            url: mycloude.secure_url,
        },
        price,
        stock,
        category: category.toLowerCase(),
    });

    invalidateCache({ product: true, admin: true });

    return res.status(201).json({
        success: true,
        message: "Product created successfully.",
    });
});

export const updateProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found,", 404));
    }

    if (photo) {
        await cloudinary.v2.uploader.destroy(product.photo.public_id);

        const fileUri = getFileDataUri(photo);

        const mycloude = await cloudinary.v2.uploader.upload(fileUri.content, {
            folder: "ecommerce-2024",
        });

        product.photo = {
            public_id: mycloude.public_id,
            url: mycloude.secure_url,
        };
    }

    if (name) product.name = name;
    if (stock) product.stock = stock;
    if (price) product.price = price;
    if (category) product.category = category;

    await product.save();

    invalidateCache({
        product: true,
        admin: true,
        productId: [String(product._id)],
    });

    return res.status(200).json({
        success: true,
        message: "Product updated successfully.",
    });
});

export const deleteSingleProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) return next(new ErrorHandler("Product not found", 404));

    await cloudinary.v2.uploader.destroy(product.photo.public_id);

    await product.deleteOne();

    invalidateCache({
        product: true,
        admin: true,
        productId: [String(product._id)],
    });

    return res.status(200).json({
        success: true,
        message: "Product Deleted successfully.",
    });
});

export const getAllSearchProduct = TryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;

    const limit = process.env.PRODUCTS_PER_PAGE || 8;
    const skip = limit * (page - 1);

    let queryObject = {};

    if (search) {
        queryObject.name = {
            $regex: search,
            $options: "i",
        };
    }

    if (price) {
        queryObject.price = {
            $lte: price,
        };
    }
    if (category) {
        queryObject.category = category;
    }

    const products = await Product.find(queryObject)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);

    const filteredProducts = await Product.find(queryObject);

    const totalPages = Math.ceil(filteredProducts.length / limit);

    return res.status(200).json({
        success: true,
        products,
        totalPages,
    });
});
