import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

declare global {
  var _otpStore: Map<string, {otp: string, expires: number}>
}
if (!global._otpStore) global._otpStore = new Map()

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    const otp = generateOTP()
    const expires = Date.now() + 10 * 60 * 1000
    global._otpStore.set(`email:${email}`, { otp, expires })
    console.log(`OTP for ${email}: ${otp}`)

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"CodeLens AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your CodeLens AI Verification Code',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#0d0d0d;color:#fff;padding:40px;border-radius:12px">
          <div style="margin-bottom:24px">
            <span style="background:#e53935;padding:8px 12px;border-radius:8px;font-size:18px">⚡</span>
            <span style="font-size:20px;font-weight:800;margin-left:10px;color:#fff">CodeLens AI</span>
          </div>
          <h2 style="font-size:24px;font-weight:800;margin-bottom:8px;color:#fff">Verify your email</h2>
          <p style="color:#888;margin-bottom:32px">Use the code below to complete your signup.</p>
          <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;padding:24px;text-align:center;margin-bottom:24px">
            <div style="font-size:42px;font-weight:800;letter-spacing:12px;color:#fff;font-family:monospace">${otp}</div>
            <div style="font-size:12px;color:#555;margin-top:8px">Expires in 10 minutes</div>
          </div>
          <p style="color:#555;font-size:13px">If you did not request this, ignore this email.</p>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('OTP send error:', err)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
