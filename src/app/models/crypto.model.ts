export interface Crypto {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  image: string;
}

export interface CryptoHistory {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}