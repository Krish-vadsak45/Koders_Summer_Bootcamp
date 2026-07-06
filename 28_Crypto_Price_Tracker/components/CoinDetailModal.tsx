import { Coin, CoinHistory } from "@/types";
import { formatCurrency, formatCompactNumber, formatPercentage } from "@/lib/utils";
import { X, TrendingUp, TrendingDown } from "lucide-react";
import { CoinChart } from "./CoinChart";
import { useState, useEffect } from "react";
import { getCoinHistory } from "@/lib/coingecko";

interface CoinDetailModalProps {
  coin: Coin | null;
  onClose: () => void;
}

export function CoinDetailModal({ coin, onClose }: CoinDetailModalProps) {
  const [history, setHistory] = useState<CoinHistory | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coin) {
      setLoading(true);
      getCoinHistory(coin.id, 7)
        .then((data) => {
          setHistory(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching history:", error);
          setLoading(false);
        });
    }
  }, [coin]);

  if (!coin) return null;

  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={coin.image}
              alt={coin.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {coin.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                {coin.symbol}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 текст-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(coin.current_price)}
            </span>
            <div
              className={`flex items-center gap-2 text-lg font-medium ${
                isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              {formatPercentage(coin.price_change_percentage_24h)}
            </div>
          </div>

          {loading ? (
            <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
          ) : (
            history && <CoinChart history={history} height={200} />
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Market Cap
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCompactNumber(coin.market_cap)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                24h Volume
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCompactNumber(coin.total_volume)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Circulating Supply
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCompactNumber(coin.circulating_supply)} {coin.symbol.toUpperCase()}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Max Supply
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {coin.max_supply
                  ? formatCompactNumber(coin.max_supply)
                  : "N/A"}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                All-Time High
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(coin.ath)}
              </p>
              <p
                className={`text-sm ${
                  coin.ath_change_percentage >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatPercentage(coin.ath_change_percentage)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                All-Time Low
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(coin.atl)}
              </p>
              <p
                className={`text-sm ${
                  coin.atl_change_percentage >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatPercentage(coin.atl_change_percentage)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
