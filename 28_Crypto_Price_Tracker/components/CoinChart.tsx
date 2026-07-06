import { CoinHistory } from "@/types";

interface CoinChartProps {
  history: CoinHistory;
  height?: number;
}

export function CoinChart({ history, height = 200 }: CoinChartProps) {
  if (!history.prices || history.prices.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
        style={{ height }}
      >
        <p className="text-gray-500 dark:text-gray-400">No chart data available</p>
      </div>
    );
  }

  const prices = history.prices.map(([_, price]) => price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  const points = history.prices.map(([timestamp, price], index) => {
    const x = (index / (history.prices.length - 1)) * 100;
    const y = 100 - ((price - minPrice) / priceRange) * 100;
    return `${x},${y}`;
  }).join(" ");

  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const isPositive = lastPrice >= firstPrice;
  const strokeColor = isPositive ? "#22c55e" : "#ef4444";

  return (
    <div className="relative" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={`gradient-${isPositive ? "up" : "down"}`} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={strokeColor}
              stopOpacity="0.3"
            />
            <stop
              offset="100%"
              stopColor={strokeColor}
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        <path
          d={`M 0,100 L ${points} L 100,100 Z`}
          fill={`url(#gradient-${isPositive ? "up" : "down"})`}
        />
        <polyline
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
