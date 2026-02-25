import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useGetAllCountriesQuery,
  useGetAllCurrenciesQuery,
  useGetAllLanguagesQuery,
  useGetPopularCountriesQuery,
  useSearchCountriesQuery,
  useSearchLanguagesQuery,
} from "../redux/json/AditionalDataApi";

export const useProfileData = () => {
  const [countrySearch, setCountrySearch] = useState("");
  const [currencySearch, setCurrencySearch] = useState("");
  const [languageSearch, setLanguageSearch] = useState("");
  const [countryPage, setCountryPage] = useState(1);

  // Refs for debouncing
  const countryTimeoutRef = useRef<NodeJS.Timeout>();
  const currencyTimeoutRef = useRef<NodeJS.Timeout>();
  const languageTimeoutRef = useRef<NodeJS.Timeout>();

  // Fetch popular countries
  const { data: popularCountries = [], isLoading: popularLoading } =
    useGetPopularCountriesQuery(undefined, {
      refetchOnMountOrArgChange: false,
    });

  // Fetch all countries with pagination
  const {
    data: countriesData,
    isLoading: countriesLoading,
    isFetching: countriesFetching,
  } = useGetAllCountriesQuery(
    {
      page: countryPage,
      limit: 20,
      search: countrySearch,
    },
    {
      skip: countrySearch.length >= 2,
    },
  );

  // Search countries
  const { data: searchResults = [], isFetching: searchFetching } =
    useSearchCountriesQuery(countrySearch, {
      skip: countrySearch.length < 2,
    });

  // Fetch all currencies
  const { data: currencies = [], isLoading: currenciesLoading } =
    useGetAllCurrenciesQuery(
      { search: currencySearch },
      {
        skip: currencySearch.length >= 2,
      },
    );

  // Fetch all languages
  const { data: languages = [], isLoading: languagesLoading } =
    useGetAllLanguagesQuery(
      { search: languageSearch },
      {
        skip: languageSearch.length >= 2,
      },
    );

  // Search languages
  const {
    data: languageSearchResults = [],
    isFetching: languageSearchFetching,
  } = useSearchLanguagesQuery(languageSearch, {
    skip: languageSearch.length < 2,
  });

  // Debounced country search
  const handleCountrySearch = useCallback((text: string) => {
    if (countryTimeoutRef.current) {
      clearTimeout(countryTimeoutRef.current);
    }

    countryTimeoutRef.current = setTimeout(() => {
      setCountrySearch(text);
      if (text.length >= 2) {
        setCountryPage(1);
      }
    }, 300);
  }, []);

  // Debounced currency search
  const handleCurrencySearch = useCallback((text: string) => {
    if (currencyTimeoutRef.current) {
      clearTimeout(currencyTimeoutRef.current);
    }

    currencyTimeoutRef.current = setTimeout(() => {
      setCurrencySearch(text);
    }, 300);
  }, []);

  // Debounced language search
  const handleLanguageSearch = useCallback((text: string) => {
    if (languageTimeoutRef.current) {
      clearTimeout(languageTimeoutRef.current);
    }

    languageTimeoutRef.current = setTimeout(() => {
      setLanguageSearch(text);
    }, 300);
  }, []);

  // Clear searches
  const clearCountrySearch = useCallback(() => {
    setCountrySearch("");
    if (countryTimeoutRef.current) {
      clearTimeout(countryTimeoutRef.current);
    }
  }, []);

  const clearCurrencySearch = useCallback(() => {
    setCurrencySearch("");
    if (currencyTimeoutRef.current) {
      clearTimeout(currencyTimeoutRef.current);
    }
  }, []);

  const clearLanguageSearch = useCallback(() => {
    setLanguageSearch("");
    if (languageTimeoutRef.current) {
      clearTimeout(languageTimeoutRef.current);
    }
  }, []);

  // Load more countries
  const loadMoreCountries = useCallback(() => {
    if (countriesData?.hasMore && !countriesFetching && !searchFetching) {
      setCountryPage((prev) => prev + 1);
    }
  }, [countriesData?.hasMore, countriesFetching, searchFetching]);

  // Reset page on search
  useEffect(() => {
    if (countrySearch.length >= 2) {
      setCountryPage(1);
    }
  }, [countrySearch]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (countryTimeoutRef.current) clearTimeout(countryTimeoutRef.current);
      if (currencyTimeoutRef.current) clearTimeout(currencyTimeoutRef.current);
      if (languageTimeoutRef.current) clearTimeout(languageTimeoutRef.current);
    };
  }, []);

  // Get display countries
  const displayCountries = useMemo(() => {
    if (countrySearch.length >= 2) {
      return searchResults;
    }

    if (
      countryPage === 1 &&
      (!countriesData?.items || countriesData.items.length === 0)
    ) {
      return popularCountries;
    }

    return countriesData?.items || [];
  }, [
    countrySearch,
    searchResults,
    countriesData,
    popularCountries,
    countryPage,
  ]);

  // Get display languages
  const displayLanguages = useMemo(() => {
    if (languageSearch.length >= 2) {
      return languageSearchResults;
    }
    return languages;
  }, [languageSearch, languageSearchResults, languages]);

  return {
    // Countries
    countries: displayCountries,
    popularCountries,
    isLoadingCountries: countriesLoading || popularLoading,
    isFetchingCountries: countriesFetching,
    isSearchingCountries: searchFetching,
    hasMoreCountries: !countrySearch && countriesData?.hasMore,
    loadMoreCountries,
    setCountrySearch: handleCountrySearch,
    clearCountrySearch,
    countrySearchTerm: countrySearch,

    // Currencies
    currencies,
    isLoadingCurrencies: currenciesLoading,
    setCurrencySearch: handleCurrencySearch,
    clearCurrencySearch,
    currencySearchTerm: currencySearch,

    // Languages
    languages: displayLanguages,
    isLoadingLanguages: languagesLoading,
    isFetchingLanguages: languageSearchFetching,
    setLanguageSearch: handleLanguageSearch,
    clearLanguageSearch,
    languageSearchTerm: languageSearch,
  };
};
