import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./api/Auth/authSlice";
import { api } from "./baseApi";
import { languageApi } from "./language/languageApi";
import { countriesApi } from "./phonenumber/countriesApi";
import calendarReducer from "./slices/calendarSlice";
import iconReducer from "./slices/iconSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [countriesApi.reducerPath]: countriesApi.reducer,
    [languageApi.reducerPath]: languageApi.reducer,
    icons: iconReducer,
    calendar: calendarReducer,
    user: userReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware, countriesApi.middleware, languageApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
