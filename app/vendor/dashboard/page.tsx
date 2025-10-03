"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "../../context/LanguageContext"
import { useStore } from "../../store/useStore"
import {
  ChefHat,
  Mic,
  ShoppingCart,
  AlertTriangle,
  LogOut,
  Package,
  TrendingUp,
  Star,
  Zap,
  Target,
  Calendar,
  Clock,
  Sparkles,
  Gift,
  Award,
  Heart,
  Moon,
  Sun,
  Monitor,
  MessageCircle,
  BarChart3,
  Trophy,
  Brain,
} from "lucide-react"
import { VoiceAssistantModal } from "../../components/VoiceAssistantModal"
import { Sidebar } from "../../components/Sidebar"
import { NotificationBell } from "../../components/NotificationBell"
import { WeatherWidget } from "../../components/WeatherWidget"
import { AIAssistant } from "../../components/AIAssistant"
import { LiveChat } from "../../components/LiveChat"
import { AdvancedAnalytics } from "../../components/AdvancedAnalytics"
import { GamificationSystem } from "../../components/GamificationSystem"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "../../components/ThemeProvider"

const productIngredients = {
  dabeli: ["bread", "potato", "onion", "masala"],
  vadapav: ["bread", "potato", "oil", "flour"],
  dosa: ["rice", "dal", "oil"],
  idli: ["rice", "dal"],
  pav_bhaji: ["bread", "potato", "onion", "masala"],
  samosa: ["flour", "potato", "oil"],
  dhokla: ["flour", "dal"],
  kachori: ["flour", "dal", "oil"],
}

// Safe theme hook that doesn't throw errors
const useThemeSafe = () => {
  try {
    const { useTheme } = require("../../components/ThemeProvider")
    return useTheme()
  } catch {
    return {
      theme: "light" as const,
      setTheme: () => {},
      actualTheme: "light" as const,
    }
  }
}

