"use client";

import { useState, useEffect } from "react";
import { Coin, PortfolioHolding } from "@/types";
import { getCoins } from "@/lib/coingecko";
import { storage } from "@/lib/storage";
import { CoinCard } from "@/components/CoinCard";
import { CoinDetailModal } from "@/components/CoinDetailModal";
import { AddToPortfolioDialog } from "@/components/AddToPortfolioDialog";
import { PortfolioTable } from "@/components/PortfolioTable";
import { SearchBar } from "@/components/SearchBar";
import { RefreshCw, Moon, Sun, Plus } from "lucide-react";
import { toast } from "sonner";

type Tab = "market" | "watchlist" | "portfolio";

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("market");
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [portfolioDialogCoin, setPortfolioDialogCoin] = useState<Coin | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCoins();
    loadWatchlist();
    loadPortfolio();
    
    // Check for dark mode preference
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const loadCoins = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCoins();
      setCoins(data);
      setFilteredCoins(data);
    } catch (err) {
      setError("Failed to load cryptocurrency data");
      toast.error("Failed to load cryptocurrency data");
    } finally {
      setLoading(false);
    }
  };

  const loadWatchlist = () => {
    setWatchlist(storage.getWatchlist());
  };

  const loadPortfolio = () => {
    setPortfolio(storage.getPortfolio());
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredCoins(coins);
    } else {
      const filtered = coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCoins(filtered);
    }
  };

  const handleWatchlistToggle = (coinId: string) => {
    loadWatchlist();
  };

  const handleAddToPortfolio = (coin: Coin) => {
    setPortfolioDialogCoin(coin);
  };

  const handlePortfolioUpdate = () => {
    loadPortfolio();
  };

  const getCurrentPrices = (): Record<string, number> => {
    const prices: Record<string, number> = {};
    coins.forEach((coin) => {
      prices[coin.id] = coin.current_price;
    });
    return prices;
  };

  const getDisplayCoins = (): Coin[] => {
    if (activeTab === "market") {
      return filteredCoins;
    } else if (activeTab === "watchlist") {
      return coins.filter((coin) => watchlist.includes(coin.id));
    } else {
      return coins.filter((coin) =>
        portfolio.some((holding) => holding.coinId === coin.id)
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Crypto Price Tracker
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track cryptocurrency prices in real-time
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadCoins}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-gray-900 dark:text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-900 dark:text-white" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Search */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} placeholder="Search coins..." />
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4">
            {["market", "watchlist", "portfolio"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as Tab)}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === tab
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "watchlist" && ` (${watchlist.length})`}
                {tab === "portfolio" && ` (${portfolio.length})`}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse"
              >
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={loadCoins}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : activeTab === "portfolio" ? (
          <PortfolioTable
            holdings={portfolio}
            currentPrices={getCurrentPrices()}
            onUpdate={handlePortfolioUpdate}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getDisplayCoins().map((coin) => (
              <div key={coin.id} className="relative">
                <CoinCard
                  coin={coin}
                  onWatchlistToggle={handleWatchlistToggle}
                  showWatchlistButton={activeTab !== "watchlist"}
                />
                <button
                  onClick={() => setSelectedCoin(coin)}
                  className="absolute top-4 right-12 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  aria-label="View details"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAddToPortfolio(coin)}
                  className="absolute top-4 right-4 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  aria-label="Add to portfolio"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {getDisplayCoins().length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {activeTab === "watchlist"
                ? "No coins in your watchlist yet"
                : activeTab === "portfolio"
                ? "No holdings in your portfolio yet"
                : "No coins found matching your search"}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedCoin && (
        <CoinDetailModal coin={selectedCoin} onClose={() => setSelectedCoin(null)} />
      )}
      {portfolioDialogCoin && (
        <AddToPortfolioDialog
          coin={portfolioDialogCoin}
          onClose={() => setPortfolioDialogCoin(null)}
          onUpdate={handlePortfolioUpdate}
        />
      )}
    </div>
  );
}
