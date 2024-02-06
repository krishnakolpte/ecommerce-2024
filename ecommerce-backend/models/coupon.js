/** @format */

import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        couponcode: {
            type: String,
            unique: [true, "Coupon already exist"],
            required: [true, "Please Enter Coupon"],
        },

        amount: {
            type: Number,
            required: [true, "Please Enter The Discount Amount"],
        },
    },
    {
        timestamps: true,
    }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
