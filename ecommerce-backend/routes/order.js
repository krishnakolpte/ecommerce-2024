/** @format */

import express from "express";

import { AdminOnly } from "../middlewares/auth.js";
import {
    adminAllOrders,
    deleteOrder,
    getSingleOrder,
    myOrders,
    newOrder,
    processOrder,
} from "../controllers/order.js";

const router = express.Router();

router.post("/new", newOrder);
router.get("/myorders", myOrders);
router.get("/all", AdminOnly, adminAllOrders);

router
    .route("/:id")
    .get(getSingleOrder)
    .put(AdminOnly, processOrder)
    .delete(AdminOnly, deleteOrder);

export default router;
