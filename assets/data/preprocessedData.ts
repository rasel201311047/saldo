import countryData from "./countrydata.json";
import languageData from "./languages.json";

export interface Country {
  flag: string;
  countryName: string;
  currency: string;
  countryCodePhone: string;
  countryCode: string;
  flagEmoji: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName?: string;
}

// Extract country code from flag URL and add flag emoji
export const processedCountries: Country[] = countryData.map((country) => {
  const countryCode = country.flag.split("/").pop()?.split(".")[0] || "";
  return {
    ...country,
    countryCode,
    flagEmoji: getFlagEmoji(countryCode),
  };
});

// Create lookup maps for O(1) access
export const countryMaps = {
  byName: new Map<string, Country>(),
  byCode: new Map<string, Country>(),
  byCurrency: new Map<string, Country[]>(),
  searchIndex: new Map<string, Country[]>(),
};

// Build indexes
processedCountries.forEach((country) => {
  countryMaps.byName.set(country.countryName.toLowerCase(), country);
  countryMaps.byCode.set(country.countryCode, country);

  // Group by currency
  if (!countryMaps.byCurrency.has(country.currency)) {
    countryMaps.byCurrency.set(country.currency, []);
  }
  countryMaps.byCurrency.get(country.currency)!.push(country);
});

// Process languages
export const processedLanguages: Language[] = languageData.languages;

export const languageMaps = {
  byCode: new Map<string, Language>(),
  byName: new Map<string, Language>(),
  searchIndex: new Map<string, Language[]>(),
};

processedLanguages.forEach((lang) => {
  languageMaps.byCode.set(lang.code, lang);
  languageMaps.byName.set(lang.name.toLowerCase(), lang);
});

// Helper function to get flag emoji
function getFlagEmoji(countryCode: string): string {
  if (!countryCode) return "🌍";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Predefined popular countries
export const POPULAR_COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "India",
  "Brazil",
  "South Africa",
];

// Currency names mapping
export const CURRENCY_NAMES: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  INR: "Indian Rupee",
  AED: "UAE Dirham",
  SAR: "Saudi Riyal",
  EGP: "Egyptian Pound",
  ZAR: "South African Rand",
  NGN: "Nigerian Naira",
  KES: "Kenyan Shilling",
  GHS: "Ghanaian Cedi",
  BRL: "Brazilian Real",
  MXN: "Mexican Peso",
  SGD: "Singapore Dollar",
  HKD: "Hong Kong Dollar",
  NZD: "New Zealand Dollar",
  KRW: "South Korean Won",
  RUB: "Russian Ruble",
  TRY: "Turkish Lira",
  SEK: "Swedish Krona",
  NOK: "Norwegian Krone",
  DKK: "Danish Krone",
  PLN: "Polish Złoty",
  THB: "Thai Baht",
  IDR: "Indonesian Rupiah",
  MYR: "Malaysian Ringgit",
  PHP: "Philippine Peso",
  VND: "Vietnamese Đồng",
  PKR: "Pakistani Rupee",
  BDT: "Bangladeshi Taka",
  LKR: "Sri Lankan Rupee",
  ILS: "Israeli New Shekel",
  SAR: "Saudi Riyal",
  QAR: "Qatari Riyal",
  KWD: "Kuwaiti Dinar",
  BHD: "Bahraini Dinar",
  OMR: "Omani Rial",
};