export default function VendorDashboard() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user, products, setUser } = useStore()
  const { theme, setTheme } = useTheme() // Moved useTheme hook to top level
  const { toast } = useToast()

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [dailyGoal, setDailyGoal] = useState(75)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    setIsVisible(true)
    if (!user || user.type !== "vendor") {
      router.push("/vendor/register")
    }
  }, [user, router])

  if (!user) return null

  const getSuggestedMaterials = () => {
    const allIngredients = new Set()
    user.products?.forEach((product) => {
      productIngredients[product]?.forEach((ingredient) => {
        allIngredients.add(ingredient)
      })
    })

    return Array.from(allIngredients).map((ingredient) => {
      const product = products.find((p) => p.name.toLowerCase() === ingredient)
      return product || { name: ingredient, price: 0, stock: 0, supplier: "Unknown", rating: 0 }
    })
  }

  const suggestedMaterials = getSuggestedMaterials()
  const lowStockItems = products.filter((p) => p.stock < 20)

  const handleBuyNow = (productName: unknown) => {
    toast({
      title: "🛒 Order Placed!",
      description: `Your order for ${productName} has been placed successfully.`,
    })
  }

  const handleLogout = () => {
    setUser(null)
    router.push("/")
  }

  const handleThemeToggle = () => {
    try {
      const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
      setTheme(nextTheme)
    } catch {
      console.log("Theme provider not available")
    }
  }

  const quickStats = [
    {
      label: "Today's Sales",
      value: "₹2,450",
      change: "+12%",
      color: "text-green-600",
      icon: <TrendingUp className="h-4 w-4" />,
      bgColor: "from-green-50 to-emerald-50",
    },
    {
      label: "Orders",
      value: "23",
      change: "+5",
      color: "text-blue-600",
      icon: <ShoppingCart className="h-4 w-4" />,
      bgColor: "from-blue-50 to-indigo-50",
    },
    {
      label: "Rating",
      value: "4.8",
      change: "+0.2",
      color: "text-yellow-600",
      icon: <Star className="h-4 w-4" />,
      bgColor: "from-yellow-50 to-orange-50",
    },
    {
      label: "Streak",
      value: "7 days",
      change: "🔥",
      color: "text-orange-600",
      icon: <Award className="h-4 w-4" />,
      bgColor: "from-orange-50 to-red-50",
    },
  ]

  const themeIcons = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    system: <Monitor className="h-4 w-4" />,
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-orange-100 dark:border-gray-700 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="mr-4 md:hidden hover-lift"
              >
                <Package className="h-5 w-5" />
              </Button>
              <div className="flex items-center">
                <ChefHat className="h-6 w-6 text-orange-500 mr-2 animate-float" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  RasoiSetu
                </h1>
                <Badge className="ml-2 bg-green-100 text-green-800 animate-pulse">Live</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <Button variant="outline" size="sm" onClick={handleThemeToggle} className="hover-lift bg-transparent">
                {themeIcons[theme] || <Sun className="h-4 w-4" />}
              </Button>
              <NotificationBell />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVoiceModalOpen(true)}
                className="hidden sm:flex hover-lift border-green-200 hover:border-green-300"
              >
                <Mic className="h-4 w-4 mr-2" />
                {t("voice_assistant")}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hover-lift">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section with Animation */}
            <div className={`mb-8 ${isVisible ? "animate-slideInBottom" : "opacity-0"}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    {t("welcome")}, {user.name}!
                    <Sparkles className="h-6 w-6 text-yellow-500 ml-2 animate-pulse" />
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Here are your personalized recommendations and alerts
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date().toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date().toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Daily Goal Progress */}
              <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Target className="h-6 w-6 mr-2" />
                      <span className="font-semibold">Daily Sales Goal</span>
                    </div>
                    <Badge className="bg-white/20 text-white">{dailyGoal}% Complete</Badge>
                  </div>
                  <Progress value={dailyGoal} className="h-3 bg-white/20" />
                  <p className="text-sm mt-2 opacity-90">₹2,450 of ₹3,000 target achieved</p>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Dashboard Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <TabsTrigger value="overview" className="flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger value="gamification" className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Rewards
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Inventory
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Quick Stats */}
                <div
                  className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 ${isVisible ? "animate-slideInLeft" : "opacity-0"}`}
                >
                  {quickStats.map((stat, index) => (
                    <Card key={index} className={`hover-lift bg-gradient-to-br ${stat.bgColor} border-0 shadow-lg`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-2 rounded-full bg-white/80 ${stat.color}`}>{stat.icon}</div>
                          <span className="text-xs text-gray-600 dark:text-gray-300">{stat.change}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Weather Widget and Quick Actions */} 
                <div
                  className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 ${isVisible ? "animate-slideInRight" : "opacity-0"}`}
                >
                  <WeatherWidget />

                  <Card className="cursor-pointer hover-lift bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0 shadow-lg group">
                    <CardContent className="p-6 text-center">
                      <ShoppingCart className="h-12 w-12 text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold mb-2">Quick Order</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Order frequently used items</p>
                    </CardContent>
                  </Card>

                  <Card
                    className="cursor-pointer hover-lift bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-0 shadow-lg group"
                    onClick={() => setIsVoiceModalOpen(true)}
                  >
                    <CardContent className="p-6 text-center">
                      <Mic className="h-12 w-12 text-green-500 mx-auto mb-4 group-hover:scale-110 transition-transform animate-pulse" />
                      <h3 className="font-semibold mb-2">{t("voice_assistant")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Ask for ingredient suggestions</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover-lift bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-0 shadow-lg group">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="h-12 w-12 text-purple-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold mb-2">{t("analytics")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">View your business insights</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Low Stock Alerts with Enhanced UI */}
                {lowStockItems.length > 0 && (
                  <Card
                    className={`mb-8 border-0 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 shadow-lg animate-glow ${isVisible ? "animate-slideInLeft" : "opacity-0"}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center text-orange-800 dark:text-orange-200">
                        <AlertTriangle className="h-5 w-5 mr-2 animate-bounce" />
                        {t("out_of_stock")}
                        <Badge className="ml-2 bg-red-500 text-white animate-pulse">{lowStockItems.length} items</Badge>
                      </CardTitle>
                      <CardDescription className="text-orange-700 dark:text-orange-300">
                        These items are running low in stock - reorder now to avoid stockouts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lowStockItems.map((item, index) => (
                          <div
                            key={item.id}
                            className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-l-red-500 shadow-md hover-lift ${isVisible ? "animate-scaleIn" : "opacity-0"}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <div className="flex-1">
                              <h4 className="font-medium flex items-center">
                                {t(item.name.toLowerCase())}
                                <Zap className="h-4 w-4 text-red-500 ml-2" />
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Stock: {item.stock} units</p>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                                <div
                                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${(item.stock / 50) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="ml-4 btn-gradient text-white hover-lift"
                              onClick={() => handleBuyNow(item.name)}
                            >
                              <Gift className="h-4 w-4 mr-1" />
                              Reorder
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Enhanced Suggested Raw Materials */}
                <Card
                  className={`shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${isVisible ? "animate-slideInBottom" : "opacity-0"}`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-orange-500" />
                      {t("suggested_materials")}
                      <Badge className="ml-2 bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">
                        AI Powered
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Based on your selected products: {user.products?.map((p) => t(p)).join(", ")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {suggestedMaterials.map((material, index) => (
                        <Card
                          key={index}
                          className={`hover-lift border-0 shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 group ${isVisible ? "animate-scaleIn" : "opacity-0"}`}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="font-semibold text-lg flex items-center group-hover:text-orange-600 transition-colors">
                                {t(material.name.toLowerCase())}
                                <Heart className="h-4 w-4 ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </h3>
                              {material.stock < 20 && (
                                <Badge variant="destructive" className="text-xs animate-pulse">
                                  {t("low_stock")}
                                </Badge>
                              )}
                            </div>

                            <div className="space-y-3 mb-6">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Price:</span>
                                <span className="font-medium text-green-600">₹{material.price}/kg</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Stock:</span>
                                <span className="font-medium">{material.stock} units</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Supplier:</span>
                                <span className="font-medium text-blue-600">{material.supplier}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Rating:</span>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span className="font-medium ml-1">{material.rating}/10</span>
                                </div>
                              </div>

                              {/* Stock level indicator */}
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    material.stock > 30
                                      ? "bg-green-500"
                                      : material.stock > 15
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  }`}
                                  style={{ width: `${Math.min((material.stock / 50) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>

                            <Button
                              className="w-full btn-gradient text-white hover-lift group-hover:scale-105 transition-transform"
                              onClick={() => handleBuyNow(material.name)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {t("buy_now")}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <AdvancedAnalytics />
              </TabsContent>

              <TabsContent value="chat">
                <LiveChat />
              </TabsContent>

              <TabsContent value="ai">
                <AIAssistant />
              </TabsContent>

              <TabsContent value="gamification">
                <GamificationSystem />
              </TabsContent>

              <TabsContent value="inventory">
                <Card className="hover-lift border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="h-5 w-5 mr-2 text-blue-500" />
                      Inventory Management
                      <Badge className="ml-2 bg-blue-100 text-blue-800">Coming Soon</Badge>
                    </CardTitle>
                    <CardDescription>Advanced inventory tracking and management tools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Advanced Inventory Features
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Comprehensive inventory management with real-time tracking, automated reordering, and predictive
                        analytics.
                      </p>
                      <Button className="btn-gradient text-white">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Request Early Access
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <VoiceAssistantModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />
    </div>
  )
}
