export interface Country {
  countryCode: string;
  countryName: string;
  currency: string;
  flagEmoji: string;
  flag?: string;
  countryCodePhone?: string;
}

export interface Currency {
  code: string;
  name: string;
  countries: string[];
  symbol: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface PopularCountry extends Country {
  isPopular?: boolean;
}

export interface CountriesResponse {
  countries: Country[];
  popularCountries: Country[];
  total: number;
  page: number;
  limit: number;
}

export interface CurrenciesResponse {
  currencies: Currency[];
  total: number;
}

export interface LanguagesResponse {
  languages: Language[];
  total: number;
}
