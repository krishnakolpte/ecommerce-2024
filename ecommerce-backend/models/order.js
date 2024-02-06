/** @format */

import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        shippingInfo: {
            address: {
                type: String,
                required: [true, "Please Enter address"],
            },
            city: {
                type: String,
                required: [true, "Please Enter city"],
            },
            state: {
                type: String,
                required: [true, "Please Enter state"],
            },
            country: {
                type: String,
                required: [true, "Please Enter Country"],
            },
            pincode: {
                type: Number,
                required: [true, "Please Enter pincode number"],
            },
        },

        user: {
            type: String,
            required: true,
            ref: "User",
        },

        subtotal: {
            type: Number,
            required: true,
        },

        tax: {
            type: Number,
            required: true,
        },

        shippingCharges: {
            type: Number,
            required: true,
        },

        discount: {
            type: Number,
            default: 0,
        },

        total: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ["processing", "shipped", "delivered"],
            default: "processing",
        },

        orderItems: [
            {
                name: String,
                photo: String,
                price: Number,
                quantity: Number,
                productId: {
                    type: mongoose.Types.ObjectId,
                    ref: "Product",
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Order = mongoose.model("Order", orderSchema);
