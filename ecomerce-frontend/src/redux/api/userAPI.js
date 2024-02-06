/** @format */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/user/`,
    }),
    tagTypes: ["users"],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (user) => ({
                url: "new",
                method: "POST",
                body: user,
            }),
            invalidatesTags: ["users"],
        }),
        adminAllUsers: builder.query({
            query: (id) => `all?id=${id}`,
            providesTags: ["users"],
        }),
        deleteUser: builder.mutation({
            query: ({ aid, uid }) => ({
                url: `${uid}?id=${aid}`,
                method: "DELETE",
            }),
            invalidatesTags: ["users"],
        }),
    }),
});

export const getUser = async (id) => {
    try {
        const { data } = await axios.get(
            `${import.meta.env.VITE_SERVER}/user/${id}`
        );
        return data;
    } catch (error) {
        throw error.response.data;
    }
};

export const {
    useLoginMutation,
    useAdminAllUsersQuery,
    useDeleteUserMutation,
} = userApi;
