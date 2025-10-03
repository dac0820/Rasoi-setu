"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "../../context/LanguageContext"
import { useStore } from "../../store/useStore"
import { ChefHat, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, ShoppingCart, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SellerLogin() {
  const router = useRouter()
  const { t } = useLanguage()
  const { setUser, sellers } = useStore()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/seller/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Login failed')
      }

      const data = await response.json()
      
      const user = {
        id: data.seller.id,
        name: data.seller.name,
        phone: data.seller.phone,
        email: data.seller.email,
        type: "seller" as const,
        language: "en",
        isVerified: true,
      }

      setUser(user)
      toast({
        title: "🎉 Login Successful!",
        description: `Welcome back, ${data.seller.name}!`,
      })

      
      router.push(`/seller/dashboard`)
      
       
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials or account not approved yet.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleDemoLogin = () => {
    // Auto-fill with demo credentials
    setFormData({
      email: "priya@example.com",
      password: "demo123",
    })
    toast({
      title: "Demo Credentials Filled",
      description: "Click login to access the demo seller account.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-float"></div>
      <div
        className="absolute bottom-20 right-10 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <Card
        className={`w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm ${isVisible ? "animate-scaleIn" : "opacity-0"}`}
      >
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="absolute left-4 top-4 hover-lift"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <ChefHat className="h-10 w-10 text-blue-500 mr-3 animate-float" />
              <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              RasoiSetu
            </span>
          </div>

          <CardTitle className="text-2xl mb-2">Seller Login</CardTitle>
          <CardDescription className="text-gray-600">Access your supplier dashboard and manage orders</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                Email
                {formData.email && <CheckCircle className="h-4 w-4 text-green-500 ml-2" />}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`transition-all duration-300 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : formData.email
                      ? "border-green-500 focus:border-green-500"
                      : "focus:border-blue-500"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center animate-slideInLeft">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center">
                Password
                {formData.password && <CheckCircle className="h-4 w-4 text-green-500 ml-2" />}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`pr-10 transition-all duration-300 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : formData.password
                        ? "border-green-500 focus:border-green-500"
                        : "focus:border-blue-500"
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-500 flex items-center animate-slideInLeft">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white hover-lift py-6 text-lg font-semibold relative overflow-hidden"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Demo Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or try demo</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 border-blue-200 hover:border-blue-300 hover:bg-blue-50 bg-transparent"
              onClick={handleDemoLogin}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Use Demo Account
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-blue-500 hover:text-blue-600"
                onClick={() => router.push("/seller/register")}
              >
                Register Here
              </Button>
            </p>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 flex justify-center space-x-4">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Secure
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <ShoppingCart className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
