import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CountriesResponse,
  Country,
  CurrenciesResponse,
  Currency,
  Language,
  LanguagesResponse,
} from "../type/thepicker";

// Import JSON data
import countryData from "../../assets/data/countrydata.json";
import languagesData from "../../assets/data/languages.json";

// Helper function to get country code from flag URL
const extractCountryCode = (flagUrl: string): string => {
  const match = flagUrl.match(/\/[a-z]{2}\./);
  return match ? match[0].replace(/[\/.]/g, "").toUpperCase() : "US";
};

// Helper function to generate flag emoji from country code
const getFlagEmoji = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Currency symbols mapping
const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  AUD: "A$",
  CAD: "C$",
  CHF: "Fr",
  AED: "د.إ",
  AFN: "؋",
  ALL: "L",
  AMD: "֏",
  ANG: "ƒ",
  AOA: "Kz",
  ARS: "$",
  AWG: "ƒ",
  AZN: "₼",
  BAM: "KM",
  BBD: "$",
  BDT: "৳",
  BGN: "лв",
  BHD: ".د.ب",
  BIF: "FBu",
  BMD: "$",
  BND: "$",
  BOB: "Bs.",
  BRL: "R$",
  BSD: "$",
  BTN: "Nu.",
  BWP: "P",
  BYN: "Br",
  BZD: "BZ$",
  CDF: "FC",
  CLP: "$",
  COP: "$",
  CRC: "₡",
  CUP: "₱",
  CVE: "$",
  CZK: "Kč",
  DJF: "Fdj",
  DKK: "kr",
  DOP: "RD$",
  DZD: "د.ج",
  EGP: "£",
  ERN: "Nfk",
  ETB: "Br",
  FJD: "$",
  FKP: "£",
  FOK: "kr",
  GEL: "₾",
  GGP: "£",
  GHS: "₵",
  GIP: "£",
  GMD: "D",
  GNF: "FG",
  GTQ: "Q",
  GYD: "$",
  HKD: "HK$",
  HNL: "L",
  HRK: "kn",
  HTG: "G",
  HUF: "Ft",
  IDR: "Rp",
  ILS: "₪",
  IMP: "£",
  IQD: "ع.د",
  IRR: "﷼",
  ISK: "kr",
  JEP: "£",
  JMD: "J$",
  JOD: "د.ا",
  KES: "KSh",
  KGS: "с",
  KHR: "៛",
  KID: "$",
  KMF: "CF",
  KPW: "₩",
  KRW: "₩",
  KWD: "د.ك",
  KYD: "$",
  KZT: "₸",
  LAK: "₭",
  LBP: "ل.ل",
  LKR: "Rs",
  LRD: "$",
  LSL: "L",
  LYD: "ل.د",
  MAD: "د.م.",
  MDL: "lei",
  MGA: "Ar",
  MKD: "ден",
  MMK: "K",
  MNT: "₮",
  MOP: "MOP$",
  MRU: "UM",
  MUR: "₨",
  MVR: "Rf",
  MWK: "MK",
  MXN: "$",
  MYR: "RM",
  MZN: "MT",
  NAD: "$",
  NGN: "₦",
  NIO: "C$",
  NOK: "kr",
  NPR: "₨",
  NZD: "$",
  OMR: "﷼",
  PAB: "B/.",
  PEN: "S/",
  PGK: "K",
  PHP: "₱",
  PKR: "₨",
  PLN: "zł",
  PYG: "₲",
  QAR: "ر.ق",
  RON: "lei",
  RSD: "дин.",
  RUB: "₽",
  RWF: "RF",
  SAR: "﷼",
  SBD: "$",
  SCR: "₨",
  SDG: "ج.س.",
  SEK: "kr",
  SGD: "$",
  SHP: "£",
  SLE: "Le",
  SLL: "Le",
  SOS: "S",
  SRD: "$",
  SSP: "£",
  STN: "Db",
  SYP: "£",
  SZL: "L",
  THB: "฿",
  TJS: "SM",
  TMT: "m",
  TND: "د.ت",
  TOP: "T$",
  TRY: "₺",
  TTD: "TT$",
  TVD: "$",
  TWD: "NT$",
  TZS: "TSh",
  UAH: "₴",
  UGX: "USh",
  UYU: "$U",
  UZS: "soʻm",
  VES: "Bs",
  VND: "₫",
  VUV: "Vt",
  WST: "WS$",
  XAF: "FCFA",
  XCD: "$",
  XOF: "CFA",
  XPF: "₣",
  YER: "﷼",
  ZAR: "R",
  ZMW: "ZK",
  ZWL: "$",
};

