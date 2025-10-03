// app/api/inventory/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// app/api/inventory/low-stock/route.ts
export async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url)
      const threshold = searchParams.get('threshold') || '20'
  
      const response = await fetch(
        `${API_BASE_URL}/inventory/low-stock?threshold=${threshold}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(5000),
        }
      )
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error('Error fetching low stock items:', error)
      return NextResponse.json(
        { error: 'Failed to fetch low stock items' },
        { status: 500 }
      )
    }
  }
  