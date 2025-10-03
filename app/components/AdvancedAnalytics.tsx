"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Target,
  Download,
  Filter,
  Zap,
  Brain,
} from "lucide-react"

const salesData = [
  { month: "Jan", sales: 45000, orders: 120, customers: 89 },
  { month: "Feb", sales: 52000, orders: 145, customers: 102 },
  { month: "Mar", sales: 48000, orders: 132, customers: 95 },
  { month: "Apr", sales: 61000, orders: 168, customers: 118 },
  { month: "May", sales: 55000, orders: 152, customers: 108 },
  { month: "Jun", sales: 67000, orders: 189, customers: 134 },
]

const productData = [
  { name: "Vada Pav", value: 35, color: "#ff6b6b" },
  { name: "Dosa", value: 25, color: "#4ecdc4" },
  { name: "Samosa", value: 20, color: "#45b7d1" },
  { name: "Dabeli", value: 15, color: "#f9ca24" },
  { name: "Others", value: 5, color: "#6c5ce7" },
]

const predictiveData = [
  { week: "Week 1", predicted: 15000, actual: 14500 },
  { week: "Week 2", predicted: 16500, actual: 16200 },
  { week: "Week 3", predicted: 18000, actual: 17800 },
  { week: "Week 4", predicted: 19500, actual: null },
  { week: "Week 5", predicted: 21000, actual: null },
]

export function AdvancedAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")

  const kpis = [
    {
      title: "Total Revenue",
      value: "₹3,28,000",
      change: "+15.3%",
      trend: "up",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: "906",
      change: "+8.7%",
      trend: "up",
      icon: <Package className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      title: "Avg Order Value",
      value: "₹362",
      change: "+6.2%",
      trend: "up",
      icon: <Target className="h-5 w-5" />,
      color: "text-purple-600",
    },
    {
      title: "Customer Retention",
      value: "78%",
      change: "-2.1%",
      trend: "down",
      icon: <Users className="h-5 w-5" />,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="h-8 w-8 text-purple-500 mr-3" />
            Advanced Analytics
            <Badge className="ml-3 bg-purple-100 text-purple-800">
              <Zap className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </h2>
          <p className="text-gray-600 mt-1">Deep insights into your business performance</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="hover-lift border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-gray-100 ${kpi.color}`}>{kpi.icon}</div>
                <div className={`flex items-center text-sm ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {kpi.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
              <div className="text-sm text-gray-600">{kpi.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend */}
            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  Sales Trend
                </CardTitle>
                <CardDescription>Monthly sales performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Sales"]} />
                    <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Orders vs Customers */}
            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-500" />
                  Orders vs Customers
                </CardTitle>
                <CardDescription>Relationship between orders and customer acquisition</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={3} />
                    <Line type="monotone" dataKey="customers" stroke="#f59e0b" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Performance */}
            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-purple-500" />
                  Product Distribution
                </CardTitle>
                <CardDescription>Sales breakdown by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {productData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Best sellers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productData.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: product.color }}></div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress value={product.value} className="w-20" />
                        <span className="text-sm font-medium">{product.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <Card className="hover-lift border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-500" />
                Sales Prediction
                <Badge className="ml-2 bg-purple-100 text-purple-800">AI Model</Badge>
              </CardTitle>
              <CardDescription>Machine learning predictions for upcoming weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={predictiveData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value?.toLocaleString()}`, ""]} />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual Sales" />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#6366f1"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    name="Predicted Sales"
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">AI Predictions</h4>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li>• Expected 23% growth in next 2 weeks</li>
                  <li>• Peak sales predicted for Week 5 (₹21,000)</li>
                  <li>• Recommend increasing inventory by 15%</li>
                  <li>• Weather forecast suggests high demand for hot items</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Zap className="h-5 w-5 mr-2" />
                  Smart Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-white rounded-lg border-l-4 border-l-blue-500">
                    <h4 className="font-medium text-blue-900">Inventory Optimization</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Reduce potato orders by 20% and increase onion stock by 15% based on demand patterns.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border-l-4 border-l-green-500">
                    <h4 className="font-medium text-green-900">Peak Hours</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Your busiest hours are 12-2 PM and 6-8 PM. Consider special offers during off-peak times.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border-l-4 border-l-orange-500">
                    <h4 className="font-medium text-orange-900">Seasonal Trends</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      Hot snacks perform 40% better during monsoon. Prepare for upcoming weather changes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-900">
                  <Target className="h-5 w-5 mr-2" />
                  Growth Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-white rounded-lg border-l-4 border-l-purple-500">
                    <h4 className="font-medium text-purple-900">New Products</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Consider adding Pav Bhaji to your menu. 73% demand increase in your area.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border-l-4 border-l-red-500">
                    <h4 className="font-medium text-red-900">Supplier Optimization</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Switch to "Fresh Farm Co" for vegetables - 12% cost savings with better quality ratings.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border-l-4 border-l-indigo-500">
                    <h4 className="font-medium text-indigo-900">Market Expansion</h4>
                    <p className="text-sm text-indigo-700 mt-1">
                      Nearby office complex shows high demand. Consider setting up a stall there.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
