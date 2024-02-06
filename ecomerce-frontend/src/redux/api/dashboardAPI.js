/** @format */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/stats/`,
    }),
    tagTypes: ["orders"],
    endpoints: (builder) => ({
        stats: builder.query({
            query: (id) => `stats?id=${id}`,
            keepUnusedDataFor: 0,
        }),
        bar: builder.query({
            query: (id) => `bar?id=${id}`,
            keepUnusedDataFor: 0,
        }),
        pie: builder.query({
            query: (id) => `pie?id=${id}`,
            keepUnusedDataFor: 0,
        }),
        line: builder.query({
            query: (id) => `line?id=${id}`,
            keepUnusedDataFor: 0,
        }),
    }),
});

export const { useStatsQuery, useBarQuery, usePieQuery, useLineQuery } =
    dashboardApi;
