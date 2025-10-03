"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "../../context/LanguageContext"
import { useStore } from "../../store/useStore"
import { ChefHat, Package, TrendingUp, Users, ShoppingCart, Settings, LogOut } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const mockSalesData = [
  { name: "Potato", sales: 120 },
  { name: "Onion", sales: 98 },
  { name: "Masala", sales: 86 },
  { name: "Oil", sales: 75 },
  { name: "Rice", sales: 65 },
  { name: "Dal", sales: 54 },
]

const mockOrders = [
  { id: "1", vendor: "Raj Dabeli Stall", product: "Potato", quantity: 10, amount: 300, status: "delivered" },
  { id: "2", vendor: "Mumbai Vada Pav", product: "Bread", quantity: 50, amount: 1250, status: "pending" },
  { id: "3", vendor: "South Indian Corner", product: "Rice", quantity: 25, amount: 1500, status: "confirmed" },
  { id: "4", vendor: "Spice Junction", product: "Masala", quantity: 5, amount: 400, status: "delivered" },
]

export default function SellerDashboard() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user, setUser, sellers } = useStore()

 
  const handleLogout = () => {
    setUser(null)
    router.push("/")
  }

  if (!user || user.type !== "seller") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <ShoppingCart className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">Seller Access Required</h2>
            <p className="text-gray-600 mb-4">Please log in to access your seller dashboard.</p>
            <div className="space-y-2">
              <Button onClick={() => router.push("/seller/login")} className="w-full">
                Login to Dashboard
              </Button>
              <Button variant="outline" onClick={() => router.push("/seller/register")} className="w-full">
                Register as Seller
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Sales",
      value: "₹45,230",
      icon: TrendingUp,
      color: "text-green-500",
      change: "+12%",
    },
    {
      title: "Active Orders",
      value: "23",
      icon: ShoppingCart,
      color: "text-blue-500",
      change: "+5%",
    },
    {
      title: "Products Listed",
      value: "8",
      icon: Package,
      color: "text-purple-500",
      change: "+2",
    },
    {
      title: "Vendor Partners",
      value: "156",
      icon: Users,
      color: "text-orange-500",
      change: "+18%",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500"
      case "confirmed":
        return "bg-blue-500"
      case "pending":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <ChefHat className="h-6 w-6 text-blue-500 mr-2" />
              <h1 className="text-2xl font-bold">RasoiSetu Seller</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t("welcome")}, {user.name}!
          </h2>
          <p className="text-gray-600">Manage your products and track your sales performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    <span className="text-xs text-green-600 mt-1">{stat.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Product Sales Analytics
              </CardTitle>
              <CardDescription>Units sold by product category this month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Recent Orders
              </CardTitle>
              <CardDescription>Latest orders from vendor partners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{order.vendor}</h4>
                      <p className="text-sm text-gray-600">
                        {order.product} × {order.quantity} units
                      </p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-semibold">₹{order.amount}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Add New Product</h3>
              <p className="text-sm text-gray-600">List a new product for vendors</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Update Inventory</h3>
              <p className="text-sm text-gray-600">Manage your stock levels</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Vendor Network</h3>
              <p className="text-sm text-gray-600">Connect with more vendors</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
