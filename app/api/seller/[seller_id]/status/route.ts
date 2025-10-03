// app/api/seller/[seller_id]/status/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: { seller_id: string } }) {
  try {
    const { seller_id } = params
    const body = await req.json()

    const response = await fetch(`http://127.0.0.1:8000/seller/${seller_id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
