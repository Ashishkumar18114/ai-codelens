'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function SignUpPage() {
  const [step, setStep] = useState<'form'|'otp'|'done'>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to send OTP'); setLoading(false); return }
      setStep('otp')
    } catch { setError('Something went wrong.') }
    setLoading(false)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Invalid OTP'); setLoading(false); return }
      const regRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const regData = await regRes.json()
      if (!regRes.ok) { setError(regData.error || 'Registration failed'); setLoading(false); return }
      setStep('done')
      setTimeout(() => signIn('credentials', { email, password, callbackUrl: '/' }), 1500)
    } catch { setError('Something went wrong.') }
    setLoading(false)
  }

  const handleResend = async () => {
    setError('')
    await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;overflow:hidden}
        body{font-family:'Syne',sans-serif;background:#0d0d0d;color:#fff}
        .wrap{display:grid;grid-template-columns:1fr 1fr;height:100vh}
        .left{padding:40px 48px;display:flex;flex-direction:column;justify-content:space-between;border-right:1px solid #1a1a1a;background:#0d0d0d;position:relative;overflow:hidden}
        .left::before{content:'';position:absolute;bottom:-100px;left:-100px;width:350px;height:350px;background:radial-gradient(circle,rgba(229,57,53,0.1) 0%,transparent 70%);pointer-events:none}
        .right{background:#111;display:flex;align-items:center;justify-content:center;padding:40px;overflow-y:auto}
        .logo{display:flex;align-items:center;gap:10px}
        .logo-icon{width:34px;height:34px;background:#e53935;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:17px}
        .logo-name{font-size:18px;font-weight:800;letter-spacing:-0.3px}
        .mid{flex:1;display:flex;flex-direction:column;justify-content:center}
        .big{font-size:48px;font-weight:800;line-height:1.05;letter-spacing:-2px}
        .big span{color:#e53935}
        .sub{font-size:14px;color:#555;margin-top:14px;line-height:1.7;max-width:320px}
        .perks{display:flex;flex-direction:column;gap:10px;margin-top:22px}
        .perk{display:flex;align-items:center;gap:10px;font-size:13px;color:#555}
        .dot{width:7px;height:7px;border-radius:50%;background:#e53935;flex-shrink:0}
        .box{width:100%;max-width:400px}
        .steps{display:flex;align-items:center;margin-bottom:24px}
        .step-item{display:flex;align-items:center;gap:8px}
        .step-circle{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;transition:all 0.2s}
        .step-circle.done{background:#22c55e;color:#fff}
        .step-circle.active{background:#e53935;color:#fff;box-shadow:0 0 0 3px rgba(229,57,53,0.2)}
        .step-circle.idle{background:#1a1a1a;color:#555;border:1.5px solid #2a2a2a}
        .step-label{font-size:11px;font-weight:700;color:#555}
        .step-label.active{color:#fff}
        .step-line{flex:1;height:1px;background:#1e1e1e;margin:0 8px}
        .title{font-size:24px;font-weight:800;letter-spacing:-0.5px;margin-bottom:4px}
        .title span{color:#e53935}
        .desc{font-size:13px;color:#555;margin-bottom:20px}
        .field{margin-bottom:12px}
        .field label{display:block;font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#555;margin-bottom:6px}
        .field input{width:100%;padding:11px 14px;background:#1a1a1a;border:1.5px solid #222;border-radius:8px;color:#fff;font-family:'Syne';font-size:14px;outline:none;transition:border-color 0.15s}
        .field input:focus{border-color:#e53935}
        .field input::placeholder{color:#444}
        .otp-block{background:#1a1a1a;border:1.5px solid #222;border-radius:10px;padding:20px;margin-bottom:14px;text-align:center}
        .otp-block label{display:block;font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#555;margin-bottom:12px}
        .otp-block input{background:transparent;border:none;color:#fff;font-family:'DM Mono';font-size:28px;font-weight:700;outline:none;letter-spacing:12px;text-align:center;width:100%}
        .otp-block input::placeholder{color:#2a2a2a;letter-spacing:8px}
        .otp-sent{font-size:12px;color:#555;margin-top:8px}
        .otp-sent strong{color:#aaa}
        .btn-main{width:100%;padding:13px;background:#e53935;color:#fff;border:none;border-radius:8px;font-family:'Syne';font-size:15px;font-weight:800;cursor:pointer;transition:background 0.15s;margin-top:4px}
        .btn-main:hover:not(:disabled){background:#c62828}
        .btn-main:disabled{background:#2a2a2a;color:#555;cursor:not-allowed}
        .divider{display:flex;align-items:center;gap:10px;margin:16px 0;color:#333;font-size:12px}
        .divider::before,.divider::after{content:'';flex:1;height:1px;background:#1e1e1e}
        .oauth-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .oauth-btn{padding:11px;border-radius:8px;font-family:'Syne';font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.15s;border:1.5px solid;background:#1a1a1a;color:#fff;border-color:#2a2a2a}
        .oauth-btn:hover{background:#222;border-color:#333}
        .bottom{text-align:center;margin-top:16px;font-size:13px;color:#555}
        .bottom a{color:#e53935;text-decoration:none;font-weight:700}
        .error-box{background:#2a1010;border:1px solid #5a1a1a;border-radius:8px;padding:10px 14px;font-size:13px;color:#f87171;margin-bottom:12px}
        .success-box{background:#0f2a1a;border:1px solid #1a5a2a;border-radius:10px;padding:28px;text-align:center;color:#86efac}
        .resend{font-size:12px;color:#555;text-align:center;margin-top:12px}
        .resend span{color:#e53935;cursor:pointer;font-weight:700}
        .resend span:hover{text-decoration:underline}
        .back-btn{background:none;border:none;color:#555;font-family:'Syne';font-size:12px;cursor:pointer;margin-bottom:16px;display:flex;align-items:center;gap:4px;padding:0}
        .back-btn:hover{color:#fff}
        .copy{font-size:12px;color:#2a2a2a}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .box{animation:fadeUp 0.35s ease forwards}
      `}</style>

      <div className="wrap">
        <div className="left">
          <div className="logo"><div className="logo-icon">⚡</div><span className="logo-name">CodeLens AI</span></div>
          <div className="mid">
            <div className="big">Start for<br /><span>Free Today</span></div>
            <div className="sub">Join thousands of developers who use CodeLens AI to write better code, faster.</div>
            <div className="perks">
              <div className="perk"><div className="dot"/><span>Unlimited code analysis — no credit card needed</span></div>
              <div className="perk"><div className="dot"/><span>5 analysis modes including security & performance</span></div>
              <div className="perk"><div className="dot"/><span>Supports 14+ programming languages</span></div>
              <div className="perk"><div className="dot"/><span>Secured with Email OTP verification</span></div>
            </div>
          </div>
          <div className="copy">© 2026 CodeLens AI</div>
        </div>

        <div className="right">
          <div className="box">
            <div className="steps">
              <div className="step-item">
                <div className={`step-circle ${step!=='form'?'done':'active'}`}>{step!=='form'?'✓':'1'}</div>
                <span className={`step-label ${step==='form'?'active':''}`}>Details</span>
              </div>
              <div className="step-line"/>
              <div className="step-item">
                <div className={`step-circle ${step==='done'?'done':step==='otp'?'active':'idle'}`}>{step==='done'?'✓':'2'}</div>
                <span className={`step-label ${step==='otp'?'active':''}`}>Verify Email</span>
              </div>
              <div className="step-line"/>
              <div className="step-item">
                <div className={`step-circle ${step==='done'?'done':'idle'}`}>{step==='done'?'✓':'3'}</div>
                <span className={`step-label ${step==='done'?'active':''}`}>Done</span>
              </div>
            </div>

            {step === 'form' && (
              <>
                <div className="title">Create your <span>account</span></div>
                <div className="desc">Free forever. No credit card required.</div>
                {error && <div className="error-box">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="field"><label>Full Name</label><input type="text" value={name} onChange={e=>setName(e.target.value)} required /></div>
                  <div className="field"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
                  <div className="field"><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
                  <button className="btn-main" type="submit" disabled={loading}>{loading?'Sending OTP...':'Continue & Verify →'}</button>
                </form>
                <div className="divider">or continue with</div>
                <div className="oauth-row">
                  <button className="oauth-btn" onClick={()=>signIn('github',{callbackUrl:'/'})}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    GitHub
                  </button>
                  <button className="oauth-btn" onClick={()=>signIn('google',{callbackUrl:'/'})}>
                    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Google
                  </button>
                </div>
                <div className="bottom">Already have an account? <Link href="/signin">Sign in</Link></div>
              </>
            )}

            {step === 'otp' && (
              <>
                <button className="back-btn" onClick={()=>{setStep('form');setError('')}}>← Back</button>
                <div className="title">Verify your <span>email</span></div>
                <div className="desc">Enter the 6-digit code we sent to your inbox.</div>
                {error && <div className="error-box">{error}</div>}
                <form onSubmit={handleVerifyOtp}>
                  <div className="otp-block">
                    <label>📧 Email Verification Code</label>
                    <input type="text" maxLength={6} placeholder="000000" value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,''))} required />
                    <div className="otp-sent">Sent to <strong>{email}</strong></div>
                  </div>
                  <button className="btn-main" type="submit" disabled={loading||otp.length<6}>
                    {loading?'Verifying...':'Verify & Create Account →'}
                  </button>
                </form>
                <div className="resend">Didn't get it? <span onClick={handleResend}>Resend code</span></div>
              </>
            )}

            {step === 'done' && (
              <div className="success-box">
                <div style={{fontSize:'40px',marginBottom:'12px'}}>🎉</div>
                <div style={{fontSize:'20px',fontWeight:'800',marginBottom:'8px'}}>Account Created!</div>
                <div style={{fontSize:'13px',color:'#555',lineHeight:'1.7'}}>Email verified successfully.<br/>Redirecting to your dashboard...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
