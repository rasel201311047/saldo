export type IconStyle = "solid" | "regular" | "brands";

export interface IconData {
  id: string;
  name: string;
  style: IconStyle;
}

export interface IconState {
  allIcons: IconData[];
  filteredIcons: IconData[];
  selectedIcon: IconData | null;
  selectedStyle: IconStyle | "all";
  searchQuery: string;
  loading: boolean;
}
