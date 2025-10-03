"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, BarChart3, LineChartIcon, Activity } from "lucide-react"

const salesData = [
  { name: "Mon", sales: 120, orders: 15, revenue: 3600 },
  { name: "Tue", sales: 98, orders: 12, revenue: 2940 },
  { name: "Wed", sales: 156, orders: 19, revenue: 4680 },
  { name: "Thu", sales: 134, orders: 16, revenue: 4020 },
  { name: "Fri", sales: 189, orders: 23, revenue: 5670 },
  { name: "Sat", sales: 234, orders: 28, revenue: 7020 },
  { name: "Sun", sales: 201, orders: 24, revenue: 6030 },
]

export function EnhancedChart() {
  const [chartType, setChartType] = useState("bar")
  const [metric, setMetric] = useState("sales")

  const chartTypes = [
    { id: "bar", label: "Bar Chart", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "line", label: "Line Chart", icon: <LineChartIcon className="h-4 w-4" /> },
    { id: "area", label: "Area Chart", icon: <Activity className="h-4 w-4" /> },
  ]

  const metrics = [
    { id: "sales", label: "Sales", color: "#3b82f6" },
    { id: "orders", label: "Orders", color: "#10b981" },
    { id: "revenue", label: "Revenue", color: "#f59e0b" },
  ]

  const renderChart = () => {
    const commonProps = {
      data: salesData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={metric}
              stroke={metrics.find((m) => m.id === metric)?.color}
              strokeWidth={3}
              dot={{ fill: metrics.find((m) => m.id === metric)?.color, strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        )
      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={metrics.find((m) => m.id === metric)?.color}
              fill={metrics.find((m) => m.id === metric)?.color}
              fillOpacity={0.3}
            />
          </AreaChart>
        )
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={metric} fill={metrics.find((m) => m.id === metric)?.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        )
    }
  }

  return (
    <Card className="hover-lift border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              Weekly Performance
            </CardTitle>
            <CardDescription>Your business metrics for the past week</CardDescription>
          </div>
          <Badge className="bg-green-100 text-green-800">+15% vs last week</Badge>
        </div>

        {/* Chart Controls */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex gap-1">
            {chartTypes.map((type) => (
              <Button
                key={type.id}
                variant={chartType === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType(type.id)}
                className="hover-lift"
              >
                {type.icon}
                <span className="ml-1 hidden sm:inline">{type.label}</span>
              </Button>
            ))}
          </div>

          <div className="flex gap-1">
            {metrics.map((metricOption) => (
              <Button
                key={metricOption.id}
                variant={metric === metricOption.id ? "default" : "outline"}
                size="sm"
                onClick={() => setMetric(metricOption.id)}
                className="hover-lift"
                style={{
                  backgroundColor: metric === metricOption.id ? metricOption.color : undefined,
                  borderColor: metricOption.color,
                }}
              >
                {metricOption.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{salesData.reduce((sum, day) => sum + day.sales, 0)}</div>
            <div className="text-sm text-gray-600">Total Sales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {salesData.reduce((sum, day) => sum + day.orders, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              ₹{salesData.reduce((sum, day) => sum + day.revenue, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
