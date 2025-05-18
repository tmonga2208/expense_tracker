"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { SpendingChart } from "./comps/spending-chart"
import { CategoryChart } from "./comps/category-chart"
import { DialogPrompt } from "../components/DialogPrompt"
import { DialogPrompt2 } from "../components/DialogPrompt2"
import { SkeletonCard } from "../components/SkeletonCard"
import { CategoryChartSkeleton } from "../components/categorySkeleton"
import { Check } from 'lucide-react'
import { cn } from "../lib/utils"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Settings } from "lucide-react"

interface Step {
  id: number
  text: string
  completed: boolean
  visible: boolean
}

interface Spending {
  title: string
  amount: number
  selectValue: string
  category: string
  date: string
  description: string
}

interface BillSpending {
  title: string
  amount: number
  selectValue: string
  category: string
  date: string
  description: string
}

interface Friend {
  _id: string;
  username: string;
}

interface FriendBalance {
  friend: Friend;
  totalBalance: number;
  youOwe: number;
  owedToYou: number;
}

interface Expense {
  _id: string;
  paidBy: 'you' | 'friend';
  lentAmount: number;
}

interface UserSettings {
  monthlyBudget: number;
  savingsGoals: {
    _id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
  }[];
  banking: {
    totalBalance: number;
    accounts: {
      _id: string;
      name: string;
      balance: number;
      type: string;
    }[];
  };
}

