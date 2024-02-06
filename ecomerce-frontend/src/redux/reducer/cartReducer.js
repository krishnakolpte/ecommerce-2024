/** @format */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    cartItems: [],
    shippingInfo: "",
    subtotal: 0,
    tax: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
};

export const cartReducer = createSlice({
    name: "cartReducer",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.loading = true;

            const index = state.cartItems.findIndex(
                (i) => i.productId === action.payload.productId
            );

            if (index !== -1) {
                state.cartItems[index] = action.payload;
            } else {
                state.cartItems.push(action.payload);
                state.loading = false;
            }
        },
        removeCartItem: (state, action) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter(
                (i) => i.productId !== action.payload
            );
            state.loading = false;
        },
        calculatePrice: (state) => {
            const subtotal = state.cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );

            state.subtotal = subtotal;
            state.shippingCharges = state.subtotal > 1000 ? 0 : 70;
            state.tax = Math.round(state.subtotal * 0.18);
            state.total =
                state.subtotal +
                state.shippingCharges +
                state.tax -
                state.discount;
        },
        applayDiscount: (state, action) => {
            state.discount = action.payload;
        },
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
        },

        resetCart: () => initialState,
    },
});

export const {
    addToCart,
    removeCartItem,
    calculatePrice,
    applayDiscount,
    saveShippingInfo,
    resetCart,
} = cartReducer.actions;
