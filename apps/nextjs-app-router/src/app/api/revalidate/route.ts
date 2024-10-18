import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') ?? '/'
  revalidatePath(path, 'layout')
  return NextResponse.json({ path, revalidated: true, now: Date.now() })
}
