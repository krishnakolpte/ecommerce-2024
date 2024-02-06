/** @format */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
    reducerPath: "paymentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/payment/`,
    }),
    tagTypes: ["coupons"],
    endpoints: (builder) => ({
        newCouponSave: builder.mutation({
            query: ({ formData, id }) => ({
                url: `coupon/new?id=${id}`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["coupons"],
        }),
    }),
});

export const { useNewCouponSaveMutation } = paymentApi;
