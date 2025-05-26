"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import { TrendingUp } from "lucide-react"

export default function ProfitChart() {
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalCost, setTotalCost] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await axios.get('https://localhost:5001/api/Orders')
        const orders = ordersResponse.data

        const profits = await Promise.all(
          orders.map(order => 
            axios.get(`https://localhost:5001/api/Orders/${order.id}/profit`)
              .then(res => res.data)
              .catch(() => null) 
          )
        )

   
        const monthlyData = {}

        orders.forEach((order, index) => {
          const profitData = profits[index]
          if (!profitData) return 

          const date = new Date(order.orderDate)
          const month = date.toLocaleString('default', { month: 'long' })
          const year = date.getFullYear()
          const monthYear = `${month} ${year}`

          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = {
              revenue: 0,  
              cost: 0      
            }
          }

          monthlyData[monthYear].revenue += profitData.totalSellingPrice
          monthlyData[monthYear].cost += profitData.totalActualCost
        })

        const formattedData = Object.keys(monthlyData).map(month => ({
          month,
          revenue: monthlyData[month].revenue,
          cost: monthlyData[month].cost
        }))

        // Считаем общие суммы
        const totalRev = formattedData.reduce((sum, item) => sum + item.revenue, 0)
        const totalCst = formattedData.reduce((sum, item) => sum + item.cost, 0)

        setChartData(formattedData)
        setTotalRevenue(totalRev)
        setTotalCost(totalCst)
        setLoading(false)

      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div>Загрузка данных...</div>
    </div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Анализ прибыли и затрат
        </CardTitle>
        <CardDescription>Выручка и затраты по месяцам</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <BarChart
            width={Math.max(600, chartData.length * 100)}
            height={300}
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value.toFixed(2)}`, value === 'revenue' ? 'Выручка' : 'Затраты']}
              labelFormatter={(label) => `Месяц: ${label}`}
            />
            <Legend />
            <Bar 
              dataKey="revenue" 
              name="Выручка (грязная прибыль)" 
              fill="#4ade80" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="cost" 
              name="Затраты" 
              fill="#f87171" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-sm text-muted-foreground">Общая выручка</h3>
            <p className="text-2xl font-bold">{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-sm text-muted-foreground">Общие затраты</h3>
            <p className="text-2xl font-bold">{totalCost.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}