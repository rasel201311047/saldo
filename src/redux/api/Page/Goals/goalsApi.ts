import { api } from "../../../baseApi";
interface GoalData {
  name: string;
  targetAmount: number;
  category: string;
  accumulatedAmount: number;
  icon: string;
  color: string;
  date: string;
  notes: string;
}

interface BorrowedData {
  name: string;
  notes: string;
  icon: string;
  color: string;
  amount: number;

  accumulatedAmount: number;
  lender: string;
  debtDate: string;
  payoffDate: string;
}
interface LentData {
  name: string;
  notes: string;
  icon: string;
  color: string;
  amount: number;
  accumulatedAmount: number;
  lender: string;
  lentDate: string;
  payoffDate: string;
}

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

    // edit

    editgoalform: builder.mutation<any, { id: string; data: GoalData }>({
      query: ({ id, data }) => ({
        url: `goals/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Goals"],
    }),

    // ======================
    // borrowed
    // =======================
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
    deleteBorrowed: builder.mutation({
      query: (id: string) => ({
        url: `borrowed/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Goals"],
    }),
    // add progress
    addBorrowedProgress: builder.mutation<
      any,
      { id: string; data: { amount: number } }
    >({
      query: ({ id, data }) => ({
        url: `borrowed/${id}/payment`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Goals"],
    }),

    patchBorrowedMark: builder.mutation({
      query: (id: string) => ({
        url: `borrowed/${id}/paid`,
        method: "PATCH",
      }),
      invalidatesTags: ["Goals"],
    }),

    editBorrowedform: builder.mutation<any, { id: string; data: BorrowedData }>(
      {
        query: ({ id, data }) => ({
          url: `borrowed/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Goals"],
      },
    ),

    // ======================
    // Lent
    // =======================
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

    deleteLent: builder.mutation({
      query: (id: string) => ({
        url: `lent/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Goals"],
    }),

    editLentform: builder.mutation<any, { id: string; data: LentData }>({
      query: ({ id, data }) => ({
        url: `lent/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Goals"],
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
  // goal
  useGetGoalShowingQuery,
  useGetSingleGoalDetailsQuery,
  usePatchGoalsCompleteMutation,
  useAddGoalProgressMutation,
  useDeleteGoalMutation,
  useEditgoalformMutation,
  // borrowed
  useGetBorrowedShowingQuery,
  useGetSingleBorrowedDetailsQuery,
  useDeleteBorrowedMutation,
  useAddBorrowedProgressMutation,
  usePatchBorrowedMarkMutation,
  useEditBorrowedformMutation,
  // lent
  useGetLentShowingQuery,
  useGetSingleLentDetailsQuery,
  useDeleteLentMutation,
  useEditLentformMutation,

  usePostGoalsAddNewGoalMutation,
  usePostBorrowedAddNewGoalMutation,
  usePostLentAddNewGoalMutation,
} = balanceApi;
