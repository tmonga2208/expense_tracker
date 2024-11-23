import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Gift, Receipt } from 'lucide-react'
import AdminPanelLayout from './admin-panel/admin-panel-layout'

interface Expense {
  date: string;
  month: string;
  day: string;
  icon: 'gift' | 'receipt';
  description: string;
  paidAmount: number;
  lentAmount: number;
  paidBy: string;
}

const expenses: Expense[] = [
  {
    date: 'NOVEMBER 2024',
    month: 'NOV',
    day: '03',
    icon: 'gift',
    description: 'Cake',
    paidAmount: 590.00,
    lentAmount: 73.75,
    paidBy: 'you'
  },
  {
    date: 'OCTOBER 2024',
    month: 'OCT',
    day: '01',
    icon: 'receipt',
    description: 'Blink',
    paidAmount: 361.00,
    lentAmount: 120.33,
    paidBy: 'Ayush'
  },
  {
    date: 'SEPTEMBER 2024',
    month: 'SEP',
    day: '30',
    icon: 'receipt',
    description: 'Food',
    paidAmount: 668.00,
    lentAmount: 222.67,
    paidBy: 'Ayush'
  },
]

export default function ExpenseDetails() {
    return (
      <AdminPanelLayout>
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 bg-orange-500">
            <AvatarImage src="/placeholder.svg" alt="User avatar" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
                  <h1 className="text-2xl font-semibold">Ayush</h1>
        </div>
        <div className="flex gap-3">
          <Button className="bg-orange-500 hover:bg-orange-600">
            Add an expense
          </Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600">
            Settle up
          </Button>
        </div>
      </div>

      {/* Expenses List */}
      <div className="space-y-6">
        {expenses.map((expense, index) => (
          <React.Fragment key={index}>
            <h2 className="text-sm font-medium text-gray-500 mb-3">{expense.date}</h2>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-gray-500 text-sm">
                    <div>{expense.month}</div>
                    <div className="text-xl">{expense.day}</div>
                  </div>
                  <div className={`p-2 rounded-lg ${expense.icon === 'gift' ? 'bg-pink-100' : 'bg-gray-100'}`}>
                    {expense.icon === 'gift' 
                      ? <Gift className="h-6 w-6 text-pink-500" aria-hidden="true" />
                      : <Receipt className="h-6 w-6 text-gray-500" aria-hidden="true" />
                    }
                  </div>
                  <div className="font-medium">{expense.description}</div>
                </div>
                <div className="flex gap-8">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{expense.paidBy === 'you' ? 'you paid' : `${expense.paidBy} paid`}</div>
                    <div className="font-semibold">₹{expense.paidAmount.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {expense.paidBy === 'you' ? 'you lent' : `${expense.paidBy} lent you`}
                    </div>
                    <div className={`font-semibold ${expense.paidBy === 'you' ? 'text-emerald-500' : 'text-orange-500'}`}>
                      ₹{expense.lentAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </React.Fragment>
        ))}

        {/* Settled Expenses Note */}
        <div className="text-center py-6">
          <p className="text-gray-500 mb-2">All expenses before this date have been settled up.</p>
          <Button variant="link" className="text-blue-500 hover:text-blue-600">
            Show settled expenses
          </Button>
        </div>
      </div>
            </div>
            </AdminPanelLayout>
  )
}

