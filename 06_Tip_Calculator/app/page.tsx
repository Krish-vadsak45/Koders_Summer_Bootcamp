import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TipCalculator } from "@/components/tip-calculator/tip-calculator";

/**
 * Home Page - Tip Calculator Application
 * Features:
 * - Responsive tip calculator fitting within viewport
 * - Light/dark theme toggle in top-right corner
 * - Clean, minimalistic design
 */
export default function Page() {
  return (
    <div className="relative h-screen overflow-hidden bg-background">
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Main Calculator */}
      <TipCalculator />
    </div>
  );
}
