/** @format */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/order/`,
    }),
    tagTypes: ["orders"],
    endpoints: (builder) => ({
        createNewOrder: builder.mutation({
            query: (order) => ({
                url: "new",
                method: "POST",
                body: order,
            }),
            invalidatesTags: ["orders"],
        }),
        myOrders: builder.query({
            query: (id) => `myorders?id=${id}`,
            providesTags: ["orders"],
        }),
        allOrders: builder.query({
            query: (id) => `all?id=${id}`,
            providesTags: ["orders"],
        }),
        orderDetails: builder.query({
            query: ({ id, oid }) => `${oid}?id=${id}`,
            providesTags: ["orders"],
        }),
        processOrder: builder.mutation({
            query: ({ id, oid }) => ({
                url: `${oid}?id=${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["orders"],
        }),
        deleteOrder: builder.mutation({
            query: ({ id, oid }) => ({
                url: `${oid}?id=${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["orders"],
        }),
    }),
});

export const {
    useCreateNewOrderMutation,
    useMyOrdersQuery,
    useAllOrdersQuery,
    useDeleteOrderMutation,
    useOrderDetailsQuery,
    useProcessOrderMutation,
} = orderApi;
