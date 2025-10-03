"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "../../context/LanguageContext"
import { useStore } from "../../store/useStore"
import { ChefHat, ArrowLeft, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SellerRegister() {
  const router = useRouter()
  const { t } = useLanguage()
  const { addSeller } = useStore()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    products: "",
  })

  const [documents, setDocuments] = useState<{
    aadhar: File | null;
    pan: File | null;
    bank: File | null;
  }>({
    aadhar: null,
    pan: null,
    bank: null,
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.products.trim()) {
      newErrors.products = "Please specify what products you sell"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const response = await fetch('/api/seller/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          products: formData.products.split(",").map((p) => p.trim()),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }

      const data = await response.json()
      
      toast({
        title: "Registration Submitted!",
        description: "You are under verification. Admin will contact within 2 days.",
      })

      // Redirect to status page
      setTimeout(() => {
        router.push("/seller/status")
      }, 2000)
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileUpload = (field: string, file: File) => {
    setDocuments((prev) => ({ ...prev, [field]: file }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="absolute left-4 top-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <ChefHat className="h-8 w-8 text-blue-500 mr-2" />
            <span className="text-2xl font-bold">RasoiSetu</span>
          </div>
          <CardTitle className="text-2xl">{t("seller_registration")}</CardTitle>
          <CardDescription>Join our network of verified raw material suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="products">Products You Sell</Label>
              <Textarea
                id="products"
                placeholder="e.g., Potatoes, Onions, Masala, Oil (comma separated)"
                value={formData.products}
                onChange={(e) => handleInputChange("products", e.target.value)}
                className={errors.products ? "border-red-500" : ""}
              />
              {errors.products && <p className="text-sm text-red-500">{errors.products}</p>}
            </div>

            {/* Document Uploads */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Document Verification</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Aadhar Card */}
                <div className="space-y-2">
                  <Label>Aadhar Card</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload("aadhar", e.target.files[0])}
                      className="hidden"
                      id="aadhar-upload"
                    />
                    <label htmlFor="aadhar-upload" className="cursor-pointer">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {documents.aadhar ? documents.aadhar.name : "Upload Aadhar"}
                      </p>
                    </label>
                  </div>
                </div>

                {/* PAN Card */}
                <div className="space-y-2">
                  <Label>PAN Card</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload("pan", e.target.files[0])}
                      className="hidden"
                      id="pan-upload"
                    />
                    <label htmlFor="pan-upload" className="cursor-pointer">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">{documents.pan ? documents.pan.name : "Upload PAN"}</p>
                    </label>
                  </div>
                </div>

                {/* Bank Proof */}
                <div className="space-y-2">
                  <Label>Bank Proof</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload("bank", e.target.files[0])}
                      className="hidden"
                      id="bank-upload"
                    />
                    <label htmlFor="bank-upload" className="cursor-pointer">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {documents.bank ? documents.bank.name : "Upload Bank Proof"}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              {t("submit")} Application
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already registered?{" "}
              <Button variant="link" className="p-0 h-auto text-blue-500" onClick={() => router.push("/seller/status")}>
                Check Status
              </Button>
              {" | "}
              <Button variant="link" className="p-0 h-auto text-blue-500" onClick={() => router.push("/seller/login")}>
                Login Here
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
