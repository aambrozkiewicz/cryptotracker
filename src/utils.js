export function generateId() {
  return new Date().valueOf();
}

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

const intervals = [
  { label: "year", seconds: 31536000 },
  { label: "month", seconds: 2592000 },
  { label: "day", seconds: 86400 },
  { label: "hour", seconds: 3600 },
  { label: "minute", seconds: 60 },
  { label: "second", seconds: 1 },
];

export function timeSince(seconds) {
  const interval = intervals.find((i) => i.seconds < seconds);
  if (interval) {
    const count = Math.floor(seconds / interval.seconds);
    return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
  } else {
    return "just now";
  }
}
