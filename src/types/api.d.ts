/**
 * Discord webhooks.
 *
 * @since 1.0.0
 */
export type ApiDiscordWebhookMessage = string | undefined;

export type ApiDiscordWebhookCode = number | undefined;

export type ApiDiscordWebhook = {
  message: ApiDiscordWebhookMessage;
  code: ApiDiscordWebhookCode;
} | '';

/**
 * Etherscan gas oracle.
 *
 * @since 1.0.0
 */
export type ApiEtherscanGasOracleStatus = string;

export type ApiEtherscanGasOracleMessage = string;

export type ApiEtherscanGasOracleResultSafeGasPrice = string;

export type ApiEtherscanGasOracleResultProposeGasPrice = string;

export type ApiEtherscanGasOracleResultFastGasPrice = string;

export type ApiEtherscanGasOracleResult = {
  SafeGasPrice: ApiEtherscanGasOracleResultSafeGasPrice;
  ProposeGasPrice: ApiEtherscanGasOracleResultProposeGasPrice;
  FastGasPrice: ApiEtherscanGasOracleResultFastGasPrice;
};

export type ApiEtherscanGasOracle = {
  status: ApiEtherscanGasOracleStatus;
  message: ApiEtherscanGasOracleMessage;
  result: ApiEtherscanGasOracleResult;
}

/**
 * Finnhub earnings.
 *
 * @since 1.0.0
 */
export type ApiFinnhubEarningsEventDate = string;

export type ApiFinnhubEarningsEventEpsActual = number | null;

export type ApiFinnhubEarningsEventEpsEstimate = number | null;

export type ApiFinnhubEarningsEventHour = 'bmo' | 'amc' | 'dmh' | '';

export type ApiFinnhubEarningsEventQuarter = 1 | 2 | 3 | 4;

export type ApiFinnhubEarningsEventRevenueActual = number | null;

export type ApiFinnhubEarningsEventRevenueEstimate = number | null;

export type ApiFinnhubEarningsEventSymbol = string;

export type ApiFinnhubEarningsEventYear = number;

export type ApiFinnhubEarningsEvent = {
  date: ApiFinnhubEarningsEventDate;
  epsActual: ApiFinnhubEarningsEventEpsActual;
  epsEstimate: ApiFinnhubEarningsEventEpsEstimate;
  hour: ApiFinnhubEarningsEventHour;
  quarter: ApiFinnhubEarningsEventQuarter;
  revenueActual: ApiFinnhubEarningsEventRevenueActual;
  revenueEstimate: ApiFinnhubEarningsEventRevenueEstimate;
  symbol: ApiFinnhubEarningsEventSymbol;
  year: ApiFinnhubEarningsEventYear;
};

export type ApiFinnhubEarningsEvents = ApiFinnhubEarningsEvent[] | undefined;

export type ApiFinnhubEarnings = {
  economicCalendar: ApiFinnhubEarningsEvents;
};

/**
 * Google reCAPTCHA verify.
 *
 * @since 1.0.0
 */
export type ApiGoogleRecaptchaVerifySuccess = boolean;

export type ApiGoogleRecaptchaVerifyErrorCode = string | undefined;

export type ApiGoogleRecaptchaVerifyErrorCodes = ApiGoogleRecaptchaVerifyErrorCode[] | undefined;

export type ApiGoogleRecaptchaVerify = {
  success: ApiGoogleRecaptchaVerifySuccess;
  'error-codes': ApiGoogleRecaptchaVerifyErrorCodes;
}

/**
 * Stocktwits trending.
 *
 * @since 1.0.0
 */
export type ApiStocktwitsTrendingResponseStatus = number;

export type ApiStocktwitsTrendingResponse = {
  status: ApiStocktwitsTrendingResponseStatus;
};

export type ApiStocktwitsTrendingSymbolSymbol = string;

export type ApiStocktwitsTrendingSymbolWatchlistCount = number;

export type ApiStocktwitsTrendingSymbol = {
  symbol: ApiStocktwitsTrendingSymbolSymbol;
  watchlist_count: ApiStocktwitsTrendingSymbolWatchlistCount;
};

export type ApiStocktwitsTrendingSymbols = ApiStocktwitsTrendingSymbol[] | undefined;

export type ApiStocktwitsTrending = {
  response: ApiStocktwitsTrendingResponse;
  symbols: ApiStocktwitsTrendingSymbols;
};
