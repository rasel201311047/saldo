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
    getBorrowedShowing: builder.query({
      query: () => ({
        url: "borrowed",
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
  useGetBorrowedShowingQuery,
  useGetLentShowingQuery,
  usePostGoalsAddNewGoalMutation,
  usePostBorrowedAddNewGoalMutation,
  usePostLentAddNewGoalMutation,
} = balanceApi;
