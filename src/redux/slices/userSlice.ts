import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Category {
  title: string;
  image?: any;
}

interface LoanRecord {
  type: string;
  icon: string;
  name: string;
  target: number;
  accumulatedAmount: number;
  targetunit: string;
  category: Category | null;
  date: string;
  note: string;
}

interface UserState {
  category: Category | null;
  buttonCatagory: string;
  loanRecord: LoanRecord | null;

  // driver
  reduceDistance: number;
  point: number;
  level: number;
}

const initialState: UserState = {
  category: null,
  loanRecord: null,
  // goals button
  buttonCatagory: "Goals",
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
    setLoanRecord(state, action: PayloadAction<LoanRecord | null>) {
      state.loanRecord = action.payload;
    },
    setButtonCatagory(state, action: PayloadAction<string>) {
      state.buttonCatagory = action.payload;
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

export const {
  setLoanRecord,
  setCategory,
  setButtonCatagory,
  setReduceDistance,
  setPoint,
  setLevel,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;
