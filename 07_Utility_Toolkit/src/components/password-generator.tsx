"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, KeyRound } from "lucide-react";
import { toast } from "sonner";

export function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = () => {
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      toast.error("Select at least one character type");
      return;
    }

    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let validChars = "";
    if (includeUppercase) validChars += uppercaseChars;
    if (includeLowercase) validChars += lowercaseChars;
    if (includeNumbers) validChars += numberChars;
    if (includeSymbols) validChars += symbolChars;

    let generatedPassword = "";
    for (let i = 0; i < length[0]; i++) {
      const randomIndex = Math.floor(Math.random() * validChars.length);
      generatedPassword += validChars[randomIndex];
    }

    setPassword(generatedPassword);
  };

  useEffect(() => {
    const timeout = setTimeout(() => generatePassword(), 0);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      toast.success("Password copied to clipboard!");
    } catch {
      toast.error("Failed to copy password");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-none shadow-none bg-transparent sm:border-solid sm:shadow-sm sm:bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><KeyRound className="w-5 h-5"/> Password Generator</CardTitle>
        <CardDescription>Create secure, random passwords</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex space-x-2">
          <Input 
            value={password} 
            readOnly 
            className="font-mono text-lg font-medium tracking-wider h-12" 
          />
          <Button variant="outline" size="icon" className="h-12 w-12 shrink-0" onClick={generatePassword} aria-label="Regenerate password">
            <RefreshCw className="w-5 h-5" />
          </Button>
          <Button size="icon" className="h-12 w-12 shrink-0" onClick={copyToClipboard} aria-label="Copy password">
            <Copy className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-medium">Password Length</Label>
            <span className="font-mono bg-secondary px-2 py-1 rounded text-sm">{length[0]}</span>
          </div>
          <Slider 
            value={length} 
            onValueChange={(val) => setLength(typeof val === "number" ? [val] : Array.from(val))} 
            min={8} 
            max={32} 
            step={1} 
            className="my-4"
          />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <Label htmlFor="uppercase" className="cursor-pointer">Uppercase Letters (A-Z)</Label>
            <Switch id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="lowercase" className="cursor-pointer">Lowercase Letters (a-z)</Label>
            <Switch id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="numbers" className="cursor-pointer">Numbers (0-9)</Label>
            <Switch id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="symbols" className="cursor-pointer">Symbols (!@#$)</Label>
            <Switch id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
