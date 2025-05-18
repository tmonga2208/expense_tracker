import { useEffect, useState } from "react"
import { Card } from "../components/ui/card"
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
  LucideIcon,
} from "lucide-react"
import AdminPanelLayout from "../components/admin-panel/admin-panel-layout"
import axios from "axios"

interface Category {
  _id: string;
  name: string;
  icon: string;
  totalAmount: number;
}

interface Expense {
  _id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
}

const iconMap: { [key: string]: LucideIcon } = {
  'food': Utensils,
  'groceries': ShoppingBag,
  'shopping': ShoppingCart,
  'transport': Car,
  'entertainment': Tv,
  'utilities': Zap,
  'health': Heart,
  'home': Home,
};

export default function ExpenseCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<{ [key: string]: Expense[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          setError('Please log in to view categories');
          return;
        }

        const response = await axios.get(`http://localhost:5000/categories/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCategories(response.data);

        // Fetch expenses for each category
        const expensesData: { [key: string]: Expense[] } = {};
        await Promise.all(
          response.data.map(async (category: Category) => {
            const expensesResponse = await axios.get(
              `http://localhost:5000/categories/${userId}/${category.name}/expenses`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            expensesData[category.name] = expensesResponse.data;
          })
        );
        setExpenses(expensesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName.toLowerCase()] || Grid2X2;
    return <Icon className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <AdminPanelLayout>
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4 h-16 bg-gray-200" />
            ))}
          </div>
        </div>
      </AdminPanelLayout>
    );
  }

  if (error) {
    return (
      <AdminPanelLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-red-500">{error}</div>
        </div>
      </AdminPanelLayout>
    );
  }

  return (
    <AdminPanelLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Categories */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Grid2X2 className="w-4 h-4" />
            <h2 className="text-xl font-semibold">Categories</h2>
          </div>
          
          <div className="space-y-4">
            {categories.map((category) => (
              <Card key={category._id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getIcon(category.icon)}
                    <span>{category.name}</span>
                  </div>
                  <span className="font-semibold">₹{category.totalAmount.toFixed(2)}</span>
                </div>

                <Collapsible>
                  <CollapsibleTrigger className="flex items-center gap-2 w-full mt-4">
                    <ChevronDown className="w-4 h-4" />
                    <span className="font-semibold">Expenses</span>
                    <span className="text-muted-foreground ml-2">
                      {expenses[category.name]?.length || 0}
                    </span>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-2 mt-2">
                    {expenses[category.name]?.map((expense) => (
                      <div
                        key={expense._id}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getIcon(category.icon)}
                          <span>{expense.title}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">₹{expense.amount.toFixed(2)}</span>
                          <span className="text-muted-foreground">
                            {formatDate(expense.date)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminPanelLayout>
  );
}

