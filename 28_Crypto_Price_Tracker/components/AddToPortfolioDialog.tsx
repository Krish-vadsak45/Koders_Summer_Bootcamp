import { Coin, PortfolioHolding } from "@/types";
import { X } from "lucide-react";
import { useState } from "react";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

interface AddToPortfolioDialogProps {
  coin: Coin | null;
  onClose: () => void;
  onUpdate?: () => void;
}

export function AddToPortfolioDialog({
  coin,
  onClose,
  onUpdate,
}: AddToPortfolioDialogProps) {
  const [amount, setAmount] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");

  if (!coin) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    const priceNum = parseFloat(purchasePrice);

    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid purchase price");
      return;
    }

    const holding: PortfolioHolding = {
      coinId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      amount: amountNum,
      purchasePrice: priceNum,
    };

    storage.addToPortfolio(holding);
    toast.success(`Added ${coin.name} to portfolio`);
    onUpdate?.();
    onClose();

    setAmount("");
    setPurchasePrice("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Add to Portfolio
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={coin.image}
              alt={coin.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {coin.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                {coin.symbol}
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="any"
              min="0"
              placeholder="0.00"
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="purchasePrice"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Purchase Price (USD)
            </label>
            <input
              type="number"
              id="purchasePrice"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              step="any"
              min="0"
              placeholder={coin.current_price.toFixed(2)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Current price: ${coin.current_price.toFixed(2)}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add to Portfolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
