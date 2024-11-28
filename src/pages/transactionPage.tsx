import React from 'react'
import { ArrowLeft, ArrowDown, ArrowUp, Search } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import AdminPanelLayout from '../components/admin-panel/admin-panel-layout'
import { useNavigate } from 'react-router-dom'

interface Transaction {
  id: string
  date: Date
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
}

const transactions: Transaction[] = [
  { id: '1', date: new Date('2024-11-25'), description: 'New Expense', amount: 199, type: 'expense', category: 'Miscellaneous' },
  { id: '2', date: new Date('2024-11-08'), description: 'Food', amount: 500, type: 'expense', category: 'Dining' },
  { id: '3', date: new Date('2024-11-28'), description: 'mantu', amount: 130, type: 'expense', category: 'Groceries' },
  { id: '4', date: new Date('2024-11-15'), description: 'Salary', amount: 5000, type: 'income', category: 'Salary' },
  { id: '5', date: new Date('2024-11-20'), description: 'Utilities', amount: 100, type: 'expense', category: 'Bills' },
]

export default function TransactionsPage() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/dashboard');
  }

  return (
    <AdminPanelLayout>
      <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-4" onClick={handleNavigate}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Transactions</h1>
        </div>
        <Button>Add Transaction</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input type="search" placeholder="Search transactions..." className="pl-8" />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expenses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{format(transaction.date, 'MMM d, yyyy')}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <Badge variant="outline">{transaction.category}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'income' ? <ArrowUp className="inline mr-1 h-4 w-4" /> : <ArrowDown className="inline mr-1 h-4 w-4" />}
                    ₹{transaction.amount.toFixed(2)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    </AdminPanelLayout>
  )
}

