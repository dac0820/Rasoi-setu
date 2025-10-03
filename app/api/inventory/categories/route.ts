// app/api/inventory/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
// app/api/inventory/categories/route.ts
export async function GET() {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      })
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      )
    }
  }
  