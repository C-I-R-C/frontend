import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function ProfitChart2() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Get all orders
        const ordersResponse = await axios.get('https://localhost:1984/api/Orders');
        const orders = ordersResponse.data;

        // 2. Get profit data for each order
        const profits = await Promise.all(
          orders.map(order => 
            axios.get(`https://localhost:1984/api/Orders/${order.id}/profit`)
              .then(res => res.data)
              .catch(() => null) // Ignore errors for individual orders
          )
        );

        // 3. Group data by day
        const dailyData = {};

        orders.forEach((order, index) => {
          const profitData = profits[index];
          if (!profitData) return;

          const date = new Date(order.orderCompleteDate);
          const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format

          if (!dailyData[dateKey]) {
            dailyData[dateKey] = { profit: 0, cost: 0 };
          }

          dailyData[dateKey].profit += profitData.finalProfit;
          dailyData[dateKey].cost += profitData.totalActualCost;
        });

        // 4. Format data for chart
        const formattedData = Object.keys(dailyData).map(date => ({
          date,
          profit: dailyData[date].profit,
          cost: dailyData[date].cost
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setChartData(formattedData);
        setLoading(false);
      } catch (err) {
        setError('Error loading data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (chartData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">Daily Profit Chart</h2>
      <p className="text-gray-600 mb-4">Profit and costs by order completion date</p>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                `${Number(value).toFixed(2)}`, 
                name === 'profit' ? 'Profit' : 'Costs'
              ]}
              labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
            />
            <Area 
              type="monotone" 
              dataKey="profit" 
              name="Profit"
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.4} 
            />
            <Area 
              type="monotone" 
              dataKey="cost" 
              name="Costs"
              stroke="#82ca9d" 
              fill="#82ca9d" 
              fillOpacity={0.4} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ProfitChart2;