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

    getstartdate: builder.query({
      query: () => ({
        url: "budgets/get-start-date",
        method: "GET",
      }),
      providesTags: ["Balance", "Goals"],
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

    // edit profile
    editProfile: builder.mutation({
      query: (formData) => ({
        url: "profile/",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Balance", "Goals", "Auth"],
    }),
    // about
    getAbout: builder.query({
      query: () => ({
        url: "app-content/about-us",
        method: "GET",
      }),
      providesTags: ["Balance", "Goals"],
    }),

    getTerm: builder.query({
      query: () => ({
        url: "app-content/terms-and-conditions",
        method: "GET",
      }),
      providesTags: ["Balance", "Goals"],
    }),

    getPolicy: builder.query({
      query: () => ({
        url: "app-content/privacy-policy",
        method: "GET",
      }),
      providesTags: ["Balance", "Goals"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetMonthlyReportQuery,
  useGetWeeklyReportQuery,
  usePostStartstateMonthMutation,
  usePostChangePasswordMutation,
  useEditProfileMutation,
  useGetstartdateQuery,
  useGetAboutQuery,
  useGetPolicyQuery,
  useGetTermQuery,
} = profileApi;
