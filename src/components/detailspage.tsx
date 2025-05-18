import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Gift, Receipt } from 'lucide-react'
import AdminPanelLayout from './admin-panel/admin-panel-layout'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useToast } from "./ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

interface Expense {
  _id: string;
  date: string;
  description: string;
  paidAmount: number;
  lentAmount: number;
  paidBy: 'you' | 'friend';
  category: string;
  isSettled: boolean;
  userId: {
    _id: string;
    username: string;
  };
  friendId: {
    _id: string;
    username: string;
  };
}

interface AddExpenseForm {
  description: string;
  amount: string;
  paidBy: 'you' | 'friend';
  category: string;
  splitType: 'equal' | 'exact';
  splitAmount?: string;
}

export default function ExpenseDetails() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [friendId, setFriendId] = useState<string>('');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [formData, setFormData] = useState<AddExpenseForm>({
    description: '',
    amount: '',
    paidBy: 'you',
    category: 'general',
    splitType: 'equal',
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchFriendAndExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        console.log('Debug - Current state:', { username, userId, token });
        
        if (!token || !userId || !username) {
          console.log('Debug - Missing required data:', { token: !!token, userId: !!userId, username: !!username });
          toast({
            title: "Authentication Error",
            description: "Please log in to view expenses",
            variant: "destructive",
          });
          return;
        }

        // First, get the friend's ID from their username
        console.log('Debug - Fetching friend data for username:', username);
        const friendResponse = await axios.get(`http://localhost:5000/friends/by-username/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Debug - Friend response:', friendResponse.data);
        
        if (!friendResponse.data) {
          console.log('Debug - Friend not found');
          toast({
            title: "Error",
            description: "Friend not found",
            variant: "destructive",
          });
          navigate('/friends');
          return;
        }

        setFriendId(friendResponse.data._id);

        // Then fetch expenses
        console.log('Debug - Fetching expenses for users:', { userId, friendId: friendResponse.data._id });
        const expensesResponse = await axios.get(`http://localhost:5000/expenses/${userId}/${friendResponse.data._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Debug - Expenses response:', expensesResponse.data);
        setExpenses(expensesResponse.data);
      } catch (error) {
        console.error('Debug - Error details:', error);
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFriendAndExpenses();
  }, [username]);

  const handleAddExpense = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId || !friendId) return;

      const amount = parseFloat(formData.amount);
      const lentAmount = formData.splitType === 'equal' 
        ? amount / 2 
        : parseFloat(formData.splitAmount || '0');

      const expenseData = {
        userId,
        friendId,
        date: new Date().toISOString(),
        description: formData.description,
        paidAmount: amount,
        lentAmount,
        paidBy: formData.paidBy,
        category: formData.category
      };

      const response = await axios.post('http://localhost:5000/expenses', expenseData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExpenses(prev => [response.data, ...prev]);
      setIsAddExpenseOpen(false);
      setFormData({
        description: '',
        amount: '',
        paidBy: 'you',
        category: 'general',
        splitType: 'equal',
      });

      toast({
        title: "Success",
        description: "Expense added successfully",
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      day: date.getDate().toString().padStart(2, '0'),
      fullDate: date.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()
    };
  };

  const handleSettleUp = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Mark all unsettled expenses as settled
      const unsettledExpenses = expenses.filter(expense => !expense.isSettled);
      await Promise.all(
        unsettledExpenses.map(expense =>
          axios.patch(`http://localhost:5000/expenses/${expense._id}/settle`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );

      // Refresh expenses
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:5000/expenses/${userId}/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(response.data);

      toast({
        title: "Success",
        description: "All expenses have been settled",
      });
    } catch (error) {
      console.error('Error settling expenses:', error);
      toast({
        title: "Error",
        description: "Failed to settle expenses. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <AdminPanelLayout>
        <div className="max-w-3xl mx-auto p-4">
          <div className="text-center">Loading...</div>
        </div>
      </AdminPanelLayout>
    );
  }

  const friendName = expenses[0]?.friendId?.username || username || 'Friend';

    return (
      <AdminPanelLayout>
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 bg-orange-500">
            <AvatarImage src="/placeholder.svg" alt="User avatar" />
              <AvatarFallback>{(friendName || 'FR').slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
            <h1 className="text-2xl font-semibold">{friendName}</h1>
        </div>
        <div className="flex gap-3">
            <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
              <DialogTrigger asChild>
          <Button className="bg-orange-500 hover:bg-orange-600">
            Add an expense
          </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add an expense</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="What's this expense for?"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Paid by</Label>
                    <Select
                      value={formData.paidBy}
                      onValueChange={(value: 'you' | 'friend') => setFormData(prev => ({ ...prev, paidBy: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select who paid" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="you">You</SelectItem>
                        <SelectItem value="friend">{friendName}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="gift">Gift</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Split type</Label>
                    <Select
                      value={formData.splitType}
                      onValueChange={(value: 'equal' | 'exact') => setFormData(prev => ({ ...prev, splitType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select split type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equal">Equal</SelectItem>
                        <SelectItem value="exact">Exact amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.splitType === 'exact' && (
                    <div className="grid gap-2">
                      <Label htmlFor="splitAmount">Split amount</Label>
                      <Input
                        id="splitAmount"
                        type="number"
                        value={formData.splitAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, splitAmount: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddExpense}>
                    Add expense
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              className="bg-emerald-500 hover:bg-emerald-600"
              onClick={handleSettleUp}
            >
            Settle up
          </Button>
        </div>
      </div>

      {/* Expenses List */}
        {expenses.map((expense, index) => {
          const date = formatDate(expense.date);
          const isCurrentUser = expense.paidBy === 'you';
          const paidBy = isCurrentUser ? 'you' : friendName;
          
          return (
            <React.Fragment key={expense._id}>
              {(index === 0 || formatDate(expenses[index - 1].date).fullDate !== date.fullDate) && (
                <h2 className="text-sm font-medium text-gray-500 mb-3">{date.fullDate}</h2>
              )}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-gray-500 text-sm">
                      <div>{date.month}</div>
                      <div className="text-xl">{date.day}</div>
                  </div>
                    <div className={`p-2 rounded-lg ${expense.category === 'gift' ? 'bg-pink-100' : 'bg-gray-100'}`}>
                      {expense.category === 'gift' 
                      ? <Gift className="h-6 w-6 text-pink-500" aria-hidden="true" />
                      : <Receipt className="h-6 w-6 text-gray-500" aria-hidden="true" />
                    }
                  </div>
                  <div className="font-medium">{expense.description}</div>
                </div>
                <div className="flex gap-8">
                  <div className="text-right">
                      <div className="text-sm text-gray-500">{isCurrentUser ? 'you paid' : `${paidBy} paid`}</div>
                    <div className="font-semibold">₹{expense.paidAmount.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                        {isCurrentUser ? 'you lent' : `${paidBy} lent you`}
                    </div>
                      <div className={`font-semibold ${isCurrentUser ? 'text-emerald-500' : 'text-orange-500'}`}>
                      ₹{expense.lentAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </React.Fragment>
          );
        })}

        {expenses.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">No expenses found.</p>
          </div>
        )}

        <div className="text-center py-6">
          <p className="text-gray-500 mb-2">All expenses before this date have been settled up.</p>
          <Button variant="link" className="text-blue-500 hover:text-blue-600">
            Show settled expenses
          </Button>
      </div>
            </div>
            </AdminPanelLayout>
  );
}

