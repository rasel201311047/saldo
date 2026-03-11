import { api } from "../../../baseApi";

export const calendarApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // =================================
    //  Notifications
    // ================================
    getNotificationData: builder.query({
      query: () => ({
        url: "notifications/me",
        method: "GET",
      }),
      providesTags: ["Balance", "Goals", "Auth", "Profile"],
    }),

    // =================================
    //  Current Balance
    // ================================
    getCurrentBalance: builder.query({
      query: () => ({
        url: "balances/current-balance",
        method: "GET",
      }),
      providesTags: ["Balance", "Goals"],
    }),

    // =================================
    //  Reports show
    // ===============================

    getReportData: builder.query({
      query: ({
        startDate,
        endDate,
      }: {
        startDate: string;
        endDate: string;
      }) => ({
        url: `budgets/transactions-by-range?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
      providesTags: ["Balance", "Goals"],
    }),
    // ================================
    //  EARNING SPENDING
    // ================================

    getEarningSpending: builder.query({
      query: ({ data }: { data: string }) => ({
        url: `balances/monthly-summary?month=${data}`,
        method: "GET",
      }),
      providesTags: ["Balance", "Goals"],
    }),

    //=================================
    //  Analytics
    // ================================
    getIncomeExpenses: builder.query({
      query: (year: number) => ({
        url: `/analytics/income-vs-expenses?year=${year}`,
        method: "GET",
      }),
      providesTags: ["Balance", "Goals"],
    }),

    getBalanceTred: builder.query({
      query: ({ year, month }: { year: number; month: number }) => ({
        url: `/analytics/balance-trend?year=${year}&month=${month}`,
        method: "GET",
      }),
      providesTags: ["Balance", "Goals"],
    }),
    getSpendingCategory: builder.query({
      query: ({ year, month }: { year: number; month: number }) => ({
        url: `analytics/spending-by-category?year=${year}&month=${month}`,
        method: "GET",
      }),
      providesTags: ["Balance", "Goals"],
    }),
    //=================================
    //  budget
    // ================================

    getBudgeDatawithfilter: builder.query({
      query: (status: string) => ({
        url: `budgets?status=${status}`,
        method: "GET",
      }),
      providesTags: ["Balance", "Goals"],
    }),

    postBudgeData: builder.mutation({
      query: (data) => ({
        url: "budgets",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Balance", "Goals"],
    }),
    //=================================
    //  income add
    // ================================
    postIncomeData: builder.mutation({
      query: (data) => ({
        url: "balances/income",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Balance", "Goals"],
    }),
    postspendingData: builder.mutation({
      query: (data) => ({
        url: "balances/spending",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Balance", "Goals"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetIncomeExpensesQuery,
  useGetCurrentBalanceQuery,
  useGetNotificationDataQuery,
  useGetEarningSpendingQuery,
  useGetReportDataQuery,
  useGetBalanceTredQuery,
  useGetSpendingCategoryQuery,
  useGetBudgeDatawithfilterQuery,
  usePostBudgeDataMutation,

  usePostIncomeDataMutation,
  usePostspendingDataMutation,
} = calendarApi;
