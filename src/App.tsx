import { useState, useEffect } from "react";
import { currencyApi } from "./services/api";
function App() {
  const [currencies, setCurrencies] = useState<Record<string, string> | null>(
    null,
  );
  const [isFetching, setIsFetching] = useState<Boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedCurrency,setSelectedCurrency] = useState<string>('');
  useEffect(() => {
    const fetchCurrencies = async () => {
      const data = await currencyApi.getCurrencies();
      // console.log(Object.entries(data)[0][0]);
      setCurrencies(data);

      const defaultCode = data?.EUR ? 'EUR' : Object.keys(data ?? {})[0] ?? '';
      if (defaultCode) setSelectedCurrency(defaultCode);
    };
    fetchCurrencies();
  }, []);

  if (currencies) {
    let currencyArray = Object.entries(currencies);
  }

  const changedSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(e.target.value);
  }
  const changedNumber = (e) => {
    console.log(e.target.value);
  }
  return (
    <>
    {/* This is the conversion fragments */}
    <div> 
      <div className="border-2 border-solid border-red-300">
        <label className="text-green-600 text-lg font-semibold">
          From Currency {selectedCurrency}
        </label>
        <div className="mt-2 text-gray-500">
            <select onChange={changedSelect} value={selectedCurrency}>
              {currencies &&
                Object.entries(currencies).map(([code, name]) => (
                  <option
                    key={code} value={code}>
                    {name}
                  </option>
                ))}
            </select>
          <input
            className="bg-transparent outline-none border focus:border-blue-400 focus:ring-1 focus:ring-inset focus:ring-blue-400 shadow-sm rounded-lg"
            placeholder="0.00"
            type="number"
            onChange={changedNumber}
          />
        </div>
      </div>
      
       <div className="border-2 border-solid border-red-300">
        <label className="text-green-600 text-lg font-semibold">
          To Currency {selectedCurrency}
        </label>
        <div className="mt-2 text-gray-500">
            <select className="text-md outline-none rounded-lg h-full px-2 cursor-pointer font-semibold tracking-wide bg-transparent">
              <option key={0} value={''}>Pick currency</option>
              {currencies &&
                Object.entries(currencies).map(([code, name]) => (
                  <option
                    key={code} value={code}>
                    {name}
                  </option>
                ))}
            </select>
          <input
            className="bg-transparent outline-none border focus:border-blue-400 focus:ring-1 focus:ring-inset focus:ring-blue-400 shadow-sm rounded-lg"
            placeholder="0.00"
            type="text"
          />
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
function fetchData(): import("react").DependencyList | undefined {
  throw new Error("Function not implemented.");
}
