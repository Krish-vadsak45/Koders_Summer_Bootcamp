import { Coin } from "@/types";
import { formatCurrency, formatCompactNumber, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

interface CoinCardProps {
  coin: Coin;
  onWatchlistToggle?: (coinId: string) => void;
  showWatchlistButton?: boolean;
}

export function CoinCard({
  coin,
  onWatchlistToggle,
  showWatchlistButton = true,
}: CoinCardProps) {
  const isWatched = storage.isInWatchlist(coin.id);
  const isPositive = coin.price_change_percentage_24h >= 0;

  const handleWatchlistToggle = () => {
    if (isWatched) {
      storage.removeFromWatchlist(coin.id);
      toast.success(`Removed ${coin.name} from watchlist`);
    } else {
      storage.addToWatchlist(coin.id);
      toast.success(`Added ${coin.name} to watchlist`);
    }
    onWatchlistToggle?.(coin.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {coin.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
              {coin.symbol}
            </p>
          </div>
        </div>
        {showWatchlistButton && (
          <button
            onClick={handleWatchlistToggle}
            className={`p-2 rounded-full transition-colors ${
              isWatched
                ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
            }`}
            aria-label={isWatched ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Star className={`w-5 h-5 ${isWatched ? "fill-current" : ""}`} />
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(coin.current_price)}
          </span>
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {formatPercentage(coin.price_change_percentage_24h)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Market Cap</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatCompactNumber(coin.market_cap)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Volume (24h)</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatCompactNumber(coin.total_volume)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
