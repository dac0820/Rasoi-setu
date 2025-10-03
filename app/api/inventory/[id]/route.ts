// app/api/inventory/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/item/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      })
  
      if (!response.ok) {
        if (response.status === 404) {
          return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error('Error fetching item details:', error)
      return NextResponse.json(
        { error: 'Failed to fetch item details' },
        { status: 500 }
      )
    }
  }
  