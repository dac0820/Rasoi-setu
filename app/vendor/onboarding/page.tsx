"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "../../context/LanguageContext"
import { useStore } from "../../store/useStore"
import { ChefHat, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const foodItems = [
  { id: "dabeli", key: "dabeli" },
  { id: "vadapav", key: "vadapav" },
  { id: "dosa", key: "dosa" },
  { id: "idli", key: "idli" },
  { id: "pav_bhaji", key: "pav_bhaji" },
  { id: "samosa", key: "samosa" },
  { id: "dhokla", key: "dhokla" },
  { id: "kachori", key: "kachori" },
  { id: "biryani", key: "biryani" },
  { id: "pizza", key: "pizza" },
  { id: "burger", key: "burger" },
  { id: "sandwich", key: "sandwich" },
  { id: "momos", key: "momos" },
  { id: "chaat", key: "chaat" },
  { id: "paratha", key: "paratha" },
  { id: "noodles", key: "noodles" },
  { id: "roll", key: "roll" },
  { id: "pasta", key: "pasta" },
  { id: "chinese", key: "chinese" },
  { id: "south_indian", key: "south_indian" },
  { id: "north_indian", key: "north_indian" },
  { id: "desserts", key: "desserts" },
  { id: "beverages", key: "beverages" },
  { id: "snacks", key: "snacks" },
]

export default function VendorOnboarding() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user, setUser } = useStore()
  const { toast } = useToast()

  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [otherItems, setOtherItems] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    try {
      if (!user || user.type !== "vendor") {
        router.push("/vendor/register")
      }
    } catch (error) {
      console.error("Error checking user authentication:", error)
      toast({
        title: "Authentication Error",
        description: "Please try logging in again.",
        variant: "destructive",
      })
      router.push("/vendor/register")
    }
  }, [user, router, toast])

  const handleProductToggle = (productId: string) => {
    try {
      setSelectedProducts((prev) =>
        prev.includes(productId) 
          ? prev.filter((id) => id !== productId) 
          : [...prev, productId]
      )
    } catch (error) {
      console.error("Error toggling product:", error)
      toast({
        title: "Error",
        description: "Failed to update product selection.",
        variant: "destructive",
      })
    }
  }

  const handleOtherItemsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherItems(e.target.value)
  }

  const parseOtherItems = (otherItemsText: string): string[] => {
    if (!otherItemsText.trim()) return []
    
    return otherItemsText
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .map(item => item.toLowerCase().replace(/\s+/g, '_'))
  }

  const handleContinue = async () => {
    try {
      setIsLoading(true)
      
      const otherItemsArray = parseOtherItems(otherItems)
      const allSelectedProducts = [...selectedProducts, ...otherItemsArray]

      if (allSelectedProducts.length === 0) {
        toast({
          title: "Please select at least one product",
          description: "We need to know what you sell to suggest raw materials.",
          variant: "destructive",
        })
        return
      }

      if (!user) {
        throw new Error("User not found")
      }

      const updatedUser = {
        ...user,
        products: allSelectedProducts,
        otherProducts: otherItemsArray.length > 0 ? otherItems : undefined
      }

      setUser(updatedUser)
      
      toast({
        title: "Products saved successfully!",
        description: "Redirecting to your dashboard...",
      })
      
      // Small delay to show the success message
      setTimeout(() => {
        router.push("/vendor/dashboard")
      }, 1000)
      
    } catch (error) {
      console.error("Error saving products:", error)
      toast({
        title: "Error saving products",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    try {
      router.push("/vendor/register")
    } catch (error) {
      console.error("Error navigating back:", error)
      toast({
        title: "Navigation Error",
        description: "Failed to go back. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const totalSelectedCount = selectedProducts.length + parseOtherItems(otherItems).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="absolute left-4 top-4"
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="h-8 w-8 text-orange-500 mr-2" />
            <span className="text-2xl font-bold">RasoiSetu</span>
          </div>
          <CardTitle className="text-2xl">{t("select_products")}</CardTitle>
          <CardDescription>
            Help us suggest the right raw materials for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {foodItems.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  id={item.id}
                  checked={selectedProducts.includes(item.id)}
                  onCheckedChange={() => handleProductToggle(item.id)}
                  disabled={isLoading}
                />
                <label
                  htmlFor={item.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {t(item.key)}
                </label>
              </div>
            ))}
          </div>

          {/* Other Items Section */}
          <div className="mb-6 p-4 border-2 border-dashed border-gray-200 rounded-lg">
            <Label htmlFor="other-items" className="text-sm font-medium mb-2 block">
              Other Food Items (separate with commas)
            </Label>
            <Input
              id="other-items"
              placeholder="e.g., Falafel, Tacos, Spring Rolls, Thai Curry"
              value={otherItems}
              onChange={handleOtherItemsChange}
              disabled={isLoading}
              className="w-full"
            />
            {otherItems.trim() && (
              <p className="text-xs text-gray-500 mt-2">
                Preview: {parseOtherItems(otherItems).join(", ")} 
                ({parseOtherItems(otherItems).length} items)
              </p>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Selected: {totalSelectedCount} products
            </p>
            <Button
              onClick={handleContinue}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
              disabled={totalSelectedCount === 0 || isLoading}
            >
              {isLoading ? "Saving..." : `${t("continue")} to ${t("dashboard")}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}