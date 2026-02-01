import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from "./slices/calendarSlice";
import iconReducer from "./slices/iconSlice";
import userReducer from "./slices/userSlice";
export const store = configureStore({
  reducer: {
    icons: iconReducer,
    calendar: calendarReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
