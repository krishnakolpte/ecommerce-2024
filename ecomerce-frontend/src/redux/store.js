/** @format */

import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./api/productAPI";
import { userApi } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";
import { cartReducer } from "./reducer/cartReducer";
import { orderApi } from "./api/orderAPI";
import { dashboardApi } from "./api/dashboardAPI";
import { paymentApi } from "./api/paymentAPI";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
        [userReducer.name]: userReducer.reducer,
        [cartReducer.name]: cartReducer.reducer,
    },
    middleware: (mid) => [
        ...mid(),
        userApi.middleware,
        productApi.middleware,
        orderApi.middleware,
        dashboardApi.middleware,
        paymentApi.middleware,
    ],
});
