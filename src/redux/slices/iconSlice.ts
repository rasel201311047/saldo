import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import iconData from "../../../assets/data/icon.json";
import { IconJson } from "./icon.types";

interface IconState {
  icons: IconJson;
  selectedIcon: string | null;
  style: "solid" | "regular" | "brands";
}

const initialState: IconState = {
  icons: iconData as IconJson,
  selectedIcon: null,
  style: "solid",
};

const iconSlice = createSlice({
  name: "icons",
  initialState,
  reducers: {
    setSelectedIcon: (state, action: PayloadAction<string>) => {
      state.selectedIcon = action.payload;
    },
    setIconStyle: (
      state,
      action: PayloadAction<"solid" | "regular" | "brands">,
    ) => {
      state.style = action.payload;
    },
  },
});

export const { setSelectedIcon, setIconStyle } = iconSlice.actions;
export default iconSlice.reducer;
