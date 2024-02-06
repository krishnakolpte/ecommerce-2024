/** @format */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/product/`,
    }),
    tagTypes: ["product"],
    endpoints: (builder) => ({
        latestProducts: builder.query({
            query: () => "latest",
            providesTags: ["product"],
        }),
        adminAllProducts: builder.query({
            query: (id) => `admin/products?id=${id}`,
            providesTags: ["product"],
        }),
        categories: builder.query({
            query: () => "categories",
            providesTags: ["product"],
        }),
        searchProducts: builder.query({
            query: ({ search, sort, category, price, page }) => {
                let base = `all?search=${search}&page=${page}`;
                if (price) base += `&price=${price}`;
                if (sort) base += `&sort=${sort}`;
                if (category) base += `&category=${category}`;

                return base;
            },
            providesTags: ["product"],
        }),
        createProduct: builder.mutation({
            query: ({ formData, id }) => ({
                url: `new?id=${id}`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["product"],
        }),
        productDetails: builder.query({
            query: ({ pid, uid }) => `${pid}?id=${uid}`,
            providesTags: ["product"],
        }),
        updateProduct: builder.mutation({
            query: ({ formData, pid, uid }) => ({
                url: `${pid}?id=${uid}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["product"],
        }),
        deleteProduct: builder.mutation({
            query: ({ pid, uid }) => ({
                url: `${pid}?id=${uid}`,
                method: "DELETE",
            }),
            invalidatesTags: ["product"],
        }),
    }),
});

export const {
    useLatestProductsQuery,
    useAdminAllProductsQuery,
    useCategoriesQuery,
    useSearchProductsQuery,
    useCreateProductMutation,
    useProductDetailsQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;
