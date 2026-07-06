import { PortfolioHolding } from "@/types";

const WATCHLIST_KEY = "crypto_watchlist";
const PORTFOLIO_KEY = "crypto_portfolio";

export const storage = {
  getWatchlist: (): string[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  },

  setWatchlist: (watchlist: string[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  },

  addToWatchlist: (coinId: string): void => {
    const watchlist = storage.getWatchlist();
    if (!watchlist.includes(coinId)) {
      watchlist.push(coinId);
      storage.setWatchlist(watchlist);
    }
  },

  removeFromWatchlist: (coinId: string): void => {
    const watchlist = storage.getWatchlist();
    const filtered = watchlist.filter((id) => id !== coinId);
    storage.setWatchlist(filtered);
  },

  isInWatchlist: (coinId: string): boolean => {
    const watchlist = storage.getWatchlist();
    return watchlist.includes(coinId);
  },

  getPortfolio: (): PortfolioHolding[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(PORTFOLIO_KEY);
    return data ? JSON.parse(data) : [];
  },

  setPortfolio: (portfolio: PortfolioHolding[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
  },

  addToPortfolio: (holding: PortfolioHolding): void => {
    const portfolio = storage.getPortfolio();
    const existingIndex = portfolio.findIndex(
      (h) => h.coinId === holding.coinId
    );

    if (existingIndex >= 0) {
      portfolio[existingIndex] = holding;
    } else {
      portfolio.push(holding);
    }

    storage.setPortfolio(portfolio);
  },

  removeFromPortfolio: (coinId: string): void => {
    const portfolio = storage.getPortfolio();
    const filtered = portfolio.filter((h) => h.coinId !== coinId);
    storage.setPortfolio(filtered);
  },
};
