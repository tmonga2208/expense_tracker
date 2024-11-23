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
  const [username, setUsername] = useState("")

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

    const fetchBillData = async () => {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/bill-form-data", {
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

    const user = localStorage.getItem("username")
    setUsername(user || "")

    fetchData()
    fetchBillData()
  }, [])

  const totalSpent = spendings
    .filter((spending) => spending.selectValue === "spent")
    .reduce((total, spending) => total + spending.amount, 0)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const dateToday = formatDate(new Date().toISOString())

  return (
    <div className="bg-gray-100 min-h-screen p-8">
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

