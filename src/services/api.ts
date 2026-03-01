const BASE_URL = 'https://api.frankfurter.dev/v1'; // darmowe API bez klucza

export const currencyApi = {
    getCurrencies: async () => {
        const response = await fetch(`${BASE_URL}/currencies`)
        if(!response.ok) { throw new Error('Couldn\'t fetch the currencies')}
       return response.json();
    }
}