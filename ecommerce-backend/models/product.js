/** @format */

import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter Product Name"],
        },
        photo: {
            public_id: {
                type: String,
                required: [true, "Please Enter Product Photo"],
            },
            url: {
                type: String,
                required: [true, "Please Enter Product Photo"],
            },
        },

        price: {
            type: Number,
            required: [true, "Please Enter product Price"],
            default: 0,
        },
        stock: {
            type: Number,
            required: [true, "Please Enter product Stock"],
            default: 1,
        },
        category: {
            type: String,
            required: [true, "Please Enter Product category"],
        },
    },
    {
        timestamps: true,
    }
);

export const Product = mongoose.model("Product", productSchema);
