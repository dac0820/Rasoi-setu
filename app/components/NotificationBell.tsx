"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, Package, AlertTriangle, CheckCircle, X } from "lucide-react"

export function NotificationBell() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "alert",
      title: "Low Stock Alert",
      message: "Potato stock is running low (5 units left)",
      time: "2 min ago",
      read: false,
      icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
    },
    {
      id: 2,
      type: "order",
      title: "New Order Received",
      message: "Order #1234 from Mumbai Vada Pav",
      time: "5 min ago",
      read: false,
      icon: <Package className="h-4 w-4 text-blue-500" />,
    },
    {
      id: 3,
      type: "success",
      title: "Payment Received",
      message: "₹1,250 received for Order #1233",
      time: "1 hour ago",
      read: true,
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative hover-lift">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <CardDescription>
              {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="mt-1">{notification.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 w-6 p-0 hover:bg-blue-100"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="h-6 w-6 p-0 hover:bg-red-100"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
