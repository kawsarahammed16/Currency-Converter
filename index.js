const axios = require("axios");

// https://fixer.io/
const FIXER_API_KEY = "f9d15c7708-106bd29bbd-r8fure";
const FIXER_API = `https://api.fastforex.io/fetch-all?api_key=${FIXER_API_KEY}`;

// https://restcountries.com
const REST_COUNTRIES_API = `https://restcountries.com/v3.1/currency`;

// Fetch data about currencies
const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const {
      data: { results },
    } = await axios.get(FIXER_API);

    const usd = 1 / results[fromCurrency];
    const exchangeRate = usd * results[toCurrency];

    return exchangeRate;
  } catch (error) {
    throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
  }
};

const getCountries = async (toCurrency) => {
  try {
    const { data } = await axios.get(`${REST_COUNTRIES_API}/${toCurrency}`);
    return data.map((country) => country.name.common);
  } catch (error) {
    throw new Error(`Unable to get countries that is ${toCurrency}`);
  }
};

const covertCurrency = async (fromCurrency, toCurrency, amount) => {
  fromCurrency = fromCurrency.toUpperCase();
  toCurrency = toCurrency.toUpperCase();

  const [exchangeRate, countries] = await Promise.all([
    getExchangeRate(fromCurrency, toCurrency),
    getCountries(toCurrency),
  ]);

  const convertedAmount = (amount * exchangeRate).toFixed(2);

  return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.
You can spend these in the following countries: ${countries}.`;
};

/* covertCurrency("USD", "AUD", 20)
  .then((result) => console.log(result))
  .catch((error) => console.log(error)); */
// Output Data
