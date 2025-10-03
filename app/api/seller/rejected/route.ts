import { NextResponse } from 'next/server'

// app/api/seller/rejected/route.ts
export async function GET() {
  try {
    const response = await fetch('http://127.0.0.1:8000/seller/rejected', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch rejected sellers' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching rejected sellers:', error)
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 503 }
    )
  }
}