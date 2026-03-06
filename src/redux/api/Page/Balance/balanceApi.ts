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
        url: `balances/${id}`,
        method: "GET",
      }),
    }),
    putBalanceUpdateById: builder.mutation({
      query: ({ id, data }) => ({
        url: `balances/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBalanceAccountQuery,
  useGetBalanceAccountByIdQuery,
  usePutBalanceUpdateByIdMutation,
} = balanceApi;
