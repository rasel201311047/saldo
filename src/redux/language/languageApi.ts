import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export type Language = {
  code: string;
  name: string;
};

export const languageApi = createApi({
  reducerPath: "languageApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://libretranslate.com" }),
  endpoints: (builder) => ({
    getLanguages: builder.query<Language[], void>({
      query: () => "/languages",
      transformResponse: (response: any[]) => {
        return response.map((lang) => ({
          code: lang.code,
          name: lang.name,
        }));
      },
    }),
  }),
});

export const { useGetLanguagesQuery } = languageApi;
