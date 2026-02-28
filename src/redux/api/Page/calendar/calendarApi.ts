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
    }),

    // =================================
    //  Current Balance
    // ================================
    getCurrentBalance: builder.query({
      query: () => ({
        url: "balances/current-balance",
        method: "GET",
      }),
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
    }),
    // ================================
    //  EARNING SPENDING
    // ================================

    getEarningSpending: builder.query({
      query: ({ data }: { data: string }) => ({
        url: `balances/monthly-summary?month=${data}`,
        method: "GET",
      }),
    }),

    //=================================
    //  Analytics
    // ================================
    getIncomeExpenses: builder.query({
      query: (year: number) => ({
        url: `/analytics/income-vs-expenses?year=${year}`,
        method: "GET",
      }),
    }),

    getBalanceTred: builder.query({
      query: ({ year, month }: { year: number; month: number }) => ({
        url: `/analytics/balance-trend?year=${year}&month=${month}`,
        method: "GET",
      }),
    }),
    getSpendingCategory: builder.query({
      query: ({ year, month }: { year: number; month: number }) => ({
        url: `analytics/spending-by-category?year=${year}&month=${month}`,
        method: "GET",
      }),
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
} = calendarApi;
