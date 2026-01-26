export const MonthImg = {
  january: require("./January.png"),
  february: require("./February.png"),
  march: require("./March.png"),
  april: require("./April.png"),
  may: require("./May.png"),
  june: require("./June.png"),
  july: require("./July.png"),
  august: require("./Aug.png"),
  september: require("./September.png"),
  october: require("./October.png"),
  november: require("./November.png"),
  december: require("./December.png"),
};

export type MonthKey = keyof typeof MonthImg;
export const MONTH_KEYS: MonthKey[] = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
