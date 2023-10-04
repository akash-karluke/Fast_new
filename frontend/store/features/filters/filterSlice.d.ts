export interface filterProps {
  globalDivision: Array<string> | 'LOADING' | 'NONE_FOUND';
  region: Array<string> | 'LOADING' | 'NONE_FOUND';
  country: Array<string> | 'LOADING' | 'NONE_FOUND';
  category: Array<string> | 'LOADING' | 'NONE_FOUND';
  retailer: Array<string> | 'LOADING' | 'NONE_FOUND';
  allStores: Array<string> | 'LOADING' | 'NONE_FOUND';
  timeRange: { startDate: string; endDate: string };
}
