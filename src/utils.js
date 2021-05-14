export function generateId() {
  return new Date().valueOf();
}

export const fetchBinance = async (pair = "BTCEUR") => {
  const response = await fetch(
    `https://api.binance.com/api/v1/ticker/price?symbol=${pair}`
  );
  return response.json();
};

export const COINPAPRIKA_COIN_ID = {
  BTC: "btc-bitcoin",
  ETH: "eth-ethereum",
  ETC: "etc-ethereum-classic",
  DOGE: "doge-dogecoin",
  BCH: "bch-bitcoin-cash",
};

export const fetchCoinpaprika = async (coinId, quotes = ["EUR"]) => {
  const quotesParam = quotes.join(",");
  const response = await fetch(
    `https://api.coinpaprika.com/v1/tickers/${coinId}?quotes=${quotesParam}`
  );
  return response.json();
};
