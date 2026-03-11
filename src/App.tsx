import { useState, useEffect } from "react";
import { currencyApi } from "./services/api";
import CurrencyPicker from "./components/CurrencyPicker";
import CurrencyChart from "./components/CurrencyChart";
function App() {
  const [currencies, setCurrencies] = useState<Record<string, string> | null>(
    null,
  );
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

        const defaultFromCur = data?.EUR
          ? "EUR"
          : (Object.keys(data ?? {})[0] ?? "");
        if (defaultFromCur) setFromCurrency(defaultFromCur);

        const defaultToCur = data?.PLN
          ? "PLN"
          : (Object.keys(data ?? {})[1] ?? "");
        if (defaultToCur) setToCurrency(defaultToCur);
      } catch (err) {
        setError((err as Error).message)
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
          const data = await currencyApi.calculateTransfer(
            fromCurrency,
            toCurrency,
              fromAmount,
          );
          const conversionRate: number = Object.entries(
            data.rates,
          )[0][1] as number;
          const newCalculatedAmount = fromAmount * conversionRate;
          setToAmount(newCalculatedAmount);
        }
      } catch (err) {
        setError((err as Error).message)
      }
    };
    calculateTransferAmount();
  }, [fromCurrency, toCurrency, fromAmount, currencies]);

  return (
    <>
      {/* This is the conversion fragments */}
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        
        <div>
          <CurrencyChart fromCurrency={fromCurrency} toCurrency={toCurrency}/>
          <CurrencyPicker
            label={"From"}
            currencies={currencies}
            selectedCurrency={fromCurrency}
            amount={fromAmount}
            changeSelection={(newCurrency: string) =>
              setFromCurrency(newCurrency)
            }
            changeAmount={(newAmount: number) => setFromAmount(newAmount)}
          />

          <CurrencyPicker
            label={"To"}
            currencies={currencies}
            selectedCurrency={toCurrency}
            amount={toAmount}
            changeSelection={(newCurrency: string) =>
              setToCurrency(newCurrency)
            }
            changeAmount={(newAmount: number) => console.log(newAmount)}
          />
        </div>
      )}
    </>
  );
}

export default App;
