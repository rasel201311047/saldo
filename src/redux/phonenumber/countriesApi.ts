import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* ===== Types ===== */
export type Country = {
  cca2: string;
  name: {
    common: string;
  };
  flags: {
    png: string;
    svg: string;
  };
  idd: {
    root: string;
    suffixes?: string[];
  };
};

/* ===== RTK Query API ===== */
export const countriesApi = createApi({
  reducerPath: "countriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://restcountries.com/v3.1/",
  }),
  endpoints: (builder) => ({
    getAllCountries: builder.query<Country[], void>({
      query: () => "all?fields=name,idd,flags,cca2",
    }),
  }),
});

export const { useGetAllCountriesQuery } = countriesApi;
