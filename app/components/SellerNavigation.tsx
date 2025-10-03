"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "../store/useStore"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, Settings, LogOut, Package, TrendingUp, MessageCircle } from "lucide-react"

export function SellerNavigation() {
  const { user, setUser } = useStore()
  const router = useRouter()

  const handleLogout = () => {
    setUser(null)
    router.push("/")
  }

  const navItems = [
    { icon: Package, label: "Dashboard", href: "/seller/dashboard" },
    { icon: TrendingUp, label: "Analytics", href: "/seller/analytics" },
    { icon: MessageCircle, label: "Orders", href: "/seller/orders" },
    { icon: User, label: "Profile", href: "/seller/profile" },
    { icon: Settings, label: "Settings", href: "/seller/settings" },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-xl font-bold">RasoiSetu Seller</span>
              <Badge className="ml-2 bg-blue-100 text-blue-800">Pro</Badge>
            </div>

            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(item.href)}
                  className="flex items-center"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">Verified Seller</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
