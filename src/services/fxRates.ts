// Enhanced FX rates service with caching and error handling
interface FXRates {
  USD_GBP: number;
  USD_ZAR: number;
  timestamp: number;
}

interface CachedRates {
  rates: FXRates;
  lastFetched: number;
}

// Cache config
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Mock data that simulates real FX rates
const mockRates: FXRates = {
  USD_GBP: 0.79,  // 1 USD = 0.79 GBP
  USD_ZAR: 18.45, // 1 USD = 18.45 ZAR
  timestamp: Date.now()
};

// In-memory cache
let ratesCache: CachedRates | null = null;
let isFetching = false;
let fetchPromise: Promise<FXRates> | null = null;

const isCacheValid = (): boolean => {
  if (!ratesCache) return false;
  const now = Date.now();
  return (now - ratesCache.lastFetched) < CACHE_DURATION;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// i'm gonna use the mock api for now, just for the interview, but this can be substituted with a real api and yotoshanda still
const REAL_API_URL = 'https://68976304250b078c2041c7fc.mockapi.io/api/wiremit/InterviewAPIS';

const fetchRealFXRates = async (): Promise<FXRates> => {
  const response = await fetch(REAL_API_URL);
  if (!response.ok) throw new Error('Failed to fetch real FX rates');
  const data = await response.json();

  let USD = 1, GBP = 0.74, ZAR = 17.75;
  for (const entry of data) {
    if (entry.USD) USD = entry.USD;
    if (entry.GBP) GBP = entry.GBP;
    if (entry.ZAR) ZAR = entry.ZAR;
  }
  return {
    USD_GBP: GBP, // 1 USD = GBP
    USD_ZAR: ZAR, // 1 USD = ZAR
    timestamp: Date.now()
  };
};

const fetchRatesWithRetry = async (retryCount = 0): Promise<FXRates> => {
  try {
    // Try real API first
    const realRates = await fetchRealFXRates();
    return realRates;
  } catch (error) {
    // Fallback to mock
    if (retryCount < MAX_RETRIES) {
      console.warn(`FX rates fetch failed, retrying... (${retryCount + 1}/${MAX_RETRIES})`);
      await sleep(RETRY_DELAY * (retryCount + 1));
      return fetchRatesWithRetry(retryCount + 1);
    }
    // If all retries fail, fallback to mock
    console.error('Falling back to mock FX rates:', error);
    // Simulate API call delay
    await sleep(1000);
    const fluctuation = 0.02;
    return {
      USD_GBP: mockRates.USD_GBP * (1 + (Math.random() - 0.5) * fluctuation),
      USD_ZAR: mockRates.USD_ZAR * (1 + (Math.random() - 0.5) * fluctuation),
      timestamp: Date.now()
    };
  }
};

export const fetchFXRates = async (): Promise<FXRates> => {
  // Return cached rates if still valid
  if (isCacheValid() && ratesCache) {
    return ratesCache.rates;
  }

  // If already fetching, wait for the existing promise
  if (isFetching && fetchPromise) {
    return fetchPromise;
  }

  // Start new fetch
  isFetching = true;
  fetchPromise = fetchRatesWithRetry();

  try {
    const newRates = await fetchPromise;
    
    // Update cache
    ratesCache = {
      rates: newRates,
      lastFetched: Date.now()
    };
    
    return newRates;
  } finally {
    isFetching = false;
    fetchPromise = null;
  }
};

export const getCachedRates = (): FXRates | null => {
  return isCacheValid() ? ratesCache?.rates || null : null;
};

export const getLastUpdated = (): Date | null => {
  return ratesCache ? new Date(ratesCache.lastFetched) : null;
};

export const clearCache = (): void => {
  ratesCache = null;
};

export const calculateConversion = (
  amountUSD: number,
  targetCurrency: 'GBP' | 'ZAR',
  rates: FXRates
): { convertedAmount: number; fee: number; totalReceived: number; feePercentage: number } => {
  const feePercentage = targetCurrency === 'GBP' ? 0.10 : 0.20; // 10% for GBP, 20% for ZAR
  let fee = amountUSD * feePercentage;
  // Always round UP to nearest cent
  fee = Math.ceil(fee * 100) / 100;
  const amountAfterFee = amountUSD - fee;
  const exchangeRate = targetCurrency === 'GBP' ? rates.USD_GBP : rates.USD_ZAR;
  let convertedAmount = amountAfterFee * exchangeRate;
  // Always round UP to nearest cent
  convertedAmount = Math.ceil(convertedAmount * 100) / 100;
  return {
    convertedAmount,
    fee,
    totalReceived: convertedAmount,
    feePercentage: feePercentage * 100
  };
};

// Utility function to format exchange rate for display
export const formatExchangeRate = (rate: number, currency: 'GBP' | 'ZAR'): string => {
  const symbol = currency === 'GBP' ? '£' : 'R';
  const decimals = currency === 'GBP' ? 4 : 2;
  return `${symbol}${rate.toFixed(decimals)}`;
};

// Utility function to get rate age in minutes
export const getRateAge = (timestamp: number): number => {
  const now = Date.now();
  return Math.floor((now - timestamp) / (1000 * 60));
};