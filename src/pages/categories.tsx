import { Card } from "../components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible"
import {
  Utensils,
  ShoppingBag,
  ShoppingCart,
  Car,
  Tv,
  Zap,
  Heart,
  Home,
  ChevronDown,
  Grid2X2,
} from "lucide-react"
import AdminPanelLayout from "../components/admin-panel/admin-panel-layout"

export default function ExpenseCategories() {
    return (
      <AdminPanelLayout>
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Categories */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Grid2X2 className="w-4 h-4" />
          <h2 className="text-xl font-semibold">Categories</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Utensils className="w-5 h-5" />
              <span>Food & Drinks</span>
            </div>
            <span className="font-semibold">&#8377;2000.00</span>
          </Card>
          
          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5" />
              <span>Groceries</span>
            </div>
            <span className="font-semibold">&#8377;6000.00</span>
          </Card>
          
          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5" />
              <span>Shopping</span>
            </div>
            <span className="font-semibold">&#8377;0.00</span>
          </Card>
          
          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5" />
              <span>Transport</span>
            </div>
            <span className="font-semibold">&#8377;0.00</span>
          </Card>
          
          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tv className="w-5 h-5" />
              <span>Entertainment</span>
            </div>
            <span className="font-semibold">&#8377;0.00</span>
          </Card>
          
          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5"/>
              <span>Utilities</span>
            </div>
            <span className="font-semibold">&#8377;12000.00</span>
          </Card>
          
          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5" />
              <span>Health & Fitness</span>
            </div>
            <span className="font-semibold">&#8377;0.00</span>
          </Card>
          
          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </div>
            <span className="font-semibold">&#8377;100.00</span>
          </Card>
        </div>
      </div>

      {/* Expenses */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Expenses</h2>
        
        <Tabs defaultValue="daily" className="w-full">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {/* Oct 17 */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 w-full">
              <ChevronDown className="w-4 h-4" />
              <span className="font-semibold">Oct 17, 2024</span>
              <span className="text-muted-foreground ml-2">2</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              <div className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5" />
                  <span>Electricity Bill</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">&#8377;120.00</span>
                  <span className="text-muted-foreground">October 17, 2024</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5" />
                  <span>Rent Payment</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">&#8377;100.00</span>
                  <span className="text-muted-foreground">October 17, 2024</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Oct 18 */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 w-full">
              <ChevronDown className="w-4 h-4" />
              <span className="font-semibold">Oct 18, 2024</span>
              <span className="text-muted-foreground ml-2">2</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              <div className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Utensils className="w-5 h-5" />
                  <span>Lunch Out with Friends</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">&#8377;20.00</span>
                  <span className="text-muted-foreground">October 18, 2024</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Weekly Grocery Shopping</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">&#8377;60.00</span>
                  <span className="text-muted-foreground">October 18, 2024</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
            </div>
            </AdminPanelLayout>
  )
}

