"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "../context/LanguageContext"
import { useStore } from "../store/useStore"
import { ChefHat, Check, X, Star, ArrowLeft, Users, Package, TrendingUp, Shield, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Seller {
  id: string
  name: string
  email: string
  phone: string
  products: string[]
  status: "pending" | "approved" | "rejected"
  rating: number
  documents?: any
}

interface SellerStats {
  total_sellers: number
  pending_applications: number
  approved_sellers: number
  rejected_applications: number
  approval_rate: number
}

export default function AdminPanel() {
  const router = useRouter()
  const { t } = useLanguage()
  const { products, updateProductRating, setUser, user } = useStore()
  const { toast } = useToast()

  const [productRatings, setProductRatings] = useState<Record<string, number>>({})
  const [pendingSellers, setPendingSellers] = useState<Seller[]>([])
  const [approvedSellers, setApprovedSellers] = useState<Seller[]>([])
  const [rejectedSellers, setRejectedSellers] = useState<Seller[]>([])
  const [sellerStats, setSellerStats] = useState<SellerStats | null>(null)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    // Check if user is already admin
    if (user && user.type === "admin") {
      setIsAdminLoggedIn(true)
    }
  }, [user])

  useEffect(() => {
    // Initialize product ratings
    const initialRatings: Record<string, number> = {}
    products.forEach((product) => {
      initialRatings[product.name] = product.rating
    })
    setProductRatings(initialRatings)
  }, [products])

  // Fetch all seller data
  const fetchAllData = async () => {
    if (!isAdminLoggedIn) return
    
    setLoading(true)
    try {
      // Fetch all data in parallel
      const [pendingRes, approvedRes, rejectedRes, statsRes] = await Promise.all([
        fetch('/api/seller/pending'),
        fetch('/api/seller/approved'),
        fetch('/api/seller/rejected'),
        fetch('/api/seller/stats')
      ])

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json()
        setPendingSellers(pendingData.data || [])
      }

      if (approvedRes.ok) {
        const approvedData = await approvedRes.json()
        setApprovedSellers(approvedData.data || [])
      }

      if (rejectedRes.ok) {
        const rejectedData = await rejectedRes.json()
        setRejectedSellers(rejectedData.data || [])
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setSellerStats(statsData.data || null)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch seller data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [isAdminLoggedIn])

  const handleAdminLogin = () => {
    const adminUser = {
      id: "admin",
      name: "Admin",
      phone: "+91 9999999999",
      type: "admin" as const,
      language: "en",
    }
    setUser(adminUser)
    setIsAdminLoggedIn(true)
    toast({
      title: "Admin Login",
      description: "Welcome to the admin panel!",
    })
  }

  const handleLogout = () => {
    setUser(null)
    setIsAdminLoggedIn(false)
    router.push("/")
  }

  const handleStatusUpdate = async (sellerId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/seller/${sellerId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Refresh all data after status update
        await fetchAllData()
        
        toast({
          title: `Seller ${newStatus}`,
          description: `The seller has been ${newStatus}.`,
          variant: newStatus === 'approved' ? "default" : "destructive",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || `Failed to ${newStatus} seller.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${newStatus} seller.`,
        variant: "destructive",
      })
    }
  }

  const handleRatingChange = (productName: string, rating: number[]) => {
    setProductRatings((prev) => ({ ...prev, [productName]: rating[0] }))
    updateProductRating(productName, rating[0])
  }

  const stats = [
    {
      title: "Total Sellers",
      value: sellerStats?.total_sellers.toString() || "0",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Active Sellers",
      value: sellerStats?.approved_sellers.toString() || "0",
      icon: Package,
      color: "text-green-500",
    },
    {
      title: "Pending Approvals",
      value: sellerStats?.pending_applications.toString() || "0",
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ]

  // Show admin login screen if not logged in
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <Shield className="h-16 w-16 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Admin Access</h2>
            <p className="text-gray-600 mb-6">Please log in to access the admin panel.</p>
            <div className="space-y-4">
              <Button onClick={handleAdminLogin} className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Login as Admin
              </Button>
              <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const SellerCard = ({ seller, showActions = false }: { seller: Seller; showActions?: boolean }) => (
    <Card key={seller.id} className={`border-l-4 ${
      seller.status === 'pending' ? 'border-l-orange-500' : 
      seller.status === 'approved' ? 'border-l-green-500' : 
      'border-l-red-500'
    }`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold">{seller.name}</h3>
            <p className="text-sm text-gray-600">{seller.email}</p>
            <p className="text-sm text-gray-600">{seller.phone}</p>
          </div>
          <Badge 
            variant={seller.status === 'approved' ? 'default' : 'secondary'}
            className={
              seller.status === 'approved' ? 'bg-green-500' :
              seller.status === 'pending' ? 'bg-orange-500' :
              'bg-red-500'
            }
          >
            {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
          </Badge>
        </div>

        <div className="mb-3">
          <p className="text-sm font-medium mb-1">Products:</p>
          <div className="flex flex-wrap gap-1">
            {seller.products.slice(0, 3).map((product: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {product}
              </Badge>
            ))}
            {seller.products.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{seller.products.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {seller.status === 'pending' && (
          <>
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Documents:</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center">
                  <Check className="h-3 w-3 text-green-500 mr-1" />
                  Aadhar
                </div>
                <div className="flex items-center">
                  <Check className="h-3 w-3 text-green-500 mr-1" />
                  PAN
                </div>
                <div className="flex items-center">
                  <Check className="h-3 w-3 text-green-500 mr-1" />
                  Bank
                </div>
              </div>
            </div>
            
            {showActions && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  onClick={() => handleStatusUpdate(seller.id, 'approved')}
                >
                  <Check className="h-4 w-4 mr-1" />
                  {t("approve")}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleStatusUpdate(seller.id, 'rejected')}
                >
                  <X className="h-4 w-4 mr-1" />
                  {t("reject")}
                </Button>
              </div>
            )}
          </>
        )}

        {seller.status === 'rejected' && showActions && (
          <div className="mt-3">
            <Button
              size="sm"
              className="w-full bg-green-500 hover:bg-green-600"
              onClick={() => handleStatusUpdate(seller.id, 'approved')}
            >
              <Check className="h-4 w-4 mr-1" />
              Approve Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="mr-4">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <ChefHat className="h-6 w-6 text-purple-500 mr-2" />
              <h1 className="text-2xl font-bold">RasoiSetu {t("admin_panel")}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={fetchAllData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <stat.icon className={`h-8 w-8 ${stat.color} mr-4`} />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seller Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Seller Applications
                </CardTitle>
                <CardDescription>Manage seller applications by status</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">
                      Pending ({pendingSellers.length})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                      Approved ({approvedSellers.length})
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                      Rejected ({rejectedSellers.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="pending" className="mt-4">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {loading ? (
                        <p className="text-center py-8">Loading...</p>
                      ) : pendingSellers.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No pending applications</p>
                      ) : (
                        pendingSellers.map((seller) => (
                          <SellerCard key={seller.id} seller={seller} showActions={true} />
                        ))
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="approved" className="mt-4">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {loading ? (
                        <p className="text-center py-8">Loading...</p>
                      ) : approvedSellers.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No approved sellers</p>
                      ) : (
                        approvedSellers.map((seller) => (
                          <SellerCard key={seller.id} seller={seller} />
                        ))
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="rejected" className="mt-4">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {loading ? (
                        <p className="text-center py-8">Loading...</p>
                      ) : rejectedSellers.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No rejected applications</p>
                      ) : (
                        rejectedSellers.map((seller) => (
                          <SellerCard key={seller.id} seller={seller} showActions={true} />
                        ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Quality Rating */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                {t("quality_rating")}
              </CardTitle>
              <CardDescription>Rate the quality of products from suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {products.slice(0, 6).map((product) => (
                  <div key={product.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-sm text-gray-600">{productRatings[product.name] || product.rating}/10</span>
                    </div>
                    <Slider
                      value={[productRatings[product.name] || product.rating]}
                      onValueChange={(value) => handleRatingChange(product.name, value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}