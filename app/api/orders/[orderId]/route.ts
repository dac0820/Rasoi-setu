// app/api/inventory/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// app/api/orders/[orderId]/route.ts
export async function GET(
    request: NextRequest,
    { params }: { params: { orderId: string } }
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${params.orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      })
  
      if (!response.ok) {
        if (response.status === 404) {
          return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error('Error fetching order details:', error)
      return NextResponse.json(
        { error: 'Failed to fetch order details' },
        { status: 500 }
      )
    }
  }
  
  export async function PUT(
    request: NextRequest,
    { params }: { params: { orderId: string } }
  ) {
    try {
      const body = await request.json()
      
      if (!body.status) {
        return NextResponse.json(
          { error: 'Status is required' },
          { status: 400 }
        )
      }
  
      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        )
      }
      
      const response = await fetch(
        `${API_BASE_URL}/orders/${params.orderId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: body.status }),
          signal: AbortSignal.timeout(10000),
        }
      )
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
        if (response.status === 404) {
          return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }
        return NextResponse.json(
          { error: errorData.detail || `HTTP error! status: ${response.status}` },
          { status: response.status }
        )
      }
  
      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error('Error updating order status:', error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to update order status' },
        { status: 500 }
      )
    }
  }
  