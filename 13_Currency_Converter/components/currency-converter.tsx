"use client"

import { useState, useEffect, useCallback, useMemo, memo } from "react"
import { ArrowLeftRight, TrendingUp, DollarSign, RefreshCw, Sun, Moon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const CURRENCIES = ["USD", "INR", "EUR", "GBP", "JPY", "AUD", "CAD"] as const

type Currency = typeof CURRENCIES[number]

const CURRENCY_FLAGS: Record<Currency, string> = {
  USD: "🇺🇸",
  INR: "🇮🇳",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  AUD: "🇦🇺",
  CAD: "🇨🇦",
}

const CURRENCY_NAMES: Record<Currency, string> = {
  USD: "US Dollar",
  INR: "Indian Rupee",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
}

// Memoized currency options
const CurrencyOptions = memo(({ currencies }: { currencies: readonly Currency[] }) => (
  <>
    {currencies.map((currency) => (
      <option key={currency} value={currency} className="bg-slate-800 text-white">
        {CURRENCY_FLAGS[currency]} {currency} - {CURRENCY_NAMES[currency]}
      </option>
    ))}
  </>
))

CurrencyOptions.displayName = "CurrencyOptions"

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(1)
  const [fromCurrency, setFromCurrency] = useState<Currency>("USD")
  const [toCurrency, setToCurrency] = useState<Currency>("INR")
  const [exchangeRate, setExchangeRate] = useState<number>(1)
  const [convertedAmount, setConvertedAmount] = useState<string>("Loading...")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  // Memoized fetch function
  const fetchExchangeRate = useCallback(async (currency: Currency) => {
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching exchange rate:", error)
      throw error
    }
  }, [])

  useEffect(() => {
    setIsLoading(true)
    setError("")
    
    fetchExchangeRate(fromCurrency)
      .then((data) => {
        if (data.rates && data.rates[toCurrency]) {
          setExchangeRate(data.rates[toCurrency])
          setIsLoading(false)
        } else {
          setError("Unable to fetch exchange rate")
          setIsLoading(false)
        }
      })
      .catch(() => {
        setError("Failed to fetch exchange rate")
        setIsLoading(false)
      })
  }, [fromCurrency, toCurrency, fetchExchangeRate])

  useEffect(() => {
    if (!isLoading && exchangeRate) {
      setConvertedAmount((amount * exchangeRate).toFixed(2))
    }
  }, [amount, exchangeRate, isLoading])

  // Memoized handlers
  const handleSwap = useCallback(() => {
    setIsAnimating(true)
    setFromCurrency(prev => {
      const temp = prev
      setToCurrency(temp)
      return toCurrency
    })
    setTimeout(() => setIsAnimating(false), 300)
  }, [toCurrency])

  const handleRefresh = useCallback(() => {
    setIsLoading(true)
    setError("")
    fetchExchangeRate(fromCurrency)
      .then((data) => {
        if (data.rates && data.rates[toCurrency]) {
          setExchangeRate(data.rates[toCurrency])
          setIsLoading(false)
        } else {
          setError("Unable to fetch exchange rate")
          setIsLoading(false)
        }
      })
      .catch(() => {
        setError("Failed to fetch exchange rate")
        setIsLoading(false)
      })
  }, [fromCurrency, toCurrency, fetchExchangeRate])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === "dark" ? "light" : "dark")
  }, [])

  // Memoized theme classes
  const themeClasses = useMemo(() => ({
    background: theme === "dark" ? "bg-slate-900" : "bg-gray-100",
    card: theme === "dark" ? "bg-slate-800" : "bg-white",
    text: theme === "dark" ? "text-white" : "text-gray-900",
    textSecondary: theme === "dark" ? "text-gray-300" : "text-gray-600",
    input: theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900",
    result: theme === "dark" ? "bg-slate-700" : "bg-gray-50",
  }), [theme])

  // Memoized display value
  const displayAmount = useMemo(() => {
    return convertedAmount === "Loading..." ? "Loading..." : convertedAmount
  }, [convertedAmount])

  return (
    <div className={`h-screen w-screen overflow-hidden ${themeClasses.background} flex flex-col`}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="icon"
          className={`${theme === "dark" ? "bg-slate-800 border-slate-600 text-white hover:bg-slate-700" : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"}`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${theme === "dark" ? "bg-blue-600" : "bg-blue-500"} mb-3`}>
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <h1 className={`text-2xl md:text-3xl font-bold ${themeClasses.text} mb-1`}>
            Currency Converter
          </h1>
          <p className={`text-sm ${themeClasses.textSecondary}`}>
            Real-time exchange rates
          </p>
        </div>

        {/* Main Card */}
        <Card className={`w-full max-w-lg ${themeClasses.card} shadow-lg`}>
          <CardContent className="p-4 md:p-6">
            {/* Amount Input */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${themeClasses.textSecondary}`}>
                Amount
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  placeholder="Enter amount"
                  className={`w-full h-12 text-xl font-bold ${themeClasses.input} focus:ring-2 focus:ring-blue-500`}
                />
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-2xl ${themeClasses.textSecondary}`}>
                  {CURRENCY_FLAGS[fromCurrency]}
                </div>
              </div>
            </div>

            {/* Currency Selection */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 mb-4 items-center">
              {/* From Currency */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${themeClasses.textSecondary}`}>
                  From
                </label>
                <Select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value as Currency)}
                  className={`w-full h-10 ${themeClasses.input} focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-sm`}
                >
                  <CurrencyOptions currencies={CURRENCIES} />
                </Select>
              </div>

              {/* Swap Button */}
              <Button
                onClick={handleSwap}
                className={`w-10 h-10 rounded-full ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white transition-all duration-300 ${isAnimating ? 'rotate-180' : ''}`}
                size="icon"
                aria-label="Swap currencies"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </Button>

              {/* To Currency */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${themeClasses.textSecondary}`}>
                  To
                </label>
                <Select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value as Currency)}
                  className={`w-full h-10 ${themeClasses.input} focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-sm`}
                >
                  <CurrencyOptions currencies={CURRENCIES} />
                </Select>
              </div>
            </div>

            {/* Result Display */}
            <div className={`${themeClasses.result} rounded-xl p-4 border ${theme === "dark" ? "border-slate-600" : "border-gray-200"}`}>
              {isLoading ? (
                <div className="text-center">
                  <RefreshCw className={`w-6 h-6 mx-auto mb-2 animate-spin ${themeClasses.textSecondary}`} />
                  <p className={`text-sm ${themeClasses.textSecondary}`}>Fetching exchange rates...</p>
                </div>
              ) : error ? (
                <div className="text-center">
                  <p className="text-red-500 text-sm mb-2">{error}</p>
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <p className={`text-xs ${themeClasses.textSecondary}`}>
                      1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                    </p>
                  </div>
                  <div className="py-2">
                    <p className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-1`}>
                      {displayAmount}
                    </p>
                    <p className={`text-lg ${themeClasses.textSecondary}`}>
                      {toCurrency}
                    </p>
                  </div>
                  <div className={`flex items-center justify-center gap-1 text-xs ${themeClasses.textSecondary}`}>
                    <span>{CURRENCY_FLAGS[fromCurrency]}</span>
                    <span>{amount.toLocaleString()} {fromCurrency}</span>
                    <span>→</span>
                    <span>{CURRENCY_FLAGS[toCurrency]}</span>
                    <span>{displayAmount} {toCurrency}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Refresh Button */}
            {!isLoading && !error && (
              <div className="mt-3 text-center">
                <Button
                  onClick={handleRefresh}
                  variant="ghost"
                  size="sm"
                  className={themeClasses.textSecondary}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Refresh
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className={`text-center mt-4 text-xs ${themeClasses.textSecondary}`}>
          <p>Exchange rates by exchangerate-api.com</p>
        </div>
      </div>
    </div>
  )
}
