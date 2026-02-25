import {
  countryMaps,
  CURRENCY_NAMES,
  languageMaps,
  POPULAR_COUNTRIES,
  processedCountries,
  processedLanguages,
} from "@/assets/data/preprocessedData";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Countries", "Languages", "Currencies"],
  endpoints: (builder) => ({
    // Get all countries with pagination
    getAllCountries: builder.query({
      queryFn: ({ page = 1, limit = 20, search = "" }) => {
        try {
          let filtered = processedCountries;

          if (search && search.length >= 2) {
            const term = search.toLowerCase();
            filtered = processedCountries.filter(
              (c) =>
                c.countryName.toLowerCase().includes(term) ||
                c.currency.toLowerCase().includes(term),
            );
          }

          const start = (page - 1) * limit;
          const paginated = filtered.slice(start, start + limit);

          return {
            data: {
              items: paginated,
              total: filtered.length,
              page,
              totalPages: Math.ceil(filtered.length / limit),
              hasMore: start + limit < filtered.length,
            },
          };
        } catch (error) {
          return { error: { message: "Failed to fetch countries" } };
        }
      },
      providesTags: ["Countries"],
    }),

    // Search countries
    searchCountries: builder.query({
      queryFn: (searchTerm: string) => {
        try {
          if (!searchTerm || searchTerm.length < 2) return { data: [] };

          const term = searchTerm.toLowerCase();

          // Check cache
          if (countryMaps.searchIndex.has(term)) {
            return { data: countryMaps.searchIndex.get(term) || [] };
          }

          // Perform search
          const results = processedCountries.filter(
            (country) =>
              country.countryName.toLowerCase().includes(term) ||
              country.currency.toLowerCase().includes(term),
          );

          // Cache results
          if (countryMaps.searchIndex.size < 50) {
            countryMaps.searchIndex.set(term, results);
          }

          return { data: results };
        } catch (error) {
          return { error: { message: "Failed to search countries" } };
        }
      },
    }),

    // Get all currencies
    getAllCurrencies: builder.query({
      queryFn: ({ search = "" }) => {
        try {
          const currencyMap = new Map();

          processedCountries.forEach((country) => {
            if (!currencyMap.has(country.currency)) {
              currencyMap.set(country.currency, {
                code: country.currency,
                name: CURRENCY_NAMES[country.currency] || country.currency,
                countries: [country.countryName],
                flag: country.flagEmoji,
              });
            } else {
              currencyMap
                .get(country.currency)
                .countries.push(country.countryName);
            }
          });

          let currencies = Array.from(currencyMap.values());

          if (search && search.length >= 2) {
            const term = search.toLowerCase();
            currencies = currencies.filter(
              (c) =>
                c.code.toLowerCase().includes(term) ||
                c.name.toLowerCase().includes(term),
            );
          }

          return {
            data: currencies.sort((a, b) => a.code.localeCompare(b.code)),
          };
        } catch (error) {
          return { error: { message: "Failed to fetch currencies" } };
        }
      },
      providesTags: ["Currencies"],
    }),

    // Get popular countries
    getPopularCountries: builder.query({
      queryFn: () => {
        try {
          const results = processedCountries.filter((c) =>
            POPULAR_COUNTRIES.includes(c.countryName),
          );
          return { data: results };
        } catch (error) {
          return { error: { message: "Failed to fetch popular countries" } };
        }
      },
      providesTags: ["Countries"],
    }),

    // Get all languages
    getAllLanguages: builder.query({
      queryFn: ({ search = "" }) => {
        try {
          let languages = processedLanguages;

          if (search && search.length >= 2) {
            const term = search.toLowerCase();
            languages = processedLanguages.filter(
              (l) =>
                l.name.toLowerCase().includes(term) ||
                l.code.toLowerCase().includes(term) ||
                (l.nativeName && l.nativeName.toLowerCase().includes(term)),
            );
          }

          return { data: languages };
        } catch (error) {
          return { error: { message: "Failed to fetch languages" } };
        }
      },
      providesTags: ["Languages"],
    }),

    // Search languages
    searchLanguages: builder.query({
      queryFn: (searchTerm: string) => {
        try {
          if (!searchTerm || searchTerm.length < 2) return { data: [] };

          const term = searchTerm.toLowerCase();

          if (languageMaps.searchIndex.has(term)) {
            return { data: languageMaps.searchIndex.get(term) || [] };
          }

          const results = processedLanguages.filter(
            (lang) =>
              lang.name.toLowerCase().includes(term) ||
              lang.code.toLowerCase().includes(term) ||
              (lang.nativeName && lang.nativeName.toLowerCase().includes(term)),
          );

          if (languageMaps.searchIndex.size < 30) {
            languageMaps.searchIndex.set(term, results);
          }

          return { data: results };
        } catch (error) {
          return { error: { message: "Failed to search languages" } };
        }
      },
    }),
  }),
});

export const {
  useGetAllCountriesQuery,
  useSearchCountriesQuery,
  useGetAllCurrenciesQuery,
  useGetPopularCountriesQuery,
  useGetAllLanguagesQuery,
  useSearchLanguagesQuery,
} = profileApi;
