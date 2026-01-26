import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CalendarState {
  currentMonth: number;
  currentYear: number;
}

const getCurrentMonth = () => new Date().getMonth();
const getCurrentYear = () => new Date().getFullYear();

const initialState: CalendarState = {
  currentMonth: getCurrentMonth(),
  currentYear: getCurrentYear(),
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setCurrentMonth: (
      state,
      action: PayloadAction<{ month: number; year: number }>,
    ) => {
      state.currentMonth = action.payload.month;
      state.currentYear = action.payload.year;
    },
    nextMonth: (state) => {
      if (state.currentMonth === 11) {
        state.currentMonth = 0;
        state.currentYear += 1;
      } else {
        state.currentMonth += 1;
      }
    },
    previousMonth: (state) => {
      if (state.currentMonth === 0) {
        state.currentMonth = 11;
        state.currentYear -= 1;
      } else {
        state.currentMonth -= 1;
      }
    },
    resetToCurrent: (state) => {
      state.currentMonth = getCurrentMonth();
      state.currentYear = getCurrentYear();
    },
  },
});

export const { setCurrentMonth, nextMonth, previousMonth, resetToCurrent } =
  calendarSlice.actions;
export default calendarSlice.reducer;
