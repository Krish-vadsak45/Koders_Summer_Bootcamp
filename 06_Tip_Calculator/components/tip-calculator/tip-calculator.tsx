"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BillInput } from "./bill-input";
import { TipPercentageSelector } from "./tip-percentage-selector";
import { SplitSelector } from "./split-selector";
import { RoundingOptions } from "./rounding-options";
import { ResultDisplay } from "./result-display";

/**
 * TipCalculator - Main component managing all state and calculations
 * Features:
 * - Bill amount input
 * - Tip percentage selection (preset + custom)
 * - Bill splitting by number of people
 * - Multiple rounding modes
 * - Real-time calculations
 */
export function TipCalculator() {
  const [billAmount, setBillAmount] = useState<number>(0);
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [customTipPercent, setCustomTipPercent] = useState<string>("");
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [roundingMode, setRoundingMode] = useState<"none" | "normal" | "up">(
    "normal",
  );

  // Use custom tip if provided, otherwise use preset
  const activeTipPercent = customTipPercent
    ? parseFloat(customTipPercent) || tipPercent
    : tipPercent;

  // Calculate total tip amount
  const totalTip = (billAmount * activeTipPercent) / 100;

  // Calculate total bill (bill + tip)
  const totalBill = billAmount + totalTip;

  // Round amounts based on selected mode
  const getRoundedAmount = (amount: number) => {
    switch (roundingMode) {
      case "up":
        return Math.ceil(amount * 100) / 100;
      case "normal":
        return Math.round(amount * 100) / 100;
      case "none":
      default:
        return Math.round(amount * 100) / 100;
    }
  };

  const roundedTip = getRoundedAmount(totalTip);
  const roundedTotal = getRoundedAmount(totalBill);

  // Calculate per-person amounts
  const tipPerPerson = getRoundedAmount(totalTip / numberOfPeople);
  const totalPerPerson = getRoundedAmount(totalBill / numberOfPeople);

  return (
    <div className="h-full bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg overflow-auto max-h-[95vh]">
        <div className="p-4 md:p-6 space-y-3 md:space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Tip Calculator
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Calculate tips and split bills with ease
            </p>
          </div>

          {/* Bill Input */}
          <BillInput value={billAmount} onChange={setBillAmount} />

          {/* Tip Percentage Selector */}
          <TipPercentageSelector
            selectedPercent={tipPercent}
            customPercent={customTipPercent}
            onSelectPercent={setTipPercent}
            onCustomPercentChange={setCustomTipPercent}
          />

          {/* Split Selector */}
          <SplitSelector
            numberOfPeople={numberOfPeople}
            onChange={setNumberOfPeople}
          />

          {/* Rounding Options */}
          <RoundingOptions
            roundingMode={roundingMode}
            onChange={setRoundingMode}
          />

          {/* Results Display */}
          <ResultDisplay
            billAmount={billAmount}
            tipAmount={roundedTip}
            totalAmount={roundedTotal}
            tipPercent={activeTipPercent}
            numberOfPeople={numberOfPeople}
            tipPerPerson={tipPerPerson}
            totalPerPerson={totalPerPerson}
          />
        </div>
      </Card>
    </div>
  );
}
