import { api } from "../../../baseApi";

export const calendarApi = api.injectEndpoints({
  endpoints: (builder) => ({
    //================================= Analytics
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
  useGetBalanceTredQuery,
  useGetSpendingCategoryQuery,
} = calendarApi;
