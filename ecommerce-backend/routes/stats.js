/** @format */

import express from "express";
import { AdminOnly } from "../middlewares/auth.js";
import {
    getBarChart,
    getLineChart,
    getPieChart,
    stats,
} from "../controllers/stats.js";

const router = express.Router();

router.get("/stats", AdminOnly, stats);
router.get("/pie", AdminOnly, getPieChart);
router.get("/bar", AdminOnly, getBarChart);
router.get("/line", AdminOnly, getLineChart);

export default router;
