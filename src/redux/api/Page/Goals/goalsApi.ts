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

    // complete
    patchGoalsComplete: builder.mutation({
      query: (id: string) => ({
        url: `goals/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Goals"],
    }),

    // delete
    deleteGoal: builder.mutation({
      query: (id: string) => ({
        url: `goals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Goals"],
    }),

    // add progress
    addGoalProgress: builder.mutation<
      any,
      { id: string; data: { amount: number } }
    >({
      query: ({ id, data }) => ({
        url: `goals/${id}/progress`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Goals"],
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
  usePatchGoalsCompleteMutation,
  useAddGoalProgressMutation,
  useDeleteGoalMutation,
  useGetBorrowedShowingQuery,
  useGetSingleBorrowedDetailsQuery,
  useGetLentShowingQuery,
  useGetSingleLentDetailsQuery,
  usePostGoalsAddNewGoalMutation,
  usePostBorrowedAddNewGoalMutation,
  usePostLentAddNewGoalMutation,
} = balanceApi;
