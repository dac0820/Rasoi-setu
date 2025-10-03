// app/api/inventory/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// app/api/orders/vendor/[vendorId]/route.ts
export async function GET(
    request: NextRequest,
    { params }: { params: { vendorId: string } }
  ) {
    try {
      const { searchParams } = new URL(request.url)
      const status = searchParams.get('status')
      
      const queryParams = new URLSearchParams()
      if (status) queryParams.append('status', status)
  
      const response = await fetch(
        `${API_BASE_URL}/orders/vendor/${params.vendorId}?${queryParams}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(10000),
        }
      )
  
      if (!response.ok) {
        if (response.status === 404) {
          return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error('Error fetching vendor orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }
  }
  