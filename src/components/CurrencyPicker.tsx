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
  amount,
}: PropsOfCurrencyPicker) {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeSelection(e.target.value);
  };
  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    changeAmount(!isNaN(value) ? value : 0);
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 transition-all duration-200 hover:border-gray-700 focus-within:border-indigo-700 focus-within:ring-1 focus-within:ring-indigo-900">
      <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">
        {label}
      </label>

      <div className="flex flex-col gap-3">
        {/* Currency selector */}
        <div className="relative">
          <select
            onChange={handleSelectChange}
            value={selectedCurrency}
            className="w-full appearance-none bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 pr-8 cursor-pointer focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-900 transition-colors"
          >
            {currencies &&
              Object.entries(currencies).map(([code, name]) => (
                <option key={code} value={code} className="bg-gray-900">
                  {code} — {name}
                </option>
              ))}
          </select>
          {/* Custom chevron */}
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Amount input */}
        <div className="relative">
          <input
            className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-lg font-semibold rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-900 transition-colors placeholder-gray-600 tabular-nums"
            placeholder="0.00"
            type="number"
            value={amount === 0 ? "" : amount}
            onChange={handleChangeAmount}
          />
          <span className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 text-xs text-gray-600 font-semibold tracking-wider">
            {selectedCurrency}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CurrencyPicker;
