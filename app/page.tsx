"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "./store/useStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "./context/LanguageContext"
import {
  ChefHat,
  Users,
  ShoppingCart,
  Mic,
  Globe,
  TrendingUp,
  Star,
  Shield,
  Zap,
  Heart,
  ArrowRight,
  Play,
  CheckCircle,
  MapPin,
  Clock,
  Award,
  Smartphone,
} from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const { user } = useStore()
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    if (user) {
      if (user.type === "vendor") {
        router.push("/vendor/dashboard")
      } else if (user.type === "seller") {
        router.push("/seller/dashboard")
      } else if (user.type === "admin") {
        router.push("/admin")
      }
    }
  }, [user, router])

  const features = [
    {
      icon: <ChefHat className="h-8 w-8 text-orange-500" />,
      title: "Street Food Vendors",
      description: "Connect with verified suppliers for your raw materials",
      gradient: "gradient-orange",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Raw Material Sellers",
      description: "Reach thousands of vendors and grow your business",
      gradient: "gradient-blue",
    },
    {
      icon: <Mic className="h-8 w-8 text-green-500" />,
      title: "AI Voice Assistant",
      description: "Get product suggestions in your preferred language",
      gradient: "gradient-green",
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-500" />,
      title: "Multilingual Support",
      description: "Available in English, Hindi, and Gujarati",
      gradient: "gradient-purple",
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-red-500" />,
      title: "Smart Inventory",
      description: "Get alerts when your stock is running low",
      gradient: "from-red-400 to-pink-500",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-indigo-500" />,
      title: "Analytics Dashboard",
      description: "Track your sales and optimize your business",
      gradient: "from-indigo-400 to-purple-500",
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Dabeli Vendor, Mumbai",
      content: "RasoiSetu ne mera business badal diya! Ab main easily suppliers dhund sakta hun.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60&text=RK",
    },
    {
      name: "Priya Sharma",
      role: "Masala Supplier, Delhi",
      content: "This platform helped me connect with 100+ vendors in just 2 months!",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60&text=PS",
    },
    {
      name: "Mohammed Ali",
      role: "Dosa Corner Owner",
      content: "Voice assistant feature is amazing! I can order ingredients while cooking.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60&text=MA",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Active Vendors", icon: <Users className="h-6 w-6" /> },
    { number: "5,000+", label: "Verified Suppliers", icon: <Shield className="h-6 w-6" /> },
    { number: "50,000+", label: "Orders Completed", icon: <CheckCircle className="h-6 w-6" /> },
    { number: "25+", label: "Cities Covered", icon: <MapPin className="h-6 w-6" /> },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className={`flex items-center ${isVisible ? "animate-slideInLeft" : "opacity-0"}`}>
              <div className="relative">
                <ChefHat className="h-8 w-8 text-orange-500 mr-2 animate-float" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                RasoiSetu
              </h1>
              <Badge className="ml-2 bg-orange-100 text-orange-800 animate-glow">Beta</Badge>
            </div>
            <div className={`flex space-x-3 ${isVisible ? "animate-slideInRight" : "opacity-0"}`}>
              <Button
                variant="outline"
                onClick={() => router.push("/vendor/register")}
                className="hover-lift border-orange-200 hover:border-orange-300"
              >
                <Users className="h-4 w-4 mr-2" />
                Vendor Login
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (user && user.type === "seller") {
                    router.push("/seller/dashboard")
                  } else {
                    router.push("/seller/login")
                  }
                }}
                className="hover-lift border-blue-200 hover:border-blue-300"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {user && user.type === "seller" ? "Seller Dashboard" : "Seller Login"}
              </Button>
              <Button onClick={() => router.push("/admin")} className="btn-gradient text-white hover-lift">
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-red-400/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className={`${isVisible ? "animate-slideInBottom" : "opacity-0"}`}>
            <Badge className="mb-6 bg-orange-100 text-orange-800 px-4 py-2 text-sm animate-scaleIn">
              🚀 Now Available in 3 Languages
            </Badge>
            <h2 className="text-4xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Empowering Street Food
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 animate-float">
                {" "}
                Vendors
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with verified suppliers, get AI-powered suggestions, and manage your inventory with our
              multilingual platform designed for Indian street food vendors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="btn-gradient text-white hover-lift px-8 py-4 text-lg"
                onClick={() => router.push("/vendor/register")}
              >
                <ChefHat className="h-5 w-5 mr-2" />
                Start as Vendor
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/seller/register")}
                className="hover-lift px-8 py-4 text-lg border-2 border-orange-200 hover:border-orange-300"
              >
                <Users className="h-5 w-5 mr-2" />
                Join as Seller
              </Button>
            </div>

            {/* Demo Video Button */}
            <div className="flex justify-center">
              <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 group">
                <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo Video
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-32 h-32 bg-red-200 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center group hover-lift ${isVisible ? "animate-scaleIn" : "opacity-0"}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full text-white group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-800">Features</Badge>
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Why Choose RasoiSetu?</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built specifically for the Indian street food ecosystem with cutting-edge technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`text-center hover-lift border-0 shadow-lg bg-white/80 backdrop-blur-sm group ${isVisible ? "animate-slideInBottom" : "opacity-0"}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`p-4 rounded-full bg-gradient-to-r ${feature.gradient} text-white group-hover:scale-110 transition-transform shadow-lg`}
                    >
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800">Testimonials</Badge>
            <h3 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h3>
            <p className="text-lg text-gray-600">Real stories from real vendors and sellers</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <Card className="glass border-0 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-xl text-gray-700 mb-6 italic">
                    "{testimonials[activeTestimonial].content}"
                  </blockquote>
                  <div className="flex items-center justify-center">
                    <img
                      src={testimonials[activeTestimonial].image || "/placeholder.svg"}
                      alt={testimonials[activeTestimonial].name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonials[activeTestimonial].name}</div>
                      <div className="text-gray-600 text-sm">{testimonials[activeTestimonial].role}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeTestimonial ? "bg-orange-500 scale-125" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="animate-slideInBottom">
            <h3 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h3>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join thousands of vendors and sellers already using RasoiSetu to grow their business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push("/vendor/register")}
                className="hover-lift bg-white text-orange-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
              >
                <Zap className="h-5 w-5 mr-2" />
                Get Started Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg bg-transparent"
              >
                <Smartphone className="h-5 w-5 mr-2" />
                Download App
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-24 h-24 border-2 border-white/20 rounded-full animate-float"></div>
        <div
          className="absolute bottom-10 right-10 w-32 h-32 border-2 border-white/20 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <ChefHat className="h-8 w-8 text-orange-500 mr-3" />
                <span className="text-2xl font-bold">RasoiSetu</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Connecting street food vendors with quality suppliers across India. Empowering local businesses with
                technology.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <Heart className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <Smartphone className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">For Vendors</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Find Suppliers</li>
                <li className="hover:text-white transition-colors cursor-pointer">AI Suggestions</li>
                <li className="hover:text-white transition-colors cursor-pointer">Inventory Management</li>
                <li className="hover:text-white transition-colors cursor-pointer">Voice Assistant</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">For Sellers</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Reach Vendors</li>
                <li className="hover:text-white transition-colors cursor-pointer">Verification Process</li>
                <li className="hover:text-white transition-colors cursor-pointer">Analytics Dashboard</li>
                <li className="hover:text-white transition-colors cursor-pointer">Order Management</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact Us</li>
                <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                &copy; 2024 RasoiSetu. All rights reserved. Made with ❤️ in India
              </p>
              <div className="flex items-center space-x-4">
                <Badge className="bg-green-100 text-green-800">
                  <Clock className="h-3 w-3 mr-1" />
                  24/7 Support
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  <Award className="h-3 w-3 mr-1" />
                  Verified Platform
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
