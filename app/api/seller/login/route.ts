import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Seller login request body:', body)
    
    const response = await fetch('http://127.0.0.1:8000/seller/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log('Backend response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Backend server error' }))
      console.error('Backend error:', errorData)
      return NextResponse.json(
        { error: errorData.detail || 'Login failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Seller login successful:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Seller login error:', error)
    return NextResponse.json(
      { error: 'Backend server is not running. Please start the backend server first.' },
      { status: 500 }
    )
  }
} 