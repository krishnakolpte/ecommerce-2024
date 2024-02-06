/** @format */

import mongoose from "mongoose";

export const connectDatabase = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "Ecommerce-2024",
        });

        console.log(`Mongodb server working On ${db.connection.host}`);
    } catch (e) {
        console.log(e);
    }
};
