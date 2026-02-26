import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useGetCountriesQuery,
  useGetCurrenciesQuery,
  useGetLanguagesQuery,
  useLazyGetCountriesQuery,
  useLazyGetCurrenciesQuery,
  useLazyGetLanguagesQuery,
} from "../services/countryDataPicker";
import { Country, Currency, Language } from "../type/thepicker";

interface UseCountryDataPickerReturn {
  // Countries
  countries: Country[];
  popularCountries: Country[];
  isLoadingCountries: boolean;
  isFetchingCountries: boolean;
  isSearchingCountries: boolean;
  hasMoreCountries: boolean;
  loadMoreCountries: () => void;
  setCountrySearch: (search: string) => void;
  countrySearchTerm: string;
  totalCountries: number;

  // Currencies
  currencies: Currency[];
  isLoadingCurrencies: boolean;
  setCurrencySearch: (search: string) => void;
  currencySearchTerm: string;
  totalCurrencies: number;

  // Languages
  languages: Language[];
  isLoadingLanguages: boolean;
  setLanguageSearch: (search: string) => void;
  languageSearchTerm: string;
  totalLanguages: number;

  // Error states
  countriesError: any;
  currenciesError: any;
  languagesError: any;

  // Refetch functions
  refetchCountries: () => void;
  refetchCurrencies: () => void;
  refetchLanguages: () => void;
}

export const useCountryDataPicker = (): UseCountryDataPickerReturn => {
  // Search states
  const [countrySearch, setCountrySearch] = useState("");
  const [currencySearch, setCurrencySearch] = useState("");
  const [languageSearch, setLanguageSearch] = useState("");

  // Pagination states
  const [countryPage, setCountryPage] = useState(1);
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 50;

  // Countries query with search and pagination
  const {
    data: countriesData,
    isLoading: isLoadingCountries,
    isFetching: isFetchingCountries,
    error: countriesError,
    refetch: refetchCountries,
  } = useGetCountriesQuery({
    search: countrySearch,
    page: countryPage,
    limit: pageSize,
  });

  // Lazy queries for search
  const [triggerCountriesSearch] = useLazyGetCountriesQuery();
  const [triggerCurrenciesSearch] = useLazyGetCurrenciesQuery();
  const [triggerLanguagesSearch] = useLazyGetLanguagesQuery();

  // Currencies query
  const {
    data: currenciesData,
    isLoading: isLoadingCurrencies,
    error: currenciesError,
    refetch: refetchCurrencies,
  } = useGetCurrenciesQuery({ search: currencySearch });

  // Languages query
  const {
    data: languagesData,
    isLoading: isLoadingLanguages,
    error: languagesError,
    refetch: refetchLanguages,
  } = useGetLanguagesQuery({ search: languageSearch });

  // Update countries list when data changes
  useEffect(() => {
    if (countriesData) {
      if (countryPage === 1) {
        setAllCountries(countriesData.countries);
      } else {
        setAllCountries((prev) => [...prev, ...countriesData.countries]);
      }
      setHasMore(countriesData.countries.length === pageSize);
    }
  }, [countriesData, countryPage]);

  // Handle search with debounce
  const debouncedSetCountrySearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (search: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setCountrySearch(search);
        setCountryPage(1);
        setAllCountries([]);
      }, 300);
    };
  }, []);

  const debouncedSetCurrencySearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (search: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setCurrencySearch(search);
      }, 300);
    };
  }, []);

  const debouncedSetLanguageSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (search: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setLanguageSearch(search);
      }, 300);
    };
  }, []);

  // Load more countries
  const loadMoreCountries = useCallback(() => {
    if (hasMore && !isFetchingCountries) {
      setCountryPage((prev) => prev + 1);
    }
  }, [hasMore, isFetchingCountries]);

  // Determine if searching
  const isSearchingCountries = useMemo(
    () => countrySearch.length > 0 && isFetchingCountries,
    [countrySearch, isFetchingCountries],
  );

  return {
    // Countries
    countries: allCountries,
    popularCountries: countriesData?.popularCountries || [],
    isLoadingCountries,
    isFetchingCountries,
    isSearchingCountries,
    hasMoreCountries: hasMore,
    loadMoreCountries,
    setCountrySearch: debouncedSetCountrySearch,
    countrySearchTerm: countrySearch,
    totalCountries: countriesData?.total || 0,

    // Currencies
    currencies: currenciesData?.currencies || [],
    isLoadingCurrencies,
    setCurrencySearch: debouncedSetCurrencySearch,
    currencySearchTerm: currencySearch,
    totalCurrencies: currenciesData?.total || 0,

    // Languages
    languages: languagesData?.languages || [],
    isLoadingLanguages,
    setLanguageSearch: debouncedSetLanguageSearch,
    languageSearchTerm: languageSearch,
    totalLanguages: languagesData?.total || 0,

    // Error states
    countriesError,
    currenciesError,
    languagesError,

    // Refetch functions
    refetchCountries,
    refetchCurrencies,
    refetchLanguages,
  };
};
