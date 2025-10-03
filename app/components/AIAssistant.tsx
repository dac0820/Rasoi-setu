"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, Sparkles } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI business assistant. I can help you with inventory management, sales predictions, and business insights. What would you like to know?",
      timestamp: new Date(),
      suggestions: ["Check inventory", "Sales forecast", "Best selling items", "Supplier recommendations"],
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: getAIResponse(input),
        timestamp: new Date(),
        suggestions: getAISuggestions(input),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (query: string) => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("inventory") || lowerQuery.includes("stock")) {
      return "Based on your current inventory, I notice you're running low on potatoes (5 units left) and onions (8 units left). I recommend reordering from your trusted suppliers. Your bread stock is healthy at 45 units."
    }

    if (lowerQuery.includes("sales") || lowerQuery.includes("forecast")) {
      return "Your sales have increased by 15% this week! Based on weather data and historical patterns, I predict strong demand for hot items like vada pav and samosas tomorrow. Consider stocking up on related ingredients."
    }

    if (lowerQuery.includes("supplier") || lowerQuery.includes("recommend")) {
      return "I recommend connecting with 'Fresh Farm Supplies' for vegetables - they have a 4.8-star rating and offer 10% bulk discounts. For spices, 'Spice Kingdom' provides premium quality at competitive prices."
    }

    return "I understand you're looking for business insights. I can help with inventory management, sales forecasting, supplier recommendations, and market trends. What specific area would you like to explore?"
  }

  const getAISuggestions = (query: string) => {
    return ["Optimize inventory", "Find new suppliers", "Analyze trends", "Cost reduction tips"]
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  return (
    <Card className="h-[500px] flex flex-col border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <div className="relative">
            <Bot className="h-6 w-6 text-blue-500 mr-2" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          AI Business Assistant
          <Badge className="ml-2 bg-blue-100 text-blue-800">
            <Sparkles className="h-3 w-3 mr-1" />
            Smart
          </Badge>
        </CardTitle>
        <CardDescription>Get intelligent insights for your business</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback
                      className={message.type === "user" ? "bg-orange-500 text-white" : "bg-blue-500 text-white"}
                    >
                      {message.type === "user" ? "U" : "AI"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${message.type === "user" ? "bg-orange-500 text-white" : "bg-white border shadow-sm"}`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-6 bg-blue-50 border-blue-200 hover:bg-blue-100"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-500 text-white">AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-white border shadow-sm rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-white">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your business..."
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} className="bg-blue-500 hover:bg-blue-600">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
