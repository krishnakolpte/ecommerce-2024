/** @format */

import express from "express";
import { config } from "dotenv";
import { connectDatabase } from "./config/database.js";
import NodeCache from "node-cache";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors";
import cloudinary from "cloudinary";

//configuration
const app = express();

config({
    path: "./config/config.env",
});

cloudinary.v2.config({
    cloud_name: process.env.CLOUDE_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRATE,
});

const stripeKey = process.env.STRIPE_SECRATE_KEY || "";

connectDatabase();
export const nodeCache = new NodeCache();
export const stripe = new Stripe(stripeKey);

//middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        // methods: [""],
    })
);

//routes
app.get("/", (req, res) => {
    res.send("server is working.");
});

import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payments.js";
import statsRoutes from "./routes/stats.js";
import { errorMiddleware } from "./middlewares/error.js";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/stats", statsRoutes);

app.use(errorMiddleware);

//server listening
app.listen(process.env.PORT, () => {
    console.log(
        `Server is working on PORT : http://localhost:${process.env.PORT}`
    );
});
