'use client'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function SignOutPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setLoading(true)
    await signOut({ redirect: false })
    setDone(true)
    setTimeout(() => router.push('/'), 2000)
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Syne',sans-serif;background:#0d0d0d;color:#fff;min-height:100vh}
        .auth-wrap{display:grid;grid-template-columns:1fr 1fr;min-height:100vh}
        @media(max-width:768px){.auth-wrap{grid-template-columns:1fr}.left-panel{display:none!important}}
        .left-panel{background:#0d0d0d;display:flex;flex-direction:column;justify-content:space-between;padding:48px;border-right:1px solid #1a1a1a;position:relative;overflow:hidden}
        .left-panel::before{content:'';position:absolute;top:-120px;left:-120px;width:400px;height:400px;background:radial-gradient(circle,rgba(229,57,53,0.12) 0%,transparent 70%);pointer-events:none}
        .right-panel{background:#111;display:flex;align-items:center;justify-content:center;padding:48px}
        .form-box{width:100%;max-width:400px;text-align:center}
        .logo-row{display:flex;align-items:center;gap:10px}
        .logo-icon{width:36px;height:36px;background:#e53935;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:18px}
        .logo-name{font-size:20px;font-weight:800;letter-spacing:-0.5px}
        .tagline-block{flex:1;display:flex;flex-direction:column;justify-content:center}
        .big-title{font-size:52px;font-weight:800;line-height:1.05;letter-spacing:-2px}
        .big-title span{color:#e53935}
        .big-sub{font-size:15px;color:#555;margin-top:16px;line-height:1.7;max-width:340px}
        .icon-circle{width:72px;height:72px;border-radius:50%;background:#1a1a1a;border:1.5px solid #2a2a2a;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:32px}
        .form-title{font-size:28px;font-weight:800;letter-spacing:-0.8px;margin-bottom:8px}
        .form-title span{color:#e53935}
        .form-sub{font-size:13px;color:#555;margin-bottom:32px;line-height:1.7}
        .user-card{background:#1a1a1a;border:1px solid #222;border-radius:12px;padding:16px 20px;display:flex;align-items:center;gap:14px;margin-bottom:28px;text-align:left}
        .avatar{width:44px;height:44px;border-radius:50%;background:#e53935;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;flex-shrink:0}
        .user-name{font-size:14px;font-weight:700}
        .user-email{font-size:12px;color:#555;font-family:'DM Mono',monospace;margin-top:2px}
        .btn-signout{width:100%;padding:14px;background:#e53935;color:#fff;border:none;border-radius:10px;font-family:'Syne';font-size:15px;font-weight:800;cursor:pointer;transition:background 0.15s;margin-bottom:12px}
        .btn-signout:hover:not(:disabled){background:#c62828}
        .btn-signout:disabled{background:#2a2a2a;color:#555;cursor:not-allowed}
        .btn-cancel{width:100%;padding:13px;background:transparent;color:#777;border:1.5px solid #2a2a2a;border-radius:10px;font-family:'Syne';font-size:14px;font-weight:700;cursor:pointer;transition:all 0.15s}
        .btn-cancel:hover{background:#1a1a1a;color:#fff}
        .success-icon{font-size:48px;margin-bottom:16px}
        .success-title{font-size:22px;font-weight:800;margin-bottom:8px}
        .success-sub{font-size:13px;color:#555}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .form-box{animation:fadeUp 0.4s ease forwards}
      `}</style>
      <div className="auth-wrap">
        <div className="left-panel">
          <div className="logo-row">
            <div className="logo-icon">⚡</div>
            <span className="logo-name">CodeLens AI</span>
          </div>
          <div className="tagline-block">
            <div className="big-title">See you<br /><span>soon!</span></div>
            <div className="big-sub">Your code reviews and history are saved. Sign back in anytime to continue where you left off.</div>
          </div>
          <div style={{fontSize:'12px',color:'#333'}}>© 2026 CodeLens AI</div>
        </div>
        <div className="right-panel">
          <div className="form-box">
            {done ? (
              <>
                <div className="success-icon">✓</div>
                <div className="success-title">Signed out successfully</div>
                <div className="success-sub">Redirecting you to the home page...</div>
              </>
            ) : (
              <>
                <div className="icon-circle">👋</div>
                <div className="form-title">Sign out of <span>CodeLens</span></div>
                <div className="form-sub">Are you sure you want to sign out?<br />You can always sign back in anytime.</div>
                {session?.user && (
                  <div className="user-card">
                    <div className="avatar">{session.user.name?.charAt(0).toUpperCase()||session.user.email?.charAt(0).toUpperCase()||'?'}</div>
                    <div>
                      <div className="user-name">{session.user.name||'User'}</div>
                      <div className="user-email">{session.user.email}</div>
                    </div>
                  </div>
                )}
                <button className="btn-signout" onClick={handleSignOut} disabled={loading}>{loading?'Signing out...':'Yes, Sign Out'}</button>
                <button className="btn-cancel" onClick={() => router.back()}>Cancel — Go Back</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
