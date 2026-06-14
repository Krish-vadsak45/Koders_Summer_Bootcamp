"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calculator, DollarSign, Users } from "lucide-react";

export function TipCalculator() {
  const [bill, setBill] = useState<string>("50");
  const [tipPercentage, setTipPercentage] = useState([15]);
  const [people, setPeople] = useState<string>("1");

  const parsedBill = parseFloat(bill) || 0;
  const parsedPeople = parseInt(people) || 1;
  const validPeople = Math.max(1, parsedPeople);

  const tipAmount = (parsedBill * tipPercentage[0]) / 100;
  const totalAmount = parsedBill + tipAmount;

  const tipPerPerson = tipAmount / validPeople;
  const totalPerPerson = totalAmount / validPeople;

  return (
    <Card className="w-full max-w-md mx-auto border-none shadow-none bg-transparent sm:border-solid sm:shadow-sm sm:bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Calculator className="w-5 h-5"/> Tip Calculator</CardTitle>
        <CardDescription>Calculate tips and split bills easily</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="bill">Bill Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input 
              id="bill" 
              type="number" 
              min="0"
              step="0.01"
              value={bill} 
              onChange={(e) => setBill(e.target.value)}
              className="pl-10 text-lg" 
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <Label>Tip Percentage</Label>
            <span className="font-mono bg-secondary px-2 py-1 rounded text-sm">{tipPercentage[0]}%</span>
          </div>
          <Slider 
            value={tipPercentage} 
            onValueChange={(val) => setTipPercentage(typeof val === "number" ? [val] : Array.from(val))} 
            min={0} 
            max={50} 
            step={1} 
          />
        </div>

        <div className="space-y-2 pt-2">
          <Label htmlFor="people">Number of People</Label>
          <div className="relative">
            <Users className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input 
              id="people" 
              type="number" 
              min="1"
              step="1"
              value={people} 
              onChange={(e) => setPeople(e.target.value)}
              className="pl-10 text-lg" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t">
          <div className="bg-primary/10 rounded-lg p-4 flex flex-col items-center justify-center border border-primary/20">
            <span className="text-sm font-medium text-muted-foreground mb-1">Tip per person</span>
            <span className="text-2xl font-bold text-primary">${tipPerPerson.toFixed(2)}</span>
          </div>
          <div className="bg-primary text-primary-foreground rounded-lg p-4 flex flex-col items-center justify-center shadow-md">
            <span className="text-sm font-medium opacity-90 mb-1">Total per person</span>
            <span className="text-2xl font-bold">${totalPerPerson.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
