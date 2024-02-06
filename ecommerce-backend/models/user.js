/** @format */

import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: [true, "Please Enter Id"],
        },
        photo: {
            type: String,
            required: [true, "Please Enter Photo"],
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        name: {
            type: String,
            required: [true, "Please Enter Name"],
        },
        gender: {
            type: String,
            enum: ["male", "female"],
            required: [true, "Please Enter Gender"],
        },
        dob: {
            type: Date,
            required: [true, "Please Enter Date of Birth"],
        },
        email: {
            type: String,
            unique: [true, "Email already exist"],
            required: [true, "Please Enter Email"],
            validate: [validator.isEmail, "Please Enter Valid Email"],
        },
    },
    {
        timestamps: true,
    }
);

userSchema.virtual("age").get(function () {
    const dob = this.dob;
    const tooday = new Date();
    let age = tooday.getFullYear() - dob.getFullYear();

    if (
        tooday.getMonth() < dob.getMonth() ||
        (tooday.getMonth() === dob.getMonth() &&
            tooday.getDate() < dob.getDate())
    )
        age--;

    return age;
});

export const User = mongoose.model("User", userSchema);
