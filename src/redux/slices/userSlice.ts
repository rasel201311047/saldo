import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Category {
  title: string;
  image?: any;
}

interface UserState {
  category: Category | null;

  // driver
  reduceDistance: number;
  point: number;
  level: number;
}

const initialState: UserState = {
  category: null,
  reduceDistance: 1,
  point: 0,
  level: 1,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<Category | null>) {
      state.category = action.payload;
    },
    setReduceDistance(state, action: PayloadAction<number>) {
      state.reduceDistance = action.payload;
    },
    setPoint(state, action: PayloadAction<number>) {
      state.point = action.payload;
    },
    setLevel(state, action: PayloadAction<number>) {
      state.level = action.payload;
    },
    resetUser: () => initialState,
  },
});

export const { setCategory, setReduceDistance, setPoint, setLevel, resetUser } =
  userSlice.actions;

export default userSlice.reducer;
