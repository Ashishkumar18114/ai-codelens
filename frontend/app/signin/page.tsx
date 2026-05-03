'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) setError('Invalid email or password')
    else router.push('/')
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
        .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}
        .chip{border:1px solid #222;border-radius:20px;padding:5px 13px;font-size:12px;color:#555}
        .box{width:100%;max-width:400px}
        .title{font-size:26px;font-weight:800;letter-spacing:-0.5px;margin-bottom:4px}
        .title span{color:#e53935}
        .desc{font-size:13px;color:#555;margin-bottom:20px}
        .field{margin-bottom:14px}
        .field label{display:block;font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#555;margin-bottom:6px}
        .field input{width:100%;padding:12px 14px;background:#1a1a1a;border:1.5px solid #222;border-radius:8px;color:#fff;font-family:'Syne';font-size:14px;outline:none;transition:border-color 0.15s}
        .field input:focus{border-color:#e53935}
        .field input::placeholder{color:#333}
        .btn-main{width:100%;padding:13px;background:#e53935;color:#fff;border:none;border-radius:8px;font-family:'Syne';font-size:15px;font-weight:800;cursor:pointer;transition:background 0.15s;margin-top:4px}
        .btn-main:hover:not(:disabled){background:#c62828}
        .btn-main:disabled{background:#2a2a2a;color:#555;cursor:not-allowed}
        .divider{display:flex;align-items:center;gap:10px;margin:18px 0;color:#333;font-size:12px}
        .divider::before,.divider::after{content:'';flex:1;height:1px;background:#1e1e1e}
        .oauth-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .oauth-btn{padding:11px;border-radius:8px;font-family:'Syne';font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.15s;border:1.5px solid;background:#1a1a1a;color:#fff;border-color:#2a2a2a}
        .oauth-btn:hover{background:#222;border-color:#333}
        .bottom{text-align:center;margin-top:20px;font-size:13px;color:#555}
        .bottom a{color:#e53935;text-decoration:none;font-weight:700}
        .forgot{text-align:right;margin-top:-6px;margin-bottom:16px}
        .forgot a{color:#555;font-size:12px;text-decoration:none}
        .forgot a:hover{color:#e53935}
        .error-box{background:#2a1010;border:1px solid #5a1a1a;border-radius:8px;padding:10px 14px;font-size:13px;color:#f87171;margin-bottom:14px}
        .copy{font-size:12px;color:#2a2a2a}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .box{animation:fadeUp 0.35s ease forwards}
      `}</style>
      <div className="wrap">
        <div className="left">
          <div className="logo"><div className="logo-icon">⚡</div><span className="logo-name">CodeLens AI</span></div>
          <div className="mid">
            <div className="big">The AI Code<br /><span>Review Tool</span></div>
            <div className="sub">Get detailed, structured code analysis and work smarter with AI-powered insights.</div>
            <div className="chips">
              <span className="chip">Code Quality Analysis</span>
              <span className="chip">Performance Insights</span>
              <span className="chip">Doc Generation</span>
            </div>
          </div>
          <div className="copy">© 2026 CodeLens AI</div>
        </div>
        <div className="right">
          <div className="box">
            <div className="title">Sign in to <span>CodeLens</span></div>
            <div className="desc">Welcome back! Please sign in to continue.</div>
            {error && <div className="error-box">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="field"><label>Email</label><input type="email" placeholder="" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
              <div className="field"><label>Password</label><input type="password" placeholder="" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
              <div className="forgot"><a href="#">Forgot password?</a></div>
              <button className="btn-main" type="submit" disabled={loading}>{loading?'Signing in...':'Sign In'}</button>
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
            <div className="bottom">No account yet? <Link href="/signup">Get started free</Link></div>
          </div>
        </div>
      </div>
    </>
  )
}
