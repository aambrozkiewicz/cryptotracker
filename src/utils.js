export const fetchLatestPrice = async (pair = "BTCEUR") => {
  const response = await fetch(
    `https://api.binance.com/api/v1/ticker/price?symbol=${pair}`
  );
  return response.json();
};

export function generateId() {
  return new Date().valueOf();
}
