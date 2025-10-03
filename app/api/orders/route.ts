// app/api/inventory/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// app/api/orders/route.ts
export async function POST(request: NextRequest) {
    try {
      const body = await request.json()
      
      // Validate required fields
      if (!body.vendor_id || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
        return NextResponse.json(
          { error: 'Missing required fields: vendor_id and items are required' },
          { status: 400 }
        )
      }
  
      // Validate each item
      for (const item of body.items) {
        if (!item.item_id || !item.quantity || item.quantity <= 0) {
          return NextResponse.json(
            { error: 'Each item must have item_id and positive quantity' },
            { status: 400 }
          )
        }
      }
      
      const response = await fetch(`${API_BASE_URL}/orders/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000), // Orders might take longer
      })
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
        console.error('Order placement error:', errorData)
        return NextResponse.json(
          { error: errorData.detail || `HTTP error! status: ${response.status}` },
          { status: response.status }
        )
      }
  
      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error('Error placing order:', error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to place order' },
        { status: 500 }
      )
    }
  }
  