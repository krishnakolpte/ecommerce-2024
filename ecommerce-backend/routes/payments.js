/** @format */

import express from "express";
import {
    applyDiscount,
    createPaymentIntent,
    deleteCoupon,
    getAllCoupons,
    newCoupon,
} from "../controllers/payments.js";
import { AdminOnly } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", createPaymentIntent);

router.get("/discount", applyDiscount);
router.post("/coupon/new", AdminOnly, newCoupon);
router.get("/coupon/all", AdminOnly, getAllCoupons);
router.delete("/coupon/:id", AdminOnly, deleteCoupon);

export default router;
