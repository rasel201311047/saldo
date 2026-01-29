import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from "./slices/calendarSlice";
import userReducer from "./slices/userSlice";
export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
