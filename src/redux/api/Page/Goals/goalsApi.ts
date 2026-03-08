import { api } from "../../../baseApi";

export const balanceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ===============================
    //  Get
    // ===============================

    getGoalShowing: builder.query({
      query: () => ({
        url: "goals",
        method: "GET",
      }),
      providesTags: ["Goals"],
    }),

    getSingleGoalDetails: builder.query({
      query: (id: string) => ({
        url: `goals/${id}`,
        method: "GET",
      }),
      providesTags: ["Goals"],
    }),

    getBorrowedShowing: builder.query({
      query: () => ({
        url: "borrowed",
        method: "GET",
      }),
      providesTags: ["Goals"],
    }),

    getSingleBorrowedDetails: builder.query({
      query: (id: string) => ({
        url: `borrowed/${id}`,
        method: "GET",
      }),
      providesTags: ["Goals"],
    }),
    getLentShowing: builder.query({
      query: () => ({
        url: "lent",
        method: "GET",
      }),
      providesTags: ["Goals"],
    }),

    getSingleLentDetails: builder.query({
      query: (id: string) => ({
        url: `lent/${id}`,
        method: "GET",
      }),
      providesTags: ["Goals"],
    }),

    // ===============================
    //  Add new
    // ===============================
    postGoalsAddNewGoal: builder.mutation({
      query: (data) => ({
        url: "goals",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Goals"],
    }),
    postBorrowedAddNewGoal: builder.mutation({
      query: (data) => ({
        url: "borrowed",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Goals"],
    }),

    postLentAddNewGoal: builder.mutation({
      query: (data) => ({
        url: "lent",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Goals"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGoalShowingQuery,
  useGetSingleGoalDetailsQuery,
  useGetBorrowedShowingQuery,
  useGetSingleBorrowedDetailsQuery,
  useGetLentShowingQuery,
  useGetSingleLentDetailsQuery,
  usePostGoalsAddNewGoalMutation,
  usePostBorrowedAddNewGoalMutation,
  usePostLentAddNewGoalMutation,
} = balanceApi;
