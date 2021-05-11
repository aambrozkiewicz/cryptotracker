export const fetchLatestPrice = async (pair = "BTCEUR") => {
  const response = await fetch(
    `https://api.binance.com/api/v1/ticker/price?symbol=${pair}`
  );
  return response.json();
};

export function generateId() {
  return new Date().valueOf();
}

export const COINPAPRIKA_COIN_ID = {
  BTCEUR: "btc-bitcoin",
  ETHEUR: "eth-ethereum",
  ETCEUR: "etc-ethereum-classic",
  DOGEEUR: "doge-dogecoin",
};

export const fetchCoinpaprika = async (coinId, quotes = ["EUR"]) => {
  const quotesParam = quotes.join(",");
  const response = await fetch(
    `https://api.coinpaprika.com/v1/tickers/${coinId}?quotes=${quotesParam}`
  );
  return response.json();
};
