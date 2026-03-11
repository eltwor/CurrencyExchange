const BASE_URL = "https://api.frankfurter.dev/v1"; // darmowe API bez klucza

export const currencyApi = {
  getCurrencies: async () => {
    const response = await fetch(`${BASE_URL}/currencies`);
    if (!response.ok) {
      throw new Error("Couldn't fetch the currencies");
    }
    return response.json();
  },
  calculateTransfer: async (
    fromCurrency: string,
    toCurrency: string
  ) => {
    if (!fromCurrency || !toCurrency) {
      throw new Error("No selected currency");
    } else {
      const response = await fetch(
        `${BASE_URL}/latest?base=${fromCurrency}&symbols=${toCurrency}`,
      );
      if (!response.ok) {
        throw new Error("Couldn't fetch calculate rates");
      }
      return response.json();
    }
  },
  historicaldata: async (
    fromCurrency: string,
    toCurrency: string,
  ) => {
    
    if (!fromCurrency || !toCurrency) {
      throw new Error("No selected currency");
    } else {
        const fromDate = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) // 6 months * 30 day * ... = miliseconds\
        const formattedDate =  fromDate.toISOString().split('T')[0]
        const response = await fetch(`${BASE_URL}/${formattedDate}..?symbols=${toCurrency}&base=${fromCurrency}`);
        return response.json();
    }
  }
};
