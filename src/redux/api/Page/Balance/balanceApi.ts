import { api } from "../../../baseApi";

export const balanceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBalanceAccount: builder.query({
      query: () => ({
        url: "balances/total-account",
        method: "GET",
      }),
      providesTags: ["Balance"],
    }),

    getBalanceAccountById: builder.query({
      query: (id: string) => ({
        url: `balances/${id}`,
        method: "GET",
      }),
      providesTags: ["Balance"],
    }),
    putBalanceUpdateById: builder.mutation({
      query: ({ id, data }) => ({
        url: `balances/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Balance"],
    }),
    // ===============================
    //  Add new balance account
    // ===============================
    postBalanceAddNewAccount: builder.mutation({
      query: (data) => ({
        url: "balances/add-account",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Balance"],
    }),

    // ================================
    //  Delete balance account
    // ================================
    deleteBalanceAccountById: builder.mutation({
      query: (id: string) => ({
        url: `balances/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Balance"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBalanceAccountQuery,
  useGetBalanceAccountByIdQuery,
  usePutBalanceUpdateByIdMutation,
  useDeleteBalanceAccountByIdMutation,
  usePostBalanceAddNewAccountMutation,
} = balanceApi;
