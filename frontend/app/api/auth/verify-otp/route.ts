import { NextResponse } from 'next/server'

declare global {
  var _otpStore: Map<string, {otp: string, expires: number}>
}

if (!global._otpStore) {
  global._otpStore = new Map()
}

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()
    console.log('🔍 VERIFYING:', email, otp)
    console.log('📦 Store size:', global._otpStore.size)
    console.log('📦 Store contents:', [...global._otpStore.entries()])

    const record = global._otpStore.get(`email:${email}`)
    console.log('📋 Record found:', record)

    if (!record) return NextResponse.json({ error: 'OTP not found. Please request a new one.' }, { status: 400 })
    if (Date.now() > record.expires) return NextResponse.json({ error: 'OTP expired. Please request a new one.' }, { status: 400 })
    if (record.otp !== otp) return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 400 })

    global._otpStore.delete(`email:${email}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Verify error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