export default function DashboardPageNew() {
  const [spendings, setSpendings] = useState<Spending[]>([])
  const [billSpendings, setBillSpendings] = useState<BillSpending[]>([])
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, text: "Fetching everyday transactions", completed: false, visible: false },
    { id: 2, text: "Analyzing spending habits", completed: false, visible: false },
    { id: 3, text: "Preparing monthly budget insights", completed: false, visible: false },
    { id: 4, text: "Setting up bill reminders", completed: false, visible: false },
    { id: 5, text: "Splitting expenses with friends", completed: false, visible: false },
    { id: 6, text: "Planning ahead for savings goals", completed: false, visible: false },
  ])
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0)
  const [friendBalances, setFriendBalances] = useState<FriendBalance[]>([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [totalOwed, setTotalOwed] = useState(0)
  const [totalOwedToYou, setTotalOwedToYou] = useState(0)
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [newMonthlyBudget, setNewMonthlyBudget] = useState('');
  const [newSavingsGoal, setNewSavingsGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: ''
  });
  const [newBankAccount, setNewBankAccount] = useState({
    name: '',
    balance: '',
    type: 'savings'
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/form-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (response.ok) {
        setSpendings(data)
      } else {
        console.error(data.message)
      }
    }
    const user = localStorage.getItem("username")
    setUsername(user || "")

    fetchData()
  }, [])

  useEffect(() => {
     const fetchBillData = async () => {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/bill-formdata", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (response.ok) {
        setBillSpendings(data)
      } else {
        console.error(data.message)
      }
    }
    fetchBillData();
  }, [])

  useEffect(() => {
    const fetchFriendsAndBalances = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) return;

        // Fetch friends
        const friendsResponse = await axios.get(`http://localhost:5000/friends/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch expenses for each friend and calculate balances
        const balances = await Promise.all(
          friendsResponse.data.map(async (friend: Friend) => {
            const expensesResponse = await axios.get(`http://localhost:5000/expenses/${userId}/${friend._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });

            const expenses = expensesResponse.data as Expense[];
            let youOwe = 0;
            let owedToYou = 0;

            expenses.forEach((expense) => {
              if (expense.paidBy === 'you') {
                owedToYou += expense.lentAmount;
              } else {
                youOwe += expense.lentAmount;
              }
            });

            const totalBalance = owedToYou - youOwe;

            return {
              friend,
              totalBalance,
              youOwe,
              owedToYou
            };
          })
        );

        setFriendBalances(balances);

        // Calculate totals
        const total = balances.reduce((sum, balance) => sum + balance.totalBalance, 0);
        const totalOwed = balances.reduce((sum, balance) => sum + balance.youOwe, 0);
        const totalOwedToYou = balances.reduce((sum, balance) => sum + balance.owedToYou, 0);

        setTotalBalance(total);
        setTotalOwed(totalOwed);
        setTotalOwedToYou(totalOwedToYou);
      } catch (error) {
        console.error('Error fetching friends and balances:', error);
      }
    };

    fetchFriendsAndBalances();
  }, []);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) return;

        const response = await axios.get(`http://localhost:5000/settings/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUserSettings(response.data);
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };

    fetchUserSettings();
  }, []);

  const totalSpent = [...spendings, ...billSpendings]
    .filter((item) => item.selectValue === "spent")
    .reduce((total, item) => total + item.amount, 0)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleNavigate = () => {
    navigate("/viewall")
  }

  const calculateDaysLeftInMonth = () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return (endOfMonth.getDate() - now.getDate());
  }

  const monthlyBudget = 30000; // Example monthly budget
  const remainingBudget = monthlyBudget - totalSpent;
  const daysLeftInMonth = calculateDaysLeftInMonth();
  const dailyBudget = remainingBudget / daysLeftInMonth;

  useEffect(() => {
    if (currentStep > 0 && currentStep <= steps.length) {
      const timer = setTimeout(() => {
        setSteps(prev => prev.map((step, idx) => ({
          ...step,
          visible: idx < currentStep,
          completed: idx < currentStep - 1
        })))

        if (currentStep === steps.length) {
          setShowFinalModal(true);
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentStep, steps.length])

  const handleCloseFinalModal = () => {
    setShowFinalModal(false);
    setShowModal(false);
    setCurrentStep(0);
    setSteps(prev => prev.map(step => ({
      ...step,
      completed: false,
      visible: false
    })));
  }

  const dateToday = formatDate(new Date().toISOString())

  // Combine categories from transactions and bills
  const combinedCategories = [...spendings, ...billSpendings];

  const handleUpdateMonthlyBudget = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) return;

      await axios.put(`http://localhost:5000/settings/${userId}`, {
        monthlyBudget: Number(newMonthlyBudget)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserSettings(prev => prev ? {
        ...prev,
        monthlyBudget: Number(newMonthlyBudget)
      } : null);
      setShowSettingsDialog(false);
    } catch (error) {
      console.error('Error updating monthly budget:', error);
    }
  };

  const handleAddSavingsGoal = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) return;

      const response = await axios.post(`http://localhost:5000/settings/${userId}/savings`, {
        name: newSavingsGoal.name,
        targetAmount: Number(newSavingsGoal.targetAmount),
        currentAmount: 0,
        targetDate: newSavingsGoal.targetDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserSettings(response.data);
      setNewSavingsGoal({ name: '', targetAmount: '', targetDate: '' });
    } catch (error) {
      console.error('Error adding savings goal:', error);
    }
  };

  const handleAddBankAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) return;

      const response = await axios.post(`http://localhost:5000/settings/${userId}/banking`, {
        name: newBankAccount.name,
        balance: Number(newBankAccount.balance),
        type: newBankAccount.type
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserSettings(response.data);
      setNewBankAccount({ name: '', balance: '', type: 'savings' });
    } catch (error) {
      console.error('Error adding bank account:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 relative">
      {showModal && (
        <div className="absolute inset-0 bg-transparent backdrop-blur flex flex-col items-center justify-center p-4 z-50">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full" />
            
            {/* Steps container */}
            <div className="relative space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 transition-all duration-500",
                    step.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300",
                    index === currentStep - 1 ? "bg-[#98ff98] text-black" : "bg-white/20"
                  )}>
                    <Check className="w-4 h-4" />
                  </div>
                  <span className={cn(
                    "text-lg transition-colors duration-300",
                    index === currentStep - 1 ? "text-[#98ff98]" : "text-black/80"
                  )}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {showFinalModal && (
        <div className="absolute inset-0 bg-transparent backdrop-blur flex flex-col items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Here is your monthly plan</h2>
            <p>Total Spent: ₹{totalSpent}</p>
            <p>Remaining Budget: ₹{remainingBudget}</p>
            <p>Days Left in Month: {daysLeftInMonth}</p>
            <p>Daily Budget: ₹{dailyBudget.toFixed(2)}</p>
            <Button onClick={handleCloseFinalModal}>Close</Button>
          </div>
        </div>
      )}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-[525px] overflow-y-auto max-h-[60vh]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Manage your monthly budget, savings goals, and bank accounts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Monthly Budget</Label>
              <Input
                type="number"
                value={newMonthlyBudget}
                onChange={(e) => setNewMonthlyBudget(e.target.value)}
                placeholder="Enter monthly budget"
              />
              <Button onClick={handleUpdateMonthlyBudget} className="mt-2">
                Update Budget
              </Button>
            </div>

            <div>
              <Label>Add Savings Goal</Label>
              <Input
                type="text"
                value={newSavingsGoal.name}
                onChange={(e) => setNewSavingsGoal(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Goal name"
                className="mb-2"
              />
              <Input
                type="number"
                value={newSavingsGoal.targetAmount}
                onChange={(e) => setNewSavingsGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                placeholder="Target amount"
                className="mb-2"
              />
              <Input
                type="date"
                value={newSavingsGoal.targetDate}
                onChange={(e) => setNewSavingsGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                className="mb-2"
              />
              <Button onClick={handleAddSavingsGoal} className="mt-2">
                Add Goal
              </Button>
            </div>

            <div>
              <Label>Add Bank Account</Label>
              <Input
                type="text"
                value={newBankAccount.name}
                onChange={(e) => setNewBankAccount(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Account name"
                className="mb-2"
              />
              <Input
                type="number"
                value={newBankAccount.balance}
                onChange={(e) => setNewBankAccount(prev => ({ ...prev, balance: e.target.value }))}
                placeholder="Initial balance"
                className="mb-2"
              />
              <select
                value={newBankAccount.type}
                onChange={(e) => setNewBankAccount(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 border rounded-md mb-2"
                aria-label="Account type"
              >
                <option value="savings">Savings</option>
                <option value="checking">Checking</option>
                <option value="investment">Investment</option>
              </select>
              <Button onClick={handleAddBankAccount} className="mt-2">
                Add Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Hello {username} 👋
        </h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-sm font-medium">Accounts</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettingsDialog(true)}
                  className="h-8 w-8"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{userSettings?.banking.totalBalance.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">Net Worth</p>
              
              {userSettings?.banking.accounts.map((account) => (
                <div key={account._id} className="mt-4 flex items-center space-x-2">
                  <span className="text-sm font-medium">{account.name}:</span>
                  <span className="text-sm text-muted-foreground">
                    ₹{account.balance.toLocaleString()}
                  </span>
                </div>
              ))}

              <div className="mt-4">
                <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
                <span className="text-sm text-muted-foreground">
                  ₹{userSettings?.monthlyBudget.toLocaleString() || 0}
                </span>
              </div>

              <div className="mt-4">
                <CardTitle className="text-sm font-medium">Savings Goals</CardTitle>
                {userSettings?.savingsGoals.map((goal) => (
                  <div key={goal._id} className="mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{goal.name}</span>
                      <span className="text-sm">
                        ₹{goal.currentAmount} / ₹{goal.targetAmount}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(goal.currentAmount / goal.targetAmount) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Spending Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalSpent}</div>
              <p className="text-xs text-muted-foreground">{dateToday}</p>
              {spendings.length < 3 ? (
                <>
                  <SkeletonCard />
                  <p className="text-center text-gray-700">Not enough data</p>
                </>
              ) : (
                <SpendingChart data={spendings} />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <DialogPrompt />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spendings.slice(0, 5).map((spending, index) => (
                  <div key={index} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {spending.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(spending.date)}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      <span
                        className={
                          spending.selectValue === "spent"
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        ₹{spending.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="mt-4 w-full" onClick={handleNavigate}>
                View All Transactions
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Bills & Payments
              </CardTitle>
              <DialogPrompt2 />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billSpendings.slice(0, 5).map((bill, index) => (
                  <div key={index} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {bill.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        on {formatDate(bill.date)}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      <span
                        className={
                          bill.selectValue === "spent"
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        ₹{bill.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="mt-4 w-full">
                View All Bills & Payments
              </Button>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Top Spending Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {combinedCategories.length < 3 ? (
                <>
                  <CategoryChartSkeleton />
                  <p className="text-center text-gray-700">Not enough data</p>
                </>
              ) : (
                <CategoryChart data={combinedCategories} />
              )}
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-sm font-medium">Total Balance</p>
                  <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalBalance >= 0 ? '+' : ''}₹{Math.abs(totalBalance)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">You Owe</p>
                  <p className="text-2xl font-bold text-red-600">-₹{totalOwed}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">You are Owed</p>
                  <p className="text-2xl font-bold text-green-600">₹{totalOwedToYou}</p>
                </div>
              </div>
              
              {friendBalances.map((balance) => (
                <div key={balance.friend._id} className="flex items-center mb-4">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`/avatars/${balance.friend.username.toLowerCase()}.png`} alt={balance.friend.username} />
                    <AvatarFallback>{balance.friend.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {balance.friend.username}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    <span className={balance.totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {balance.totalBalance >= 0 ? '+' : ''}₹{Math.abs(balance.totalBalance)}
                    </span>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="link" 
                className="mt-4 w-full"
                onClick={() => navigate('/friends')}
              >
                See More Friends
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}