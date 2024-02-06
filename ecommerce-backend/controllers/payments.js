/** @format */

import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";

export const createPaymentIntent = TryCatch(async (req, res, next) => {
    const { amount, name, address, pincode, city, state, country } = req.body;

    if (!amount) return next(new ErrorHandler("Please enter Amount", 400));

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        description: "Software development services",
        shipping: {
            name: name,
            address: {
                line1: address,
                postal_code: pincode,
                city: city,
                state: state,
                country: country,
            },
        },

        currency: "inr",
        // payment_method_types: ["card"],
    });

    return res.status(201).json({
        success: true,
        clientSecrate: paymentIntent.client_secret,
    });
});
export const newCoupon = TryCatch(async (req, res, next) => {
    const { amount, couponcode } = req.body;

    if (!couponcode || !amount)
        return next(new ErrorHandler("Please enter Coupon And Amount", 400));

    const coupon = await Coupon.create({
        couponcode,
        amount,
    });

    return res.status(201).json({
        success: true,
        message: `Coupon ${coupon.couponcode} created successfully.`,
    });
});

export const applyDiscount = TryCatch(async (req, res, next) => {
    const { couponcode } = req.query;

    if (!couponcode)
        return next(new ErrorHandler("Do you Have Any Coupon Code", 400));

    const discount = await Coupon.findOne({ couponcode });

    if (!discount) return next(new ErrorHandler("Invalid Coupon Code", 400));

    return res.status(201).json({
        success: true,
        discount: discount.amount,
    });
});

export const getAllCoupons = TryCatch(async (req, res, next) => {
    const coupons = await Coupon.find({});

    return res.status(201).json({
        success: true,
        coupons,
    });
});

export const deleteCoupon = TryCatch(async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) return next(new ErrorHandler("Coupon not found", 400));

    await coupon.deleteOne();

    return res.status(201).json({
        success: true,
        message: `Coupon ${coupon.couponcode}  is Deleted succsessfully`,
    });
});
