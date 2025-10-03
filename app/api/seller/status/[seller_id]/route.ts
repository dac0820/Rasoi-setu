import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { seller_id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body
    
    // Validate input
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'approved', 'rejected']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // Call FastAPI backend
    const response = await fetch(`http://127.0.0.1:8000/seller/${params.seller_id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Failed to update status' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: data.message,
      data: { seller_id: params.seller_id, status }
    })

  } catch (error) {
    console.error('Error updating seller status:', error)
    
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Failed to connect to backend service' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: Add GET method to fetch seller details
export async function GET(
  request: NextRequest,
  { params }: { params: { seller_id: string } }
) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/seller/details/${params.seller_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Failed to fetch seller details' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Error fetching seller details:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch seller details' },
      { status: 500 }
    )
  }
}