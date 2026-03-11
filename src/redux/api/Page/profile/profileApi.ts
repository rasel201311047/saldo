import { api } from "../../../baseApi";

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // report
    getWeeklyReport: builder.query({
      query: () => ({
        url: "reports/weekly",
        method: "GET",
      }),
      providesTags: ["Balance", "Goals"],
    }),

    getMonthlyReport: builder.query({
      query: (date: string) => ({
        url: `reports/monthly?month=${date}`,
        method: "GET",
      }),
      providesTags: ["Balance", "Goals"],
    }),

    // start state

    postStartstateMonth: builder.mutation({
      query: (data) => ({
        url: "budgets/set-start-date",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Balance", "Goals"],
    }),
    // change password
    postChangePassword: builder.mutation({
      query: (data) => ({
        url: "profile/change-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Balance", "Goals", "Auth"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetMonthlyReportQuery,
  useGetWeeklyReportQuery,
  usePostStartstateMonthMutation,
  usePostChangePasswordMutation,
} = profileApi;
