"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Target, Zap, Crown, Medal, Award, Gift, Users, Calendar, Flame } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  progress: number
  maxProgress: number
  completed: boolean
  reward: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface LeaderboardEntry {
  rank: number
  name: string
  points: number
  avatar?: string
  badge?: string
}

export function GamificationSystem() {
  const [userLevel, setUserLevel] = useState(12)
  const [userXP, setUserXP] = useState(2450)
  const [nextLevelXP] = useState(3000)
  const [totalPoints, setTotalPoints] = useState(15680)
  const [streak, setStreak] = useState(7)

  const achievements: Achievement[] = [
    {
      id: "1",
      title: "First Sale",
      description: "Complete your first sale",
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      progress: 1,
      maxProgress: 1,
      completed: true,
      reward: "50 XP",
      rarity: "common",
    },
    {
      id: "2",
      title: "Sales Master",
      description: "Reach 100 total sales",
      icon: <Target className="h-6 w-6 text-blue-500" />,
      progress: 87,
      maxProgress: 100,
      completed: false,
      reward: "500 XP + Special Badge",
      rarity: "rare",
    },
    {
      id: "3",
      title: "Streak Champion",
      description: "Maintain 30-day sales streak",
      icon: <Flame className="h-6 w-6 text-orange-500" />,
      progress: 7,
      maxProgress: 30,
      completed: false,
      reward: "1000 XP + Crown Badge",
      rarity: "epic",
    },
    {
      id: "4",
      title: "Community Leader",
      description: "Help 50 other vendors",
      icon: <Users className="h-6 w-6 text-green-500" />,
      progress: 23,
      maxProgress: 50,
      completed: false,
      reward: "2000 XP + Legendary Status",
      rarity: "legendary",
    },
  ]

  const leaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      name: "Rajesh Kumar",
      points: 25680,
      avatar: "/placeholder.svg?height=40&width=40&text=RK",
      badge: "👑",
    },
    {
      rank: 2,
      name: "Priya Sharma",
      points: 23450,
      avatar: "/placeholder.svg?height=40&width=40&text=PS",
      badge: "🥈",
    },
    {
      rank: 3,
      name: "Mohammed Ali",
      points: 21200,
      avatar: "/placeholder.svg?height=40&width=40&text=MA",
      badge: "🥉",
    },
    { rank: 4, name: "You", points: 15680, badge: "⭐" },
    { rank: 5, name: "Sunita Devi", points: 14200, avatar: "/placeholder.svg?height=40&width=40&text=SD" },
  ]

  const dailyChallenges = [
    {
      id: "1",
      title: "Early Bird",
      description: "Make your first sale before 10 AM",
      reward: "100 XP",
      progress: 0,
      maxProgress: 1,
      timeLeft: "2h 30m",
    },
    {
      id: "2",
      title: "Customer Favorite",
      description: "Get 5-star rating from 3 customers",
      reward: "200 XP",
      progress: 1,
      maxProgress: 3,
      timeLeft: "8h 15m",
    },
    {
      id: "3",
      title: "Inventory Master",
      description: "Update inventory 5 times today",
      reward: "150 XP",
      progress: 3,
      maxProgress: 5,
      timeLeft: "12h 45m",
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-300 bg-gray-50"
      case "rare":
        return "border-blue-300 bg-blue-50"
      case "epic":
        return "border-purple-300 bg-purple-50"
      case "legendary":
        return "border-yellow-300 bg-yellow-50"
      default:
        return "border-gray-300 bg-gray-50"
    }
  }

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case "common":
        return <Badge variant="secondary">Common</Badge>
      case "rare":
        return <Badge className="bg-blue-100 text-blue-800">Rare</Badge>
      case "epic":
        return <Badge className="bg-purple-100 text-purple-800">Epic</Badge>
      case "legendary":
        return <Badge className="bg-yellow-100 text-yellow-800">Legendary</Badge>
      default:
        return <Badge variant="secondary">Common</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* User Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6 text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">{userLevel}</span>
              </div>
              <Crown className="h-6 w-6 text-yellow-500 absolute -top-2 -right-2" />
            </div>
            <h3 className="font-semibold text-blue-900">Level {userLevel}</h3>
            <p className="text-sm text-blue-700">Vendor Master</p>
            <Progress value={(userXP / nextLevelXP) * 100} className="mt-3" />
            <p className="text-xs text-blue-600 mt-1">
              {userXP}/{nextLevelXP} XP
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-green-900">{totalPoints.toLocaleString()}</h3>
            <p className="text-sm text-green-700">Total Points</p>
            <Badge className="mt-2 bg-green-100 text-green-800">Rank #4</Badge>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6 text-center">
            <div className="relative mb-4">
              <Flame className="h-12 w-12 text-orange-500 mx-auto animate-pulse" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{streak}</span>
              </div>
            </div>
            <h3 className="font-semibold text-orange-900">{streak} Days</h3>
            <p className="text-sm text-orange-700">Sales Streak</p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="p-6 text-center">
            <Medal className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="font-semibold text-purple-900">12</h3>
            <p className="text-sm text-purple-700">Achievements</p>
            <Badge className="mt-2 bg-purple-100 text-purple-800">75% Complete</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Gamification Tabs */}
      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="challenges">Daily Challenges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`hover-lift border-2 ${getRarityColor(achievement.rarity)} ${
                  achievement.completed ? "ring-2 ring-green-500" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {achievement.icon}
                      <div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <CardDescription>{achievement.description}</CardDescription>
                      </div>
                    </div>
                    {getRarityBadge(achievement.rarity)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        <Gift className="h-3 w-3 mr-1" />
                        {achievement.reward}
                      </Badge>
                      {achievement.completed && (
                        <Badge className="bg-green-100 text-green-800">
                          <Award className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <Card className="hover-lift border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Today's Challenges
                <Badge className="ml-2 bg-blue-100 text-blue-800">3 Active</Badge>
              </CardTitle>
              <CardDescription>Complete daily challenges to earn bonus XP</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyChallenges.map((challenge) => (
                  <div key={challenge.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{challenge.title}</h4>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-orange-100 text-orange-800 mb-1">{challenge.reward}</Badge>
                        <p className="text-xs text-gray-500">{challenge.timeLeft} left</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Progress value={(challenge.progress / challenge.maxProgress) * 100} className="flex-1 mr-3" />
                      <span className="text-sm font-medium">
                        {challenge.progress}/{challenge.maxProgress}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="hover-lift border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                Weekly Leaderboard
                <Badge className="ml-2 bg-yellow-100 text-yellow-800">This Week</Badge>
              </CardTitle>
              <CardDescription>Top performers in your region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      entry.name === "You" ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-bold">
                        {entry.rank <= 3 ? entry.badge : entry.rank}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={entry.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {entry.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{entry.name}</p>
                        <p className="text-sm text-gray-600">{entry.points.toLocaleString()} points</p>
                      </div>
                    </div>
                    {entry.badge && entry.rank <= 3 && <div className="text-2xl">{entry.badge}</div>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6 text-center">
                <Gift className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-green-900 mb-2">Free Delivery</h3>
                <p className="text-sm text-green-700 mb-4">Get free delivery on your next order</p>
                <Badge className="bg-green-100 text-green-800 mb-3">500 Points</Badge>
                <Button className="w-full bg-green-500 hover:bg-green-600">Redeem</Button>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold text-blue-900 mb-2">Premium Features</h3>
                <p className="text-sm text-blue-700 mb-4">Unlock advanced analytics for 1 month</p>
                <Badge className="bg-blue-100 text-blue-800 mb-3">1000 Points</Badge>
                <Button className="w-full bg-blue-500 hover:bg-blue-600">Redeem</Button>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
              <CardContent className="p-6 text-center">
                <Crown className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold text-purple-900 mb-2">VIP Status</h3>
                <p className="text-sm text-purple-700 mb-4">Get priority support and exclusive features</p>
                <Badge className="bg-purple-100 text-purple-800 mb-3">2500 Points</Badge>
                <Button className="w-full bg-purple-500 hover:bg-purple-600">Redeem</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
