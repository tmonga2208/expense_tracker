"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { SpendingChart } from "./comps/spending-chart"
import { CategoryChart } from "./comps/category-chart"
import { DialogPrompt } from "../components/DialogPrompt"
import { DialogPrompt3 } from "../components/DialogPrompt3"
import { DialogPrompt2 } from "../components/DialogPrompt2"
import { SkeletonCard } from "../components/SkeletonCard"
import { CategoryChartSkeleton } from "../components/categorySkeleton"
import { Check } from 'lucide-react'
import { cn } from "../lib/utils"

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
  
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [autoProgressStarted, setAutoProgressStarted] = useState(false)

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
        setIsAnimating(false)

        if (autoProgressStarted && currentStep < steps.length) {
          setTimeout(() => {
            setCurrentStep(prev => prev + 1)
            setIsAnimating(true)
          }, 4000) // 4-second gap between steps
        } else if (currentStep === steps.length) {
          setShowFinalModal(true);
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentStep, steps.length, autoProgressStarted])

  const handleStart = () => {
    if (currentStep === 0 && !isAnimating) {
      setIsAnimating(true)
      setCurrentStep(1)
      setAutoProgressStarted(true)
    }
  }

  const handlePlanMonthlyBudget = () => {
    setShowModal(true);
    handleStart();
  }

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
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Hello {username} 👋
        </h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accounts</CardTitle>
              <DialogPrompt3 />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹5,00,000</div>
              <p className="text-xs text-muted-foreground">Net Worth</p>
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-sm font-medium">Banking:</span>
                <span className="text-sm text-muted-foreground">₹5,00,000</span>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
                <span className="text-sm text-muted-foreground">₹30,000</span>
              </div>
              <div className="mt-4">
                <button 
                  className="text-blue-600 underline text-sm"
                  onClick={handlePlanMonthlyBudget}
                >
                  Plan Monthly Budget
                </button>
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
              <Button variant="link" className="mt-4 w-full">
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
              {spendings.length < 3 ? (
                <>
                  <CategoryChartSkeleton />
                  <p className="text-center text-gray-700">Not enough data</p>
                </>
              ) : (
                <CategoryChart data={spendings} />
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
                  <p className="text-2xl font-bold text-red-600">-₹100</p>
                </div>
                <div>
                  <p className="text-sm font-medium">You Owe</p>
                  <p className="text-2xl font-bold text-red-600">-₹600</p>
                </div>
                <div>
                  <p className="text-sm font-medium">You are Owed</p>
                  <p className="text-2xl font-bold text-green-600">₹500</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Ayush", amount: 200, color: "text-green-600" },
                  { name: "Arnav", amount: -500, color: "text-red-600" },
                  { name: "Piyush", amount: 300, color: "text-green-600" },
                  { name: "Siddhanth", amount: -100, color: "text-red-600" },
                ].map((friend, index) => (
                  <div key={index} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`/avatars/${friend.name.toLowerCase()}.png`} alt={friend.name} />
                      <AvatarFallback>{friend.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {friend.name}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      <span className={friend.color}>
                        {friend.amount > 0 ? "+" : ""}₹{Math.abs(friend.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="mt-4 w-full">
                See More Friends
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}