import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ChartNoAxesCombined, HandCoins, ChartColumnIncreasing,BellRing ,ShieldPlus  } from "lucide-react";

export default function IconSectionStackedCards() {
  return (
    <>
      {/* Icon Blocks */}
      <div className="container py-6 lg:py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 items-center gap-2 md:gap-4">
          {/* Card */}
          <Card>
            <CardHeader className="pb-4 flex-row items-center gap-4">
              <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                <ChartNoAxesCombined className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle> Easy Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              Log expenses and income in real-time.
            </CardContent>
          </Card>
          {/* End Card */}
          {/* Card */}
          <Card>
            <CardHeader className="pb-4 flex-row items-center gap-4">
              <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                <HandCoins className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Budgeting</CardTitle>
            </CardHeader>
            <CardContent>
              Set monthly budgets and track progress.
            </CardContent>
          </Card>
          {/* End Card */}
          {/* Card */}
          <Card>
            <CardHeader className="pb-4 flex-row items-center gap-4">
              <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                <ChartColumnIncreasing className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              Visualize spending patterns with charts.
            </CardContent>
          </Card>
          {/* End Card */}
          {/* Card */}
          <Card>
            <CardHeader className="pb-4 flex-row items-center gap-4">
              <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                <BellRing className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Reminders & Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              Stay on top of bills and avoid overspending.
            </CardContent>
          </Card>
          {/* End Card */}
          {/* Card */}
          <Card>
            <CardHeader className="pb-4 flex-row items-center gap-4">
              <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                <ShieldPlus className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Secure Data</CardTitle>
            </CardHeader>
            <CardContent>
              Your financial data is safe and private.
            </CardContent>
          </Card>
          {/* End Card */}
          {/* Card */}
          {/* <Card>
            <CardHeader className="pb-4 flex-row items-center gap-4">
              <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                <PaletteIcon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Build your portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              The simplest way to keep your portfolio always up-to-date.
            </CardContent>
          </Card> */}
          {/* End Card */}
        </div>
      </div>
      {/* End Icon Blocks */}
    </>
  );
}
