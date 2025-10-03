"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Sun, CloudRain, MapPin, Thermometer } from "lucide-react"

export function WeatherWidget() {
  const [weather, setWeather] = useState({
    location: "Mumbai, India",
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    icon: "partly-cloudy",
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate weather API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      default:
        return <Cloud className="h-8 w-8 text-gray-400" />
    }
  }

  const getWeatherAdvice = (condition, temperature) => {
    if (condition.includes("Rain") || condition.includes("rain")) {
      return { message: "Good day for hot food sales!", color: "bg-blue-100 text-blue-800" }
    }
    if (temperature > 30) {
      return { message: "Perfect for cold drinks!", color: "bg-orange-100 text-orange-800" }
    }
    return { message: "Great weather for street food!", color: "bg-green-100 text-green-800" }
  }

  const advice = getWeatherAdvice(weather.condition, weather.temperature)

  if (isLoading) {
    return (
      <Card className="hover-lift">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover-lift bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-3 w-3 mr-1" />
            {weather.location}
          </div>
          {getWeatherIcon(weather.icon)}
        </div>

        <div className="flex items-center mb-2">
          <Thermometer className="h-4 w-4 text-red-500 mr-2" />
          <span className="text-2xl font-bold text-gray-900">{weather.temperature}°C</span>
        </div>

        <p className="text-sm text-gray-600 mb-3">{weather.condition}</p>

        <div className="flex justify-between text-xs text-gray-500 mb-3">
          <span>Humidity: {weather.humidity}%</span>
          <span>Wind: {weather.windSpeed} km/h</span>
        </div>

        <Badge className={`w-full justify-center ${advice.color}`}>{advice.message}</Badge>
      </CardContent>
    </Card>
  )
}