// Currency names mapping
const currencyNames: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  CNY: "Chinese Yuan",
  INR: "Indian Rupee",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  AED: "UAE Dirham",
  AFN: "Afghan Afghani",
  ALL: "Albanian Lek",
  AMD: "Armenian Dram",
  ANG: "Netherlands Antillean Guilder",
  AOA: "Angolan Kwanza",
  ARS: "Argentine Peso",
  AWG: "Aruban Florin",
  AZN: "Azerbaijani Manat",
  BAM: "Bosnia-Herzegovina Convertible Mark",
  BBD: "Barbadian Dollar",
  BDT: "Bangladeshi Taka",
  BGN: "Bulgarian Lev",
  BHD: "Bahraini Dinar",
  BIF: "Burundian Franc",
  BMD: "Bermudian Dollar",
  BND: "Brunei Dollar",
  BOB: "Bolivian Boliviano",
  BRL: "Brazilian Real",
  BSD: "Bahamian Dollar",
  BTN: "Bhutanese Ngultrum",
  BWP: "Botswana Pula",
  BYN: "Belarusian Ruble",
  BZD: "Belize Dollar",
  CDF: "Congolese Franc",
  CLP: "Chilean Peso",
  COP: "Colombian Peso",
  CRC: "Costa Rican Colón",
  CUP: "Cuban Peso",
  CVE: "Cape Verdean Escudo",
  CZK: "Czech Koruna",
  DJF: "Djiboutian Franc",
  DKK: "Danish Krone",
  DOP: "Dominican Peso",
  DZD: "Algerian Dinar",
  EGP: "Egyptian Pound",
  ERN: "Eritrean Nakfa",
  ETB: "Ethiopian Birr",
  FJD: "Fijian Dollar",
  FKP: "Falkland Islands Pound",
  FOK: "Faroese Króna",
  GEL: "Georgian Lari",
  GGP: "Guernsey Pound",
  GHS: "Ghanaian Cedi",
  GIP: "Gibraltar Pound",
  GMD: "Gambian Dalasi",
  GNF: "Guinean Franc",
  GTQ: "Guatemalan Quetzal",
  GYD: "Guyanese Dollar",
  HKD: "Hong Kong Dollar",
  HNL: "Honduran Lempira",
  HRK: "Croatian Kuna",
  HTG: "Haitian Gourde",
  HUF: "Hungarian Forint",
  IDR: "Indonesian Rupiah",
  ILS: "Israeli New Shekel",
  IMP: "Isle of Man Pound",
  IQD: "Iraqi Dinar",
  IRR: "Iranian Rial",
  ISK: "Icelandic Króna",
  JEP: "Jersey Pound",
  JMD: "Jamaican Dollar",
  JOD: "Jordanian Dinar",
  KES: "Kenyan Shilling",
  KGS: "Kyrgyzstani Som",
  KHR: "Cambodian Riel",
  KID: "Kiribati Dollar",
  KMF: "Comorian Franc",
  KPW: "North Korean Won",
  KRW: "South Korean Won",
  KWD: "Kuwaiti Dinar",
  KYD: "Cayman Islands Dollar",
  KZT: "Kazakhstani Tenge",
  LAK: "Lao Kip",
  LBP: "Lebanese Pound",
  LKR: "Sri Lankan Rupee",
  LRD: "Liberian Dollar",
  LSL: "Lesotho Loti",
  LYD: "Libyan Dinar",
  MAD: "Moroccan Dirham",
  MDL: "Moldovan Leu",
  MGA: "Malagasy Ariary",
  MKD: "Macedonian Denar",
  MMK: "Myanmar Kyat",
  MNT: "Mongolian Tögrög",
  MOP: "Macanese Pataca",
  MRU: "Mauritanian Ouguiya",
  MUR: "Mauritian Rupee",
  MVR: "Maldivian Rufiyaa",
  MWK: "Malawian Kwacha",
  MXN: "Mexican Peso",
  MYR: "Malaysian Ringgit",
  MZN: "Mozambican Metical",
  NAD: "Namibian Dollar",
  NGN: "Nigerian Naira",
  NIO: "Nicaraguan Córdoba",
  NOK: "Norwegian Krone",
  NPR: "Nepalese Rupee",
  NZD: "New Zealand Dollar",
  OMR: "Omani Rial",
  PAB: "Panamanian Balboa",
  PEN: "Peruvian Sol",
  PGK: "Papua New Guinean Kina",
  PHP: "Philippine Peso",
  PKR: "Pakistani Rupee",
  PLN: "Polish Złoty",
  PYG: "Paraguayan Guaraní",
  QAR: "Qatari Riyal",
  RON: "Romanian Leu",
  RSD: "Serbian Dinar",
  RUB: "Russian Ruble",
  RWF: "Rwandan Franc",
  SAR: "Saudi Riyal",
  SBD: "Solomon Islands Dollar",
  SCR: "Seychellois Rupee",
  SDG: "Sudanese Pound",
  SEK: "Swedish Krona",
  SGD: "Singapore Dollar",
  SHP: "Saint Helena Pound",
  SLE: "Sierra Leonean Leone",
  SLL: "Sierra Leonean Leone",
  SOS: "Somali Shilling",
  SRD: "Surinamese Dollar",
  SSP: "South Sudanese Pound",
  STN: "São Tomé and Príncipe Dobra",
  SYP: "Syrian Pound",
  SZL: "Eswatini Lilangeni",
  THB: "Thai Baht",
  TJS: "Tajikistani Somoni",
  TMT: "Turkmenistani Manat",
  TND: "Tunisian Dinar",
  TOP: "Tongan Paʻanga",
  TRY: "Turkish Lira",
  TTD: "Trinidad and Tobago Dollar",
  TVD: "Tuvaluan Dollar",
  TWD: "New Taiwan Dollar",
  TZS: "Tanzanian Shilling",
  UAH: "Ukrainian Hryvnia",
  UGX: "Ugandan Shilling",
  UYU: "Uruguayan Peso",
  UZS: "Uzbekistani Soʻm",
  VES: "Venezuelan Bolívar",
  VND: "Vietnamese Đồng",
  VUV: "Vanuatu Vatu",
  WST: "Samoan Tālā",
  XAF: "Central African CFA Franc",
  XCD: "Eastern Caribbean Dollar",
  XOF: "West African CFA Franc",
  XPF: "CFP Franc",
  YER: "Yemeni Rial",
  ZAR: "South African Rand",
  ZMW: "Zambian Kwacha",
  ZWL: "Zimbabwean Dollar",
};

