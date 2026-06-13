"use client";

import { Card } from "@/components/ui/card";

interface ResultDisplayProps {
  billAmount: number;
  tipAmount: number;
  totalAmount: number;
  tipPercent: number;
  numberOfPeople: number;
  tipPerPerson: number;
  totalPerPerson: number;
}

/**
 * ResultDisplay - Shows calculation results
 * Displays:
 * - Bill, tip, and total amounts
 * - Per-person breakdown when splitting
 */
export function ResultDisplay({
  billAmount,
  tipAmount,
  totalAmount,
  tipPercent,
  numberOfPeople,
  tipPerPerson,
  totalPerPerson,
}: ResultDisplayProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-3 pt-3 border-t border-border">
      {/* Bill Summary */}
      <Card className="bg-muted/50 p-3 md:p-4">
        <div className="space-y-2">
          {/* Bill Amount */}
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm text-muted-foreground">
              Bill Amount
            </span>
            <span className="font-semibold text-foreground text-sm md:text-base">
              {formatCurrency(billAmount)}
            </span>
          </div>

          {/* Tip Amount */}
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm text-muted-foreground">
              Tip ({tipPercent.toFixed(2)}%)
            </span>
            <span className="font-semibold text-primary text-sm md:text-base">
              {formatCurrency(tipAmount)}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-border my-1.5" />

          {/* Total Amount */}
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base font-semibold text-foreground">
              Total Amount
            </span>
            <span className="text-lg md:text-xl font-bold text-primary">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </Card>

      {/* Per-Person Breakdown (when splitting) */}
      {numberOfPeople > 1 && (
        <Card className="bg-primary/5 p-3 md:p-4 border-primary/20">
          <div className="space-y-2">
            <div className="text-[10px] md:text-xs font-semibold text-primary uppercase tracking-wide">
              Per Person ({numberOfPeople}{" "}
              {numberOfPeople === 1 ? "Person" : "People"})
            </div>

            {/* Tip Per Person */}
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm text-muted-foreground">
                Tip Share
              </span>
              <span className="font-semibold text-primary text-sm md:text-base">
                {formatCurrency(tipPerPerson)}
              </span>
            </div>

            {/* Total Per Person */}
            <div className="flex justify-between items-center pt-1 border-t border-primary/20">
              <span className="text-sm md:text-base font-semibold text-foreground">
                Total Per Person
              </span>
              <span className="text-base md:text-lg font-bold text-primary">
                {formatCurrency(totalPerPerson)}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
