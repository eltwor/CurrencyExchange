interface PropsOfCurrencyPicker {
  currencies: Record<string, string> | null;
  selectedCurrency: string;
  label: string;
  changeSelection: (code: string) => void;
  changeAmount: (code: number) => void;
  amount: number;
}

function CurrencyPicker({
  currencies,
  label,
  selectedCurrency,
  changeSelection,
  changeAmount,
  amount
}: PropsOfCurrencyPicker) {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeSelection(e.target.value);
  };
  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    if(!isNaN(value)) changeAmount(value);
    else changeAmount(0);
  };
  return (
    <div className="border-2 border-solid border-red-300">
      <label className="text-green-600 text-lg font-semibold">
        {label} Currency {selectedCurrency}
      </label>
      <div className="mt-2 text-gray-500">
        <select onChange={handleSelectChange} value={selectedCurrency}>
          {currencies &&
            Object.entries(currencies).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
        </select>
        <input
          className="bg-transparent outline-none border focus:border-blue-400 focus:ring-1 focus:ring-inset focus:ring-blue-400 shadow-sm rounded-lg"
          placeholder="0.00"
          type="number"
          value={amount}
          onChange={handleChangeAmount}
        />
      </div>
    </div>
  );
}

export default CurrencyPicker;
