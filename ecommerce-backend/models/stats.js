/** @format */

import mongoose from "mongoose";

const statsSchema = new mongoose.Schema(
    {
        couponcode: {
            type: String,
            unique: [true, "Email already exist"],
            required: [true, "Please Enter Email"],
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

export const Stats = mongoose.model("Stats", statsSchema);
