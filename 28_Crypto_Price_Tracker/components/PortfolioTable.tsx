import { PortfolioHolding } from "@/types";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

interface PortfolioTableProps {
  holdings: PortfolioHolding[];
  currentPrices: Record<string, number>;
  onUpdate?: () => void;
}

export function PortfolioTable({
  holdings,
  currentPrices,
  onUpdate,
}: PortfolioTableProps) {
  const handleRemove = (coinId: string) => {
    storage.removeFromPortfolio(coinId);
    toast.success("Removed from portfolio");
    onUpdate?.();
  };

  const totalValue = holdings.reduce((sum, holding) => {
    const currentPrice = currentPrices[holding.coinId] || holding.purchasePrice;
    return sum + currentPrice * holding.amount;
  }, 0);

  const totalCost = holdings.reduce(
    (sum, holding) => sum + holding.purchasePrice * holding.amount,
    0
  );

  const totalProfit = totalValue - totalCost;
  const totalProfitPercentage =
    totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  if (holdings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No holdings in your portfolio yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Portfolio Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm opacity-80">Total Value</p>
            <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Total Cost</p>
            <p className="text-2xl font-bold">{formatCurrency(totalCost)}</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Profit/Loss</p>
            <p
              className={`text-2xl font-bold ${
                totalProfit >= 0 ? "text-green-300" : "text-red-300"
              }`}
            >
              {formatCurrency(totalProfit)} ({formatPercentage(totalProfitPercentage)})
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                Coin
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                Amount
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                Purchase Price
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                Current Price
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                Value
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                Profit/Loss
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => {
              const currentPrice =
                currentPrices[holding.coinId] || holding.purchasePrice;
              const value = currentPrice * holding.amount;
              const cost = holding.purchasePrice * holding.amount;
              const profit = value - cost;
              const profitPercentage = cost > 0 ? (profit / cost) * 100 : 0;
              const isPositive = profit >= 0;

              return (
                <tr
                  key={holding.coinId}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {holding.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                        {holding.symbol}
                      </p>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                    {holding.amount}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                    {formatCurrency(holding.purchasePrice)}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                    {formatCurrency(currentPrice)}
                  </td>
                  <td className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {formatCurrency(value)}
                  </td>
                  <td
                    className={`text-right py-3 px-4 font-medium ${
                      isPositive
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatCurrency(profit)} ({formatPercentage(profitPercentage)})
                  </td>
                  <td className="text-right py-3 px-4">
                    <button
                      onClick={() => handleRemove(holding.coinId)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      aria-label="Remove from portfolio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
