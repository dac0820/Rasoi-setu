"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChefHat, ArrowLeft, Clock, CheckCircle, XCircle, AlertTriangle, Phone, Mail } from "lucide-react"

interface Seller {
  id: string
  name: string
  email: string
  phone: string
  products: string[]
  status: "pending" | "approved" | "rejected"
}

export default function SellerStatus() {
  const router = useRouter()
  const [sellerStatus, setSellerStatus] = useState<Seller | null>(null)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const checkStatus = async () => {
    if (!email.trim()) return

    setLoading(true)
    setError("")
    
    try {
      const response = await fetch('http://localhost:8000/seller/check-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const result = await response.json()
      
      if (result.success && result.data) {
        setSellerStatus({
          id: result.data.id,
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone,
          products: result.data.products,
          status: result.data.status
        })
      } else {
        setSellerStatus(null)
      }
    } catch (error) {
      console.error('Error checking status:', error)
      setError('Failed to check status. Please try again.')
      setSellerStatus(null)
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="h-8 w-8 text-orange-500" />,
          title: "Application Under Review",
          description: "Your application is being reviewed by our team",
          color: "bg-orange-100 text-orange-800",
          progress: 50,
        }
      case "approved":
        return {
          icon: <CheckCircle className="h-8 w-8 text-green-500" />,
          title: "Application Approved",
          description: "Congratulations! You can now access your dashboard",
          color: "bg-green-100 text-green-800",
          progress: 100,
        }
      case "rejected":
        return {
          icon: <XCircle className="h-8 w-8 text-red-500" />,
          title: "Application Rejected",
          description: "Please contact support for more information",
          color: "bg-red-100 text-red-800",
          progress: 0,
        }
      default:
        return {
          icon: <AlertTriangle className="h-8 w-8 text-gray-500" />,
          title: "Application Not Found",
          description: "No application found with this email",
          color: "bg-gray-100 text-gray-800",
          progress: 0,
        }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="absolute left-4 top-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center justify-center mb-4">
            <ChefHat className="h-8 w-8 text-blue-500 mr-2" />
            <span className="text-2xl font-bold">RasoiSetu</span>
          </div>

          <CardTitle className="text-2xl">Check Application Status</CardTitle>
          <CardDescription>Enter your email to check your seller application status</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && checkStatus()}
            />
            <Button 
              onClick={checkStatus} 
              className="bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Check Status'}
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {sellerStatus && (
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  {getStatusInfo(sellerStatus.status).icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2">{getStatusInfo(sellerStatus.status).title}</h3>
                  <p className="text-gray-600 mb-4">{getStatusInfo(sellerStatus.status).description}</p>
                  <Badge className={getStatusInfo(sellerStatus.status).color}>
                    {sellerStatus.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Application Progress</span>
                      <span>{getStatusInfo(sellerStatus.status).progress}%</span>
                    </div>
                    <Progress value={getStatusInfo(sellerStatus.status).progress} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>
                      <p>{sellerStatus.name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>
                      <p>{sellerStatus.email}</p>
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>
                      <p>{sellerStatus.phone}</p>
                    </div>
                    <div>
                      <span className="font-medium">Products:</span>
                      <p>{sellerStatus.products.join(", ")}</p>
                    </div>
                  </div>

                  {sellerStatus.status === "approved" && (
                    <div className="text-center pt-4">
                      <Button onClick={() => router.push("/seller/login")} className="bg-green-500 hover:bg-green-600">
                        Access Dashboard
                      </Button>
                    </div>
                  )}

                  {sellerStatus.status === "pending" && (
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-medium text-orange-900 mb-2">What's Next?</h4>
                      <ul className="text-sm text-orange-800 space-y-1">
                        <li>• Our team is reviewing your documents</li>
                        <li>• You'll receive an email within 2-3 business days</li>
                        <li>• Make sure your phone is reachable for verification</li>
                      </ul>
                    </div>
                  )}

                  {sellerStatus.status === "rejected" && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-900 mb-2">Need Help?</h4>
                      <div className="text-sm text-red-800 space-y-2">
                        <p className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          Call us: +91 9999-888-777
                        </p>
                        <p className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          Email: support@rasoisetu.com
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {email && !sellerStatus && !loading && !error && (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Application Found</h3>
                <p className="text-gray-600 mb-4">We couldn't find any application with the email "{email}"</p>
                <Button variant="outline" onClick={() => router.push("/seller/register")}>
                  Register New Application
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}