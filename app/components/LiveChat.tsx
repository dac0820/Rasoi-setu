"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Phone, Video, MoreVertical, ServerIcon as Online } from "lucide-react"
import { useStore } from "../store/useStore"

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderType: "vendor" | "seller"
  content: string
  timestamp: Date
  read: boolean
}

interface ChatUser {
  id: string
  name: string
  type: "vendor" | "seller"
  avatar?: string
  online: boolean
  lastSeen?: Date
}

export function LiveChat() {
  const { user } = useStore()
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [chatUsers] = useState<ChatUser[]>([
    {
      id: "1",
      name: "Rajesh Kumar",
      type: "seller",
      online: true,
      avatar: "/placeholder.svg?height=40&width=40&text=RK",
    },
    {
      id: "2",
      name: "Priya Sharma",
      type: "seller",
      online: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 30),
      avatar: "/placeholder.svg?height=40&width=40&text=PS",
    },
    {
      id: "3",
      name: "Mumbai Vada Pav",
      type: "vendor",
      online: true,
      avatar: "/placeholder.svg?height=40&width=40&text=MV",
    },
  ])

  const [sampleMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      senderId: "1",
      senderName: "Rajesh Kumar",
      senderType: "seller",
      content: "Hello! I have fresh potatoes available at ₹30/kg. Interested?",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      read: true,
    },
    {
      id: "2",
      senderId: user?.id || "current",
      senderName: user?.name || "You",
      senderType: user?.type || "vendor",
      content: "Yes, I need 50kg. What's the quality like?",
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      read: true,
    },
    {
      id: "3",
      senderId: "1",
      senderName: "Rajesh Kumar",
      senderType: "seller",
      content: "Grade A quality, freshly harvested yesterday. I can deliver by 2 PM today.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
    },
  ])

  useEffect(() => {
    if (selectedChat) {
      setMessages(sampleMessages.filter((m) => m.senderId === selectedChat || m.senderId === user?.id))
    }
  }, [selectedChat, user?.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user?.id || "current",
      senderName: user?.name || "You",
      senderType: user?.type || "vendor",
      content: message,
      timestamp: new Date(),
      read: false,
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage("")

    // Simulate response
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: selectedChat,
        senderName: chatUsers.find((u) => u.id === selectedChat)?.name || "User",
        senderType: chatUsers.find((u) => u.id === selectedChat)?.type || "seller",
        content: "Thanks for your message! I'll get back to you shortly.",
        timestamp: new Date(),
        read: false,
      }
      setMessages((prev) => [...prev, response])
    }, 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  }

  const selectedUser = chatUsers.find((u) => u.id === selectedChat)

  return (
    <Card className="h-[600px] flex border-0 shadow-xl bg-white">
      {/* Chat List */}
      <div className="w-1/3 border-r flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
            Messages
          </CardTitle>
          <CardDescription>Connect with suppliers and vendors</CardDescription>
        </CardHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {chatUsers.map((chatUser) => (
              <div
                key={chatUser.id}
                onClick={() => setSelectedChat(chatUser.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedChat === chatUser.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={chatUser.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {chatUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {chatUser.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{chatUser.name}</p>
                      <Badge variant={chatUser.type === "seller" ? "default" : "secondary"} className="text-xs">
                        {chatUser.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      {chatUser.online ? (
                        <>
                          <Online className="h-3 w-3 mr-1 text-green-500" />
                          Online
                        </>
                      ) : (
                        `Last seen ${chatUser.lastSeen ? formatTime(chatUser.lastSeen) : "recently"}`
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedUser?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedUser?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedUser?.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      {selectedUser?.online ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Online
                        </>
                      ) : (
                        "Offline"
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] ${msg.senderId === user?.id ? "order-2" : "order-1"}`}>
                      <div
                        className={`rounded-lg p-3 ${
                          msg.senderId === user?.id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-1">{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-600">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
