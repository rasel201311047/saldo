import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://10.10.20.73:5000/api/";

// ------------------------------
// Get token helper
// ------------------------------
const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync("token");
  } catch (error) {
    console.log("Error reading token:", error);
    return null;
  }
};

// ------------------------------
// Base baseQuery
// ------------------------------
const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// ------------------------------
// Wrapper baseQuery that injects token
// ------------------------------
const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const token = await getToken();

  // Ensure args is an object not a string
  const newArgs: FetchArgs =
    typeof args === "string"
      ? { url: args }
      : { ...args, headers: { ...(args.headers || {}) } };

  // Attach token if exists
  if (token) {
    (newArgs.headers as Record<string, string>).authorization =
      `Bearer ${token}`;
  }

  // Pass to baseQuery
  return rawBaseQuery(newArgs, api, extraOptions);
};

// ------------------------------
// API Slice
// ------------------------------
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,

  tagTypes: ["Auth"],

  endpoints: () => ({}),
});
