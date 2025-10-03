// app/api/inventory/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const minStock = searchParams.get('min_stock')
    const maxPrice = searchParams.get('max_price')
    const search = searchParams.get('search')

    // Build query parameters for FastAPI
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (minStock) params.append('min_stock', minStock)
    if (maxPrice) params.append('max_price', maxPrice)
    if (search) params.append('search', search)

    const response = await fetch(`${API_BASE_URL}/inventory/items?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout and error handling
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`FastAPI error: ${response.status} - ${errorText}`)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory items', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Helper function to check API health
export async function HEAD() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    })
    
    if (response.ok) {
      return new NextResponse(null, { status: 200 })
    } else {
      return new NextResponse(null, { status: 503 })
    }
  } catch {
    return new NextResponse(null, { status: 503 })
  }
}