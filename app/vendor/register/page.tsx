"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "../../context/LanguageContext"
import { useStore } from "../../store/useStore"
import { ChefHat, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, Globe, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function VendorRegister() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const { setUser } = useStore()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formProgress, setFormProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    // Calculate form progress
    const filledFields = Object.values(formData).filter((value) => value.trim() !== "").length
    const totalFields = Object.keys(formData).length + 1 // +1 for language
    const progress = ((filledFields + (language ? 1 : 0)) / totalFields) * 100
    setFormProgress(progress)
  }, [formData, language])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
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
      const response = await fetch('http://localhost:8000/vendor/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.name,
          phone: formData.phone,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Registration failed')
      }

      const user = {
        id: Date.now().toString(),
        name: formData.name,
        phone: formData.phone,
        type: "vendor" as const,
        language: language,
      }

      setUser(user)
      toast({
        title: "🎉 Registration Successful!",
        description: "Welcome to RasoiSetu. Let's set up your products.",
      })

      router.push("/vendor/onboarding")
    } catch (error) {
      toast({
        title: "❌ Registration Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
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

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" }
    if (password.length < 4) return { strength: 25, label: "Weak", color: "bg-red-500" }
    if (password.length < 6) return { strength: 50, label: "Fair", color: "bg-yellow-500" }
    if (password.length < 8) return { strength: 75, label: "Good", color: "bg-blue-500" }
    return { strength: 100, label: "Strong", color: "bg-green-500" }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-float"></div>
      <div
        className="absolute bottom-20 right-10 w-24 h-24 bg-red-200 rounded-full opacity-20 animate-float"
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
              <ChefHat className="h-10 w-10 text-orange-500 mr-3 animate-float" />
              <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              RasoiSetu
            </span>
          </div>

          <CardTitle className="text-2xl mb-2">{t("vendor_registration")}</CardTitle>
          <CardDescription className="text-gray-600">
            Join thousands of vendors already using our platform
          </CardDescription>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(formProgress)}%</span>
            </div>
            <Progress value={formProgress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center">
                {t("name")}
                {formData.name && <CheckCircle className="h-4 w-4 text-green-500 ml-2" />}
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`transition-all duration-300 ${
                  errors.name
                    ? "border-red-500 focus:border-red-500"
                    : formData.name
                      ? "border-green-500 focus:border-green-500"
                      : "focus:border-orange-500"
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center animate-slideInLeft">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center">
                {t("phone")}
                {formData.phone && <CheckCircle className="h-4 w-4 text-green-500 ml-2" />}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`transition-all duration-300 ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500"
                    : formData.phone
                      ? "border-green-500 focus:border-green-500"
                      : "focus:border-orange-500"
                }`}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 flex items-center animate-slideInLeft">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center">
                {t("password")}
                {formData.password && passwordStrength.strength >= 75 && (
                  <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                )}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`pr-10 transition-all duration-300 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : formData.password && passwordStrength.strength >= 75
                        ? "border-green-500 focus:border-green-500"
                        : "focus:border-orange-500"
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

              {formData.password && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Password strength:</span>
                    <span
                      className={`font-medium ${
                        passwordStrength.strength >= 75
                          ? "text-green-600"
                          : passwordStrength.strength >= 50
                            ? "text-blue-600"
                            : passwordStrength.strength >= 25
                              ? "text-yellow-600"
                              : "text-red-600"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-sm text-red-500 flex items-center animate-slideInLeft">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                {t("select_language")}
                {language && <CheckCircle className="h-4 w-4 text-green-500 ml-2" />}
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="focus:border-orange-500">
                  <SelectValue placeholder="Choose your preferred language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                  <SelectItem value="hi">🇮🇳 हिंदी (Hindi)</SelectItem>
                  <SelectItem value="gu">🇮🇳 ગુજરાતી (Gujarati)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full btn-gradient text-white hover-lift py-6 text-lg font-semibold relative overflow-hidden"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  {t("register")}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto text-orange-500 hover:text-orange-600">
                Sign In
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
              <Globe className="h-3 w-3 mr-1" />
              Multilingual
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
