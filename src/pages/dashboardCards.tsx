import { useEffect, useState } from "react";
import { ChartComponent } from "../components/chart";
import { CircleChartComponent } from "../components/chartCirlce";
import { DialogPrompt } from "../components/DialogPrompt";
import { DialogPrompt2 } from "../components/DialogPrompt2";

function DashboardCards() {
  interface Spending {
    title: string;
    amount: number;
    selectValue: string;
    category: string;
    date: string;
    description: string;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  interface BillSpending {
    title: string;
    amount: number;
    selectValue: string;
    category: string;
    date: string;
    description: string;
  }

  const [billSpendings, setBillSpendings] = useState<BillSpending[]>([]);
  const [spendings, setSpendings] = useState<Spending[]>([]);
  const [username, setUsername] = useState('');

  const dateToday = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/form-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setSpendings(data);
        console.log(data);
      } else {
        alert(data.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData2 = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/bill-form-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setBillSpendings(data);
        console.log(data);
      } else {
        alert(data.message);
      }
    };

    fetchData2();
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('username');
    setUsername(user || '');
  }, [username]);

  // Calculate total spent
  const totalSpent = spendings
    .filter(spending => spending.selectValue === 'spent')
    .reduce((total, spending) => total + spending.amount, 0);

  // Prepare data for the chart
  const chartDataMap = new Map();

  spendings.forEach(spending => {
    const day = new Date(spending.date).getDate().toString();
    if (chartDataMap.has(day)) {
      chartDataMap.set(day, chartDataMap.get(day) + spending.amount);
    } else {
      chartDataMap.set(day, spending.amount);
    }
  });

  const chartData = Array.from(chartDataMap, ([month, amount]) => ({ month, amount }));

// Prepare data for the circle chart
const categoryAmountMap = new Map();

spendings.forEach(spending => {
  if (categoryAmountMap.has(spending.category)) {
    categoryAmountMap.set(spending.category, categoryAmountMap.get(spending.category) + spending.amount);
  } else {
    categoryAmountMap.set(spending.category, spending.amount);
  }
});

const circleChartData = Array.from(categoryAmountMap, ([category, amount]) => ({ category, amount }));

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="p-2 m-2">
        <h1 className="text-2xl font-bold">Hello {username}&#128075;</h1>
      </div>
      <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Accounts Section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-1">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Accounts</h2>
            <DialogPrompt />
          </div>
          <p className="text-xl font-bold text-gray-700">Net Worth</p>
          <p className={`text-2xl font-semibold mb-6`}>
            &#8377;5,00,000
          </p>
          <div className="flex justify-between">
            <div className="font-semibold text-gray-600 mb-1">Banking</div>
            <p className="text-gray-500 mb-4">&#8377;5,00,000</p>
          </div>
        </div>

        {/* Spending Plan Section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900">Spending Plan</h2>
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">{dateToday}</p>
            <p className="text-3xl font-bold text-gray-700">&#8377;{totalSpent}</p>
          </div>
          {/* Chart with transactions data */}
          <ChartComponent data={chartData} />
        </div>

        {/* Spent Section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2 lg:col-span-1">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
            <DialogPrompt/>
          </div>
          <div>
            <p className="text-gray-500 text-sm ">Latest Transactions</p>
            {spendings.slice(0, 5).map((spending, index) => (
              <p key={index} className="flex justify-between text-gray-700">
                {spending.title}
                <span className={spending.selectValue === 'spent' ? 'text-red-600' : 'text-green-600'}>
                  {spending.amount}
                </span>
              </p>
            ))}
            <p className="text-purple-600 text-sm font-semibold mt-4 cursor-pointer">Show All</p>
          </div>
        </div>

        {/* Bills & Payments Section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-1 lg:col-span-1">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Bills & Payments</h2>
            <DialogPrompt2/>
          </div>
          <div>
            <div className="mb-4">
              {billSpendings.slice(0, 5).map((billSpending, index) => (
                <div key={index}>
                  <p className="text-gray-700 flex justify-between">{billSpending.title} <span className={billSpending.selectValue === 'spent' ? 'text-red-600' : 'text-green-600'}>{billSpending.amount}</span></p>
                  <p className="text-sm text-gray-500">on {formatDate(billSpending.date)}</p>
                  </div>
                  ))}
            </div>
          </div>
          <p className="text-purple-600 text-sm font-semibold mt-4 cursor-pointer">See All Bills & Payments</p>
        </div>

        {/* Top Spending Categories Section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Spending Categories</h2>
          {/* Circle chart with transactions data */}
          <CircleChartComponent data={circleChartData} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-4 lg:col-span-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Friends</h2>
          {/* Friend Lists */}
          <div className="flex justify-between border border-2">
            <p className="p-2">Total Balance<span className="text-red-600 m-2">-100</span></p>
            <p className="p-2">You Owe<span className="text-red-600 m-2">-600</span></p>
            <p className="p-2">You are Owed<span className="text-green-600 m-2">500</span></p>
          </div>
          <p className="flex justify-between text-gray-700 m-1 p-1">Ayush<span className="text-green-600">+200</span></p>
          <p className="flex justify-between text-gray-700 m-1 p-1">Arnav<span className="text-red-600">-500</span></p>
          <p className="flex justify-between text-gray-700 m-1 p-1">Piyush<span className="text-green-600">+300</span></p>
          <p className="flex justify-between text-gray-700 m-1 p-1">Siddhanth<span className="text-red-600">-100</span></p>
          <p className="cursor-pointer text-gray-500 m-1 p-1">See More</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;