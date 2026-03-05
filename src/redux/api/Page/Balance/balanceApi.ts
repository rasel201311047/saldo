import { api } from "../../../baseApi";

export const balanceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBalanceAccount: builder.query({
      query: () => ({
        url: "balances/total-account",
        method: "GET",
      }),
    }),

    getBalanceAccountById: builder.query({
      query: (id: string) => ({
        url: `/balances/${id}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetBalanceAccountQuery, useGetBalanceAccountByIdQuery } =
  balanceApi;
