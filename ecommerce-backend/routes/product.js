/** @format */

import express from "express";
import {
    deleteSingleProduct,
    getAdminProducts,
    getAllCategories,
    getAllSearchProduct,
    getLatestProducts,
    getSingleProduct,
    newProduct,
    updateProduct,
} from "../controllers/product.js";
import { AdminOnly } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/new", AdminOnly, singleUpload, newProduct);
router.get("/latest", getLatestProducts);
router.get("/all", getAllSearchProduct);
router.get("/categories", getAllCategories);
router.get("/admin/products", AdminOnly, getAdminProducts);
router
    .route("/:id")
    .get(AdminOnly, getSingleProduct)
    .put(AdminOnly, singleUpload, updateProduct)
    .delete(AdminOnly, deleteSingleProduct);

export default router;
