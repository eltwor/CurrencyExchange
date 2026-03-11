import { useState, useEffect } from "react";
import { currencyApi } from "./services/api";
import CurrencyPicker from "./components/CurrencyPicker";
import CurrencyChart from "./components/CurrencyChart";

function App() {
  const [currencies, setCurrencies] = useState<Record<string, string> | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [fromCurrency, setFromCurrency] = useState<string>("");
  const [toCurrency, setToCurrency] = useState<string>("");
  const [fromAmount, setFromAmount] = useState<number>(0.0);
  const [toAmount, setToAmount] = useState<number>(0.0);

  useEffect(() => {
    setIsFetching(true);
    const fetchCurrencies = async () => {
      try {
        const data = await currencyApi.getCurrencies();
        setCurrencies(data);

        const defaultFromCur = data?.EUR ? "EUR" : (Object.keys(data ?? {})[0] ?? "");
        if (defaultFromCur) setFromCurrency(defaultFromCur);

        const defaultToCur = data?.PLN ? "PLN" : (Object.keys(data ?? {})[1] ?? "");
        if (defaultToCur) setToCurrency(defaultToCur);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsFetching(false);
      }
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (!fromCurrency || !toCurrency || !currencies) return;

    const calculateTransferAmount = async () => {
      try {
        if (fromCurrency === toCurrency) {
          setToAmount(fromAmount);
        } else {
          const data = await currencyApi.calculateTransfer(fromCurrency, toCurrency);
          const conversionRate: number = Object.entries(data.rates)[0][1] as number;
          setToAmount(fromAmount * conversionRate);
        }
      } catch (err) {
        setError((err as Error).message);
      }
    };
    calculateTransferAmount();
  }, [fromCurrency, toCurrency, fromAmount, currencies]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <h1 className="text-sm font-semibold tracking-widest uppercase text-gray-400">
            FX Exchange
          </h1>
          <span className="ml-auto text-xs text-gray-600 tracking-wider">
            {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isFetching ? (
          <div className="flex items-center justify-center h-64 gap-3 text-gray-500">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0ms]" />
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:150ms]" />
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        ) : error ? (
          <div className="text-red-400 text-sm border border-red-900 bg-red-950/30 rounded-lg px-4 py-3">
            {error}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">

            {/* Left column — currency pickers */}
            <div className="flex flex-col gap-3 md:w-72 shrink-0">
              <p className="text-xs tracking-widest uppercase text-gray-600 mb-1">Convert</p>

              <CurrencyPicker
                label="From"
                currencies={currencies}
                selectedCurrency={fromCurrency}
                amount={fromAmount}
                changeSelection={(c) => setFromCurrency(c)}
                changeAmount={(a) => setFromAmount(a)}
              />

              {/* Swap button */}
              <div className="flex items-center justify-center">
                <button
                  onClick={handleSwap}
                  className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-800 bg-gray-900 hover:border-indigo-600 hover:bg-indigo-950/40 transition-all duration-200 text-gray-500 hover:text-indigo-400 text-xs tracking-wider uppercase"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 16V4m0 0L3 8m4-4l4 4" />
                    <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Swap
                </button>
              </div>

              <CurrencyPicker
                label="To"
                currencies={currencies}
                selectedCurrency={toCurrency}
                amount={toAmount}
                changeSelection={(c) => setToCurrency(c)}
                changeAmount={(a) => console.log(a)}
              />

              {/* Rate hint */}
              {fromCurrency && toCurrency && fromCurrency !== toCurrency && toAmount > 0 && fromAmount > 0 && (
                <div className="mt-2 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3">
                  <p className="text-xs text-gray-600 tracking-wide">Rate</p>
                  <p className="text-sm text-indigo-400 mt-0.5">
                    1 {fromCurrency}{" "}
                    <span className="text-gray-500">=</span>{" "}
                    {(toAmount / fromAmount).toFixed(5)} {toCurrency}
                  </p>
                </div>
              )}
            </div>

            {/* Right column — chart */}
            <div className="flex-1 min-w-0 rounded-xl border border-gray-800 bg-gray-900/60 p-5">
              <CurrencyChart fromCurrency={fromCurrency} toCurrency={toCurrency} />
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;
