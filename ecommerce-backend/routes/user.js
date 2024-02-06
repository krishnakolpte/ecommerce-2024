/** @format */

import express from "express";
import {
    deleteUser,
    getAllUsers,
    getUser,
    newUser,
} from "../controllers/user.js";
import { AdminOnly } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", newUser);
router.get("/all", AdminOnly, getAllUsers);
router.route("/:id").get(getUser).delete(AdminOnly, deleteUser);

export default router;
