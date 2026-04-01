export type Config = {
  baseUrl: string;
  header: string;
  updateInterval: number;
  blacklist: string[];
  whitelist: string[];
  maxEntries: number;
  locale: string;
};
