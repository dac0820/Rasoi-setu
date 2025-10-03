"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "../context/LanguageContext"
import { useStore } from "../store/useStore"
import { User, Package, ShoppingCart, Mic, Settings, LogOut, X, Globe } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Sidebar({ isOpen, onClose, onLogout }) {
  const { language, setLanguage, t } = useLanguage()
  const { user } = useStore()

  const menuItems = [
    { icon: User, label: "profile", href: "/vendor/profile" },
    { icon: Package, label: "inventory", href: "/vendor/inventory" },
    { icon: ShoppingCart, label: "orders", href: "/vendor/orders" },
    { icon: Mic, label: "voice_assistant", action: "voice" },
    { icon: Settings, label: "Settings", href: "/vendor/settings" },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:shadow-none md:border-r
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="md:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500">Vendor</p>
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Language</span>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="gu">ગુજરાતી</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      if (item.action === "voice") {
                        // Handle voice assistant
                      }
                      onClose()
                    }}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {t(item.label)}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              {t("logout")}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