// Process countries data
const processCountries = (): Country[] => {
  return countryData.map((item) => {
    const countryCode = extractCountryCode(item.flag);
    return {
      countryCode,
      countryName: item.countryName,
      currency: item.currency,
      flagEmoji: getFlagEmoji(countryCode),
      flag: item.flag,
      countryCodePhone: item.countryCodePhone,
    };
  });
};

// Process currencies data
const processCurrencies = (countries: Country[]): Currency[] => {
  const currencyMap = new Map<string, string[]>();

  countries.forEach((country) => {
    const currencyCode = country.currency;
    if (!currencyMap.has(currencyCode)) {
      currencyMap.set(currencyCode, []);
    }
    currencyMap.get(currencyCode)?.push(country.countryName);
  });

  return Array.from(currencyMap.entries())
    .map(([code, countriesList]) => ({
      code,
      name: currencyNames[code] || code,
      countries: countriesList,
      symbol: currencySymbols[code] || code.charAt(0),
    }))
    .sort((a, b) => a.code.localeCompare(b.code));
};

// Process languages data
const processLanguages = (): Language[] => {
  return languagesData.languages
    .map((lang) => ({
      code: lang.code,
      name: lang.name,
      nativeName: lang.nativeName || lang.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Popular countries (top 20 by economic significance)
const popularCountryCodes = [
  "US",
  "GB",
  "DE",
  "FR",
  "JP",
  "CN",
  "IN",
  "CA",
  "AU",
  "IT",
  "ES",
  "BR",
  "MX",
  "KR",
  "NL",
  "CH",
  "SE",
  "AE",
  "SA",
  "SG",
];

// Create the API
export const countryDataPicker = createApi({
  reducerPath: "countryDataPicker",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Countries", "Currencies", "Languages"],
  endpoints: (builder) => ({
    getCountries: builder.query<
      CountriesResponse,
      { search?: string; page?: number; limit?: number }
    >({
      queryFn: ({ search = "", page = 1, limit = 50 }) => {
        try {
          const allCountries = processCountries();

          // Filter countries based on search
          let filteredCountries = allCountries;
          if (search) {
            const searchLower = search.toLowerCase();
            filteredCountries = allCountries.filter(
              (country) =>
                country.countryName.toLowerCase().includes(searchLower) ||
                country.currency.toLowerCase().includes(searchLower) ||
                country.countryCode.toLowerCase().includes(searchLower),
            );
          }

          // Get popular countries
          const popularCountries = allCountries
            .filter((country) =>
              popularCountryCodes.includes(country.countryCode),
            )
            .sort((a, b) => a.countryName.localeCompare(b.countryName));

          // Paginate
          const start = (page - 1) * limit;
          const paginatedCountries = filteredCountries.slice(
            start,
            start + limit,
          );

          return {
            data: {
              countries: paginatedCountries,
              popularCountries,
              total: filteredCountries.length,
              page,
              limit,
            },
          };
        } catch (error) {
          return {
            error: { message: "Failed to process countries data", status: 500 },
          };
        }
      },
      providesTags: (result) =>
        result ? [{ type: "Countries", id: "LIST" }] : [],
    }),

    getCurrencies: builder.query<CurrenciesResponse, { search?: string }>({
      queryFn: ({ search = "" }) => {
        try {
          const countries = processCountries();
          let currencies = processCurrencies(countries);

          if (search) {
            const searchLower = search.toLowerCase();
            currencies = currencies.filter(
              (currency) =>
                currency.code.toLowerCase().includes(searchLower) ||
                currency.name.toLowerCase().includes(searchLower) ||
                currency.countries.some((c) =>
                  c.toLowerCase().includes(searchLower),
                ),
            );
          }

          return {
            data: {
              currencies,
              total: currencies.length,
            },
          };
        } catch (error) {
          return {
            error: {
              message: "Failed to process currencies data",
              status: 500,
            },
          };
        }
      },
      providesTags: (result) =>
        result ? [{ type: "Currencies", id: "LIST" }] : [],
    }),

    getLanguages: builder.query<LanguagesResponse, { search?: string }>({
      queryFn: ({ search = "" }) => {
        try {
          let languages = processLanguages();

          if (search) {
            const searchLower = search.toLowerCase();
            languages = languages.filter(
              (lang) =>
                lang.name.toLowerCase().includes(searchLower) ||
                lang.code.toLowerCase().includes(searchLower) ||
                (lang.nativeName &&
                  lang.nativeName.toLowerCase().includes(searchLower)),
            );
          }

          return {
            data: {
              languages,
              total: languages.length,
            },
          };
        } catch (error) {
          return {
            error: { message: "Failed to process languages data", status: 500 },
          };
        }
      },
      providesTags: (result) =>
        result ? [{ type: "Languages", id: "LIST" }] : [],
    }),

    getCountryByCode: builder.query<Country | undefined, string>({
      queryFn: (code) => {
        try {
          const countries = processCountries();
          const country = countries.find((c) => c.countryCode === code);
          return { data: country };
        } catch (error) {
          return { error: { message: "Country not found", status: 404 } };
        }
      },
      providesTags: (result, error, code) => [{ type: "Countries", id: code }],
    }),

    getCurrencyByCode: builder.query<Currency | undefined, string>({
      queryFn: (code) => {
        try {
          const countries = processCountries();
          const currencies = processCurrencies(countries);
          const currency = currencies.find((c) => c.code === code);
          return { data: currency };
        } catch (error) {
          return { error: { message: "Currency not found", status: 404 } };
        }
      },
      providesTags: (result, error, code) => [{ type: "Currencies", id: code }],
    }),

    getLanguageByCode: builder.query<Language | undefined, string>({
      queryFn: (code) => {
        try {
          const languages = processLanguages();
          const language = languages.find((l) => l.code === code);
          return { data: language };
        } catch (error) {
          return { error: { message: "Language not found", status: 404 } };
        }
      },
      providesTags: (result, error, code) => [{ type: "Languages", id: code }],
    }),
  }),
});

// Export hooks
export const {
  useGetCountriesQuery,
  useGetCurrenciesQuery,
  useGetLanguagesQuery,
  useGetCountryByCodeQuery,
  useGetCurrencyByCodeQuery,
  useGetLanguageByCodeQuery,
  useLazyGetCountriesQuery,
  useLazyGetCurrenciesQuery,
  useLazyGetLanguagesQuery,
} = countryDataPicker;
