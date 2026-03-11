# Currency Converter
[![Static Badge](https://img.shields.io/badge/Live_Demo-Click_here-brightgreen?style=for-the-badge&logo=rocket&logoColor=white)](https://eltwor.github.io/CurrencyExchange/)

A React-based currency converter and historical exchange rate visualizer. 
Fetches real-time and historical data from a public API [Frankfurter]. Allows users to select currency pairs and view exchange rate trends. Implements a 7-day simple moving average [SMA] to smooth out short-term fluctuations and highlight underlying trends. The 7‑day simple moving average (SMA) is calculated by averaging the exchange rate over the previous 7 days, smoothing out daily volatility to reveal the underlying trend.

- Built with **TypeScript** for type safety and better developer experience.
- Built responsive UI with React hooks `useState`, `useEffect` for dynamic currency conversion.
- Integrated external API to fetch historical exchange rate data [6-month period].
- Processed and transformed JSON data using JavaScript array methods `map`, `reduce` to calculate moving averages.
- Visualized dual-axis time-series data using Chart.js, demonstrating ability to present statistical analysis in a user-friendly interface.

## Features
- Convert between any two currencies with real-time exchange rates
- View historical exchange rate trends over a 6‑month period
- Toggle a 7‑day simple moving average (SMA) to smooth out short‑term fluctuations
- Interactive charts powered by Chart.js
- Responsive design with Tailwind CSS
  
## Built With
- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/) via [react-chartjs-2](https://react-chartjs-2.js.org/)
- [Frankfurter API](https://frankfurter.dev/)
