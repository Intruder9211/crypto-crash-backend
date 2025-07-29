const axios = require("axios");
let cachedPrices = {};
let lastFetchTime = 0;

const fetchPrices = async () => {
  const now = Date.now();
  if (now - lastFetchTime < 10000 && cachedPrices) return cachedPrices;

  const { data } = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
  );
  lastFetchTime = now;
  cachedPrices = {
    BTC: data.bitcoin.usd,
    ETH: data.ethereum.usd,
  };
  return cachedPrices;
};

module.exports = { fetchPrices };
