import * as SecureStore from "expo-secure-store";
import { api } from "../../baseApi";

import { setCredentials } from "./authSlice";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ============== sign in
    signin: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          // Store token securely
          if (data.token) {
            await SecureStore.setItemAsync("token", data.token);
          }

          // Store user + token in Redux store
          dispatch(
            setCredentials({
              user: data.data.user,
              token: data.data.token,
            }),
          );
        } catch (e) {
          console.error("Login failed:", e);
        }
      },
    }),

    // ==================sign up
    signup: builder.mutation({
      query: (credentials) => ({
        url: "users/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        const { data } = await queryFulfilled;

        if (data.token) {
          await SecureStore.setItemAsync("token", data.token);
        }

        dispatch(
          setCredentials({
            user: data.data.user,
            token: data.data.token,
          }),
        );
      },
    }),

    // ========================get profile data
    getMyProfile: builder.query({
      query: () => ({
        url: "auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    // ========================setup profile
    setupProfile: builder.mutation({
      query: (data) => ({
        url: "users/profile-setup",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // =======================varification of data
    verifyCode: builder.mutation({
      query: (data) => ({
        url: "auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    // ======================== resend validation
    otpresendValidation: builder.mutation({
      query: (data) => ({
        url: "auth/resend-otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // =========================profile data
    getMyProfile: builder.query({
      query: () => ({
        url: "auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    // ============================forget password
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ===========================reset password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "auth/reset-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // edit profile
    editProfile: builder.mutation({
      query: (data) => ({
        url: "auth/reset-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useSigninMutation,
  useSignupMutation,
  useGetMyProfileQuery,
  useSetupProfileMutation,
  useVerifyCodeMutation,
  useForgetPasswordMutation,
  useOtpresendValidationMutation,
  useResetPasswordMutation,
} = authApi;
