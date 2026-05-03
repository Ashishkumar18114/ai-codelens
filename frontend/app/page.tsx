'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const MODES = [
  { id: 'explain', label: 'Code Quality', icon: '🔍', desc: 'Understand what the code does, bugs found, key concepts' },
  { id: 'review', label: 'Best Practices Review', icon: '✅', desc: 'Professional code review with quality score and violations' },
  { id: 'optimize', label: 'Performance & Optimization', icon: '⚡', desc: 'Find bottlenecks, complexity issues, and faster alternatives' },
  { id: 'security', label: 'Security Audit', icon: '🛡️', desc: 'Detect vulnerabilities, attack vectors, and hardened fixes' },
  { id: 'document', label: 'Documentation Generator', icon: '📄', desc: 'Auto-generate docs, JSDoc, usage examples, data flow' },
  { id: 'refactor', label: 'Code Refactoring', icon: '🔨', desc: 'Restructure and clean up code while preserving functionality' },
  { id: 'test', label: 'Test Case Generator', icon: '🧪', desc: 'Auto-generate unit tests and edge cases for your code' },
  { id: 'complexity', label: 'Complexity Analysis', icon: '📊', desc: 'Analyze cyclomatic complexity and cognitive load of code' },
]

const STEPS = [
  { n: '1', title: 'Choose review type', body: 'Select how you want the code analyzed — explanation, performance, security, or full documentation.' },
  { n: '2', title: 'Add the code snippet', body: 'Paste code in the textarea or upload a file. The AI auto-detects the language.' },
  { n: '3', title: 'Powered by Groq', body: 'Powered by Llama 3.3 70B via Groq. No API key needed on the frontend — completely free.' },
  { n: '4', title: 'Get detailed review', body: 'Click Review Code and get a structured, in-depth analysis in seconds.' },
]

// ─── Markdown renderer ───────────────────────────────────────────────────────
function renderMarkdown(text: string): string {
  let html = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const label = lang || 'code'
    if(typeof window !== 'undefined') { (window as any).copyCode = function(btn: any) { const code = btn.closest('.code-wrap').querySelector('code').innerText; navigator.clipboard.writeText(code); btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy', 2000); } }
return `<div class="code-wrap"><div class="code-header"><span class="code-lang">${label}</span><button class="code-copy-btn" onclick="copyCode(this)">Copy</button></div><pre class="code-pre"><code>${code.trimEnd()}</code></pre></div>`
  })

  html = html.replace(/`([^`]+)`/g, '<code class="ic">$1</code>')
  html = html.replace(/\*\*(CRITICAL)\*\*|`(CRITICAL)`/g, '<span class="badge badge-critical">CRITICAL</span>')
  html = html.replace(/\*\*(HIGH)\*\*|`(HIGH)`/g, '<span class="badge badge-high">HIGH</span>')
  html = html.replace(/\*\*(MEDIUM)\*\*|`(MEDIUM)`/g, '<span class="badge badge-medium">MEDIUM</span>')
  html = html.replace(/\*\*(LOW)\*\*|`(LOW)`/g, '<span class="badge badge-low">LOW</span>')
  html = html.replace(/\*\*(INFO)\*\*|`(INFO)`/g, '<span class="badge badge-info">INFO</span>')
  html = html.replace(/\*\*(SAFE)\*\*|`(SAFE)`/g, '<span class="badge badge-safe">SAFE</span>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
  html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="md-bold">$1</strong>')

  html = html.replace(/(\|.+\|\n)+/g, (table) => {
    const rows = table.trim().split('\n').filter(r => !r.match(/^\|[-| ]+\|$/))
    if (rows.length < 1) return table
    const [header, ...body] = rows
    const th = header.split('|').filter(Boolean).map(c => `<th>${c.trim()}</th>`).join('')
    const trs = body.map(r => {
      const tds = r.split('|').filter(Boolean).map(c => `<td>${c.trim()}</td>`).join('')
      return `<tr>${tds}</tr>`
    }).join('')
    return `<div class="table-wrap"><table class="md-table"><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table></div>`
  })

  html = html.replace(/- \[x\] (.+)/gi, '<div class="check-row check-done">✓ $1</div>')
  html = html.replace(/- \[ \] (.+)/g, '<div class="check-row check-todo">○ $1</div>')
  html = html.replace(/^- (.+)$/gm, '<li class="md-li">$1</li>')
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="md-oli">$1</li>')
  html = html.replace(/^---$/gm, '<hr class="md-hr"/>')
  html = html.replace(/^(?!<[hupltdb]|<div|<pre|<hr)(.+)$/gm, '<p class="md-p">$1</p>')
  html = html.replace(/<p class="md-p"><\/p>/g, '')

  return html
}

// ─── Sign In Modal ────────────────────────────────────────────────────────────
function SignInModal({ onClose, theme }: { onClose: () => void; theme: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (!email.includes('@')) { setError('Enter a valid email address.'); return }
    alert(`Signed in as ${email}! (Demo mode)`)
    onClose()
  }

  const isDark = theme === 'dark'
  const bg = isDark ? '#1a1a1a' : '#fff'
  const border = isDark ? '#2a2a2a' : '#e0e0e0'
  const text = isDark ? '#fff' : '#111'
  const muted = isDark ? '#888' : '#666'
  const inputBg = isDark ? '#111' : '#fafafa'
  const overlayBg = isDark ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.4)'

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: overlayBg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: bg, borderRadius: '16px', padding: '36px', width: '100%', maxWidth: '420px', border: `1px solid ${border}`, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '22px', color: muted, cursor: 'pointer', lineHeight: 1 }}>×</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '34px', height: '34px', background: '#e53935', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="13,2 4,14 12,14 11,22 20,10 13,10"/></svg></div>
          <span style={{ fontSize: '20px', fontWeight: '800', color: text }}>Sign in to CodeLens</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: muted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${border}`, borderRadius: '8px', fontSize: '14px', color: text, background: inputBg, outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: muted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${border}`, borderRadius: '8px', fontSize: '14px', color: text, background: inputBg, outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
          {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', padding: '9px 13px', borderRadius: '7px', marginBottom: '12px' }}>{error}</div>}
          <button type="submit" style={{ width: '100%', background: '#e53935', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
            Sign In
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0', color: muted, fontSize: '13px' }}>
          <div style={{ flex: 1, height: '1px', background: border }} />
          or continue with
          <div style={{ flex: 1, height: '1px', background: border }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          {['GitHub', 'Google'].map(p => (
            <button key={p} onClick={() => alert(`${p} OAuth — Demo mode`)} style={{ padding: '10px', border: `1.5px solid ${border}`, borderRadius: '8px', background: inputBg, color: text, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s' }}>
              {p === 'GitHub' ? '🐙 ' : '🔵 '}{p}
            </button>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: muted }}>
          Don't have an account?{' '}
          <span onClick={onClose} style={{ color: '#e53935', fontWeight: '700', cursor: 'pointer' }}>Get started free →</span>
        </p>
      </div>
    </div>
  )
}

// ─── Get Started Modal ────────────────────────────────────────────────────────
function GetStartedModal({ onClose, theme }: { onClose: () => void; theme: string }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const isDark = theme === 'dark'
  const bg = isDark ? '#1a1a1a' : '#fff'
  const border = isDark ? '#2a2a2a' : '#e0e0e0'
  const text = isDark ? '#fff' : '#111'
  const muted = isDark ? '#888' : '#666'
  const inputBg = isDark ? '#111' : '#fafafa'
  const overlayBg = isDark ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.4)'

  const handleNext = () => {
    setError('')
    if (step === 1) {
      if (!name.trim()) { setError('Please enter your name.'); return }
      if (!email || !email.includes('@')) { setError('Enter a valid email.'); return }
      setStep(2)
    } else {
      if (!password || password.length < 6) { setError('Password must be at least 6 characters.'); return }
      setStep(3)
    }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: overlayBg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: bg, borderRadius: '16px', padding: '36px', width: '100%', maxWidth: '440px', border: `1px solid ${border}`, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '22px', color: muted, cursor: 'pointer', lineHeight: 1 }}>×</button>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: '3px', borderRadius: '2px', background: s <= step ? '#e53935' : border, transition: 'background 0.3s' }} />
          ))}
        </div>

        {step < 3 ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '34px', height: '34px', background: '#e53935', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="13,2 4,14 12,14 11,22 20,10 13,10"/></svg></div>
              <span style={{ fontSize: '20px', fontWeight: '800', color: text }}>
                {step === 1 ? 'Create your account' : 'Set a password'}
              </span>
            </div>
            <p style={{ fontSize: '14px', color: muted, marginBottom: '24px' }}>
              {step === 1 ? 'Free forever. No credit card required.' : 'Choose a strong password to protect your account.'}
            </p>

            {step === 1 ? (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: muted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
                  <input type="text" placeholder="" value={name} onChange={e => setName(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${border}`, borderRadius: '8px', fontSize: '14px', color: text, background: inputBg, outline: 'none', fontFamily: 'inherit' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: muted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
                  <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${border}`, borderRadius: '8px', fontSize: '14px', color: text, background: inputBg, outline: 'none', fontFamily: 'inherit' }} />
                </div>
              </>
            ) : (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: muted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
                <input type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${border}`, borderRadius: '8px', fontSize: '14px', color: text, background: inputBg, outline: 'none', fontFamily: 'inherit' }} />
              </div>
            )}

            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', padding: '9px 13px', borderRadius: '7px', marginBottom: '12px' }}>{error}</div>}

            <button onClick={handleNext} style={{ width: '100%', background: '#e53935', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
              {step === 1 ? 'Continue →' : 'Create Account'}
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: text, marginBottom: '10px' }}>You're all set!</h2>
            <p style={{ fontSize: '14px', color: muted, marginBottom: '24px', lineHeight: 1.7 }}>
              Welcome to CodeLens AI, <strong style={{ color: text }}>{name}</strong>! Start reviewing your code for free — no limits, no credit card needed.
            </p>
            <div style={{ background: isDark ? '#111' : '#f8f8f8', border: `1px solid ${border}`, borderRadius: '10px', padding: '16px', marginBottom: '20px', textAlign: 'left' }}>
              {[
                { icon: '🔍', text: 'Code Quality & Explanation' },
                { icon: '⚡', text: 'Performance & Optimization' },
                { icon: '🛡️', text: 'Security Audit' },
                { icon: '📄', text: 'Documentation Generator' },
              ].map(f => (
                <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontSize: '14px', color: text }}>
                  <span style={{ fontSize: '16px' }}>{f.icon}</span> {f.text}
                </div>
              ))}
            </div>
            <button onClick={onClose} style={{ width: '100%', background: '#e53935', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
              Start Reviewing Code <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="13,2 4,14 12,14 11,22 20,10 13,10"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Result component ─────────────────────────────────────────────────────────
function AnalysisResult({ result }: { result: any }) {
  const [copied, setCopied] = useState(false)
  const copyAll = () => {
    navigator.clipboard.writeText(result.analysis)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const rendered = renderMarkdown(result.analysis || '')
  const modeInfo = MODES.find(m => m.id === result.mode)

  return (
    <div className="fade-up" style={{ maxWidth: '860px', margin: '28px auto 0', padding: '0 40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div className="pip-line" />
        <div className="pip-dot" />
        <div className="pip-line" />
        <div style={{ padding: '0 20px' }}>
          <div className="pip-box">AI Model: <span>Llama 3.3 70B via Groq</span></div>
        </div>
        <div className="pip-line" />
        <div className="pip-dot" />
        <div className="pip-line" />
      </div>
      <div className="result-box">
        <div className="result-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px' }}>{modeInfo?.icon}</span>
            <span>Code Review Results</span>
            {result.language && <span className="lang-pill">{result.language}</span>}
            {result.lines > 0 && <span className="lines-pill">{result.lines} lines</span>}
          </div>
          <button className="copy-btn" onClick={copyAll}>{copied ? '✓ Copied' : '⎘ Copy All'}</button>
        </div>
        <div className="mode-bar">
          <span style={{ fontSize: '13px' }}>{modeInfo?.icon} Analysis mode: <strong>{modeInfo?.label}</strong></span>
        </div>
        <div className="result-body" dangerouslySetInnerHTML={{ __html: rendered }} />
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [codeText, setCodeText] = useState('')
  const [mode, setMode] = useState('explain')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [inputMode, setInputMode] = useState('text')
  const [openFaq, setOpenFaq] = useState(0)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const router = useRouter()
  const { data: session } = useSession()
  const [showSignIn, setShowSignIn] = useState(false)
  const [showGetStarted, setShowGetStarted] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => { setFile(f); setInputMode('file') }
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]; if (f) handleFile(f)
  }, [])

  const analyze = async () => {
    if (!file && !codeText.trim()) return
    setLoading(true); setResult(null)
    try {
      const formData = new FormData()
      if (inputMode === 'file' && file) {
        formData.append('file', file)
      } else {
        formData.append('file', new Blob([codeText], { type: 'text/plain' }), 'code.txt')
      }
      formData.append('mode', mode)
      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      const data = await res.json()
      setResult(data.error
        ? { analysis: `## ❌ Error\n\n${data.error}`, language: 'Unknown', mode, lines: 0 }
        : data)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch {
      setResult({ analysis: '## ❌ Connection Error\n\nCould not reach the backend. Make sure it is running on port 8000.', language: '', mode, lines: 0 })
    } finally { setLoading(false) }
  }

  const hasInput = file ? true : codeText.trim().length > 0
  const isDark = theme === 'dark'

  const css = isDark ? `
    body{background:#0d0d0d;color:#fff}
    .tool-card{background:#fff;border-color:#1e1e1e}
    .tool-label{color:#555}
    .mode-card{border-color:#e8e8e8;background:#fafafa}
    .mode-card:hover{border-color:#e53935;background:#fff5f5}
    .mode-card.active{border-color:#e53935;background:#fff1f1}
    .mode-label{color:#111}
    .mode-desc{color:#888}
    .tool-textarea{border-color:#e0e0e0;color:#111;background:#fafafa}
    .drop-zone{border-color:#d0d0d0;background:#fafafa}
    .drop-zone:hover{border-color:#e53935;background:#fff5f5}
    .file-btn{background:#111;color:#fff}
    .pip-box{background:#111;color:#fff}
    .pip-box span{color:#888}
    .result-header{background:#111}
    .result-header>div{color:#fff}
    .mode-bar{background:#181818;color:#888}
    .copy-btn{background:#1e1e1e;border-color:#2e2e2e;color:#aaa}
    .section{background:#0d0d0d}
    .alt-section{background:#0a0a0a}
    .faq-item{border-color:#1a1a1a}
    .faq-q{color:#fff}
    .faq-a{color:#888}
    .feat-card{background:#111;border-color:#1e1e1e}
    .feat-title{color:#fff}
    .feat-desc{color:#666}
    .step-title{color:#fff}
    .step-body{color:#666}
    .sec-title{color:#fff}
    .sec-sub{color:#666}
    .nav-wrap{background:#0d0d0d;border-color:#181818}
    .nav-link{color:#777}
    .nav-link:hover{color:#fff}
    .logo-text{color:#fff}
    .banner-wrap{background:#111;border-color:#1e1e1e;color:#999}
    .btn-outline{border-color:#2a2a2a;color:#fff}
    .btn-outline:hover{background:#181818}
    footer{background:#0a0a0a;border-color:#161616}
    .footer-col-title{color:#333}
    .footer-link{color:#555}
    .footer-link:hover{color:#fff}
    .social-btn{background:#1a1a1a;border-color:#222;color:#555}
    .social-btn:hover{color:#fff;border-color:#444}
    .footer-copy{color:#333}
    .hero h1{color:#fff}
    .hero p{color:#666}
    .hint-text{color:#aaa}
    .tool-hint{color:#aaa}
  ` : `
    body{background:#f4f4f4;color:#111}
    .tool-card{background:#fff;border-color:#e0e0e0}
    .tool-label{color:#777}
    .mode-card{border-color:#e0e0e0;background:#fafafa}
    .mode-card:hover{border-color:#e53935;background:#fff5f5}
    .mode-card.active{border-color:#e53935;background:#fff1f1}
    .mode-label{color:#111}
    .mode-desc{color:#777}
    .tool-textarea{border-color:#d5d5d5;color:#111;background:#fff}
    .drop-zone{border-color:#ccc;background:#f9f9f9}
    .drop-zone:hover{border-color:#e53935;background:#fff5f5}
    .file-btn{background:#111;color:#fff}
    .pip-box{background:#fff;color:#111;border-color:#e53935}
    .pip-box span{color:#666}
    .result-header{background:#f8f8f8}
    .result-header>div{color:#111}
    .mode-bar{background:#f0f0f0;color:#555}
    .copy-btn{background:#f0f0f0;border-color:#ddd;color:#555}
    .section{background:#f4f4f4}
    .alt-section{background:#eaeaea}
    .faq-item{border-color:#ddd}
    .faq-q{color:#111}
    .faq-a{color:#666}
    .feat-card{background:#fff;border-color:#e8e8e8}
    .feat-title{color:#111}
    .feat-desc{color:#666}
    .step-title{color:#111}
    .step-body{color:#666}
    .sec-title{color:#111}
    .sec-sub{color:#666}
    .nav-wrap{background:#fff;border-color:#e8e8e8}
    .nav-link{color:#555}
    .nav-link:hover{color:#111}
    .logo-text{color:#111}
    .banner-wrap{background:#fff8f8;border-color:#fde8e8;color:#888}
    .btn-outline{border-color:#d5d5d5;color:#111}
    .btn-outline:hover{background:#f0f0f0}
    footer{background:#eaeaea;border-color:#ddd}
    .footer-col-title{color:#aaa}
    .footer-link{color:#999}
    .footer-link:hover{color:#111}
    .social-btn{background:#f0f0f0;border-color:#ddd;color:#999}
    .social-btn:hover{color:#111;border-color:#aaa}
    .footer-copy{color:#aaa}
    .hero h1{color:#111}
    .hero p{color:#666}
    .hint-text{color:#aaa}
    .tool-hint{color:#999}
  `

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'Syne',sans-serif;-webkit-font-smoothing:antialiased;transition:background 0.25s,color 0.25s}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:4px}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spin{animation:spin 0.7s linear infinite}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.35s ease forwards}
        @keyframes shimmer{0%{opacity:0.6}50%{opacity:1}100%{opacity:0.6}}
        .pulse{animation:shimmer 1.8s ease infinite}
        .nav-link{font-size:13px;font-weight:600;cursor:pointer;transition:color 0.15s}
        .btn-outline{background:transparent;padding:7px 18px;border-radius:8px;font-family:'Syne';font-size:13px;font-weight:700;cursor:pointer;transition:all 0.15s;border:1.5px solid}
        .btn-red{background:#e53935;color:#fff;border:none;padding:8px 20px;border-radius:8px;font-family:'Syne';font-size:13px;font-weight:700;cursor:pointer;transition:all 0.15s}
        .btn-red:hover:not(:disabled){background:#c62828}
        .btn-red:disabled{background:#2a2a2a;color:#555;cursor:not-allowed}
        .btn-red-lg{font-size:15px;padding:13px 0;border-radius:8px;width:100%;font-weight:700;letter-spacing:0.2px;display:flex;align-items:center;justify-content:center;gap:8px}
        .tool-card{border-radius:14px;padding:28px 32px;max-width:860px;margin:0 auto;border:1px solid}
        .tool-label{display:block;font-size:11px;font-weight:700;margin-bottom:8px;letter-spacing:0.5px;text-transform:uppercase}
        .tool-hint{font-size:11px;margin-top:5px}
        .tool-textarea{width:100%;padding:13px 14px;border-radius:8px;font-family:'DM Mono',monospace;font-size:13px;resize:vertical;min-height:200px;outline:none;transition:border-color 0.15s;line-height:1.65;border:1.5px solid}
        .tool-textarea:focus{border-color:#e53935!important}
        .tool-textarea::placeholder{color:#bbb}
        .mode-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
        .mode-card{border:1.5px solid;border-radius:10px;padding:12px 14px;cursor:pointer;transition:all 0.18s;display:flex;align-items:flex-start;gap:10px}
        .mode-icon{font-size:18px;flex-shrink:0;margin-top:1px}
        .mode-label{font-size:13px;font-weight:700;margin-bottom:3px}
        .mode-desc{font-size:11px;line-height:1.5}
        .drop-zone{border:2px dashed;border-radius:8px;padding:18px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
        .file-btn{border:none;padding:7px 14px;border-radius:6px;font-family:'Syne';font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap}
        .pip-line{width:2px;height:28px;background:#e53935;margin:0 auto}
        .pip-dot{width:10px;height:10px;border-radius:50%;background:#e53935;margin:0 auto}
        .pip-box{border:1.5px solid #e53935;border-radius:8px;padding:10px 24px;font-size:13px;font-weight:700;display:inline-block;letter-spacing:0.2px}
        .result-box{border:1.5px solid #e53935;border-radius:12px;overflow:hidden}
        .result-header{padding:13px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #1e1e1e}
        .result-header>div{font-size:14px;font-weight:700;display:flex;align-items:center;gap:8px}
        .lang-pill{background:#1e2a1e;border:1px solid #2d4a2d;color:#86efac;font-size:11px;font-weight:700;padding:2px 10px;border-radius:20px}
        .lines-pill{background:#1e1e2a;border:1px solid #2d2d4a;color:#93c5fd;font-size:11px;font-weight:700;padding:2px 10px;border-radius:20px}
        .mode-bar{padding:9px 20px;border-bottom:1px solid #1e1e1e;font-size:12px}
        .mode-bar strong{color:#ccc}
        .result-body{background:#fff;padding:32px 36px;font-size:14px;line-height:1.8;color:#111}
        .copy-btn{border:1px solid;padding:5px 13px;border-radius:6px;font-family:'Syne';font-size:12px;font-weight:700;cursor:pointer;transition:all 0.15s}
        .result-body .md-h2{font-size:17px;font-weight:800;color:#111;margin:28px 0 12px;padding-bottom:8px;border-bottom:2px solid #f0f0f0;font-family:'Syne',sans-serif}
        .result-body .md-h2:first-child{margin-top:0}
        .result-body .md-h3{font-size:14px;font-weight:700;color:#1a1a1a;margin:20px 0 8px;font-family:'DM Mono',monospace;background:#f8f8f8;padding:8px 12px;border-radius:0;border-left:3px solid #e53935}
        .result-body .md-p{margin-bottom:10px;color:#333;line-height:1.8}
        .result-body .md-bold{color:#111;font-weight:700}
        .result-body .md-ul{list-style:none;padding:0;margin:8px 0 14px}
        .result-body .md-li{padding:5px 0 5px 20px;position:relative;color:#444;line-height:1.75}
        .result-body .md-li::before{content:'▸';position:absolute;left:0;color:#e53935;font-size:11px;top:7px}
        .result-body .md-oli{padding:4px 0;color:#444;margin-left:20px;line-height:1.75}
        .result-body .md-hr{border:none;border-top:1px solid #eee;margin:20px 0}
        .result-body .ic{background:#f1f5f9;color:#d63384;padding:2px 6px;border-radius:4px;font-family:'DM Mono',monospace;font-size:12px;font-weight:500}
        .code-wrap{border:1px solid #e8e8e8;border-radius:8px;overflow:hidden;margin:12px 0 16px;font-family:'DM Mono',monospace}
        .code-header{background:#f8f8f8;padding:8px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e8e8e8}
        .code-lang{font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.5px}
        .code-copy-btn{background:#111;color:#fff;border:none;padding:4px 10px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;font-family:'Syne'}
        .code-pre{background:#1e1e1e;color:#d4d4d4;padding:20px;overflow-x:auto;margin:0;font-family:'Consolas','Monaco',monospace;font-size:13px;line-height:1.8;border-radius:0 0 8px 8px}
        .code-pre code{color:#d4d4d4 !important;background:transparent;opacity:1 !important}
        .badge{display:inline-flex;align-items:center;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:0.3px;margin-left:6px;vertical-align:middle}
        .badge-critical{background:#fef2f2;color:#dc2626;border:1px solid #fecaca}
        .badge-high{background:#fff7ed;color:#ea580c;border:1px solid #fed7aa}
        .badge-medium{background:#fffbeb;color:#d97706;border:1px solid #fde68a}
        .badge-low{background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0}
        .badge-info{background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe}
        .badge-safe{background:#f0fdf4;color:#15803d;border:1px solid #86efac}
        .table-wrap{overflow-x:auto;margin:12px 0 16px}
        .md-table{width:100%;border-collapse:collapse;font-size:13px}
        .md-table th{background:#f8f8f8;padding:9px 14px;text-align:left;font-weight:700;color:#333;border-bottom:2px solid #e8e8e8;white-space:nowrap}
        .md-table td{padding:8px 14px;border-bottom:1px solid #f0f0f0;color:#444;vertical-align:top}
        .md-table tr:hover td{background:#fafafa}
        .check-row{padding:5px 0;font-size:13px;display:flex;align-items:center;gap:8px}
        .check-done{color:#16a34a}
        .check-todo{color:#999}
        .section{padding:80px 0;transition:background 0.25s}
        .alt-section{padding:80px 0;transition:background 0.25s}
        .sep{border-top:1px solid}
        .sec-title{font-size:32px;font-weight:800;text-align:center;letter-spacing:-0.5px;margin-bottom:10px}
        .sec-sub{font-size:14px;text-align:center;max-width:560px;margin:0 auto 48px;line-height:1.8}
        .step-circle{width:40px;height:40px;border-radius:50%;border:2px solid #e53935;display:flex;align-items:center;justify-content:center;color:#e53935;font-weight:800;font-size:16px;margin:0 auto 14px}
        .step-title{font-size:13px;font-weight:700;text-align:center;margin-bottom:7px}
        .step-body{font-size:12px;line-height:1.75;text-align:center}
        .feat-card{border:1px solid;border-radius:10px;padding:18px 20px;display:flex;gap:14px;align-items:flex-start}
        .feat-title{font-size:14px;font-weight:700;margin-bottom:5px}
        .feat-desc{font-size:13px;line-height:1.7}
        .faq-item{border-bottom:1px solid}
        .faq-q{display:flex;align-items:center;gap:10px;padding:15px 0;cursor:pointer;font-size:14px;font-weight:600;user-select:none;transition:color 0.15s}
        .faq-q:hover{color:#e53935}
        .faq-a{padding:0 0 16px 24px;font-size:13px;line-height:1.8}
        .footer-col-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:14px}
        .footer-link{display:block;font-size:13px;cursor:pointer;margin-bottom:9px;transition:color 0.15s}
        .social-btn{width:30px;height:30px;border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:10px;font-weight:700;transition:all 0.15s;font-family:'Syne';border:1px solid}
        .skel{background:linear-gradient(90deg,#1a1a1a 25%,#222 50%,#1a1a1a 75%);background-size:200% 100%;animation:sk 1.5s infinite;border-radius:4px}
        @keyframes sk{0%{background-position:200% 0}100%{background-position:-200% 0}}
        ${css}
      `}</style>

      

      {/* Modals */}
      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} theme={theme} />}
      {showGetStarted && <GetStartedModal onClose={() => setShowGetStarted(false)} theme={theme} />}

      <div style={{ minHeight: '100vh' }}>

        {/* BANNER */}
        <div className="banner-wrap" style={{ padding: '9px 0', textAlign: 'center', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', borderBottom: '1px solid' }}>
          CodeLens AI is now powered by Llama 3.3 70B — detailed, structured code analysis
          <span className="banner-pill" style={{ background: '#e53935', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '2px 9px', borderRadius: '4px', cursor: 'pointer' }} onClick={() => window.open('https://groq.com', '_blank')}>Read More</span>
        </div>

        {/* NAV */}
        <nav className="nav-wrap" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 40px', height: '64px', borderBottom: '1px solid', position: 'sticky', top: 0, zIndex: 100, transition: 'background 0.25s' }}>
          {/* Left: nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {[['Code Generator','/code-generator'],['Code Converter','/code-converter'],['Code Formatter','/code-formatter'],['Code Debugger','/code-debugger']].map(([l,h]) => <span key={l} className="nav-link" onClick={() => router.push(h)}>{l}</span>)}
          </div>
          {/* Center: logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: '#e53935', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="13,2 4,14 12,14 11,22 20,10 13,10"/></svg></div>
            <span className="logo-text" style={{ fontSize: '19px', fontWeight: '800', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>CodeLens AI</span>
          </div>
          {/* Right: theme + auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}>
            {session ? (
            <>
              <span style={{ fontSize: '14px', color: '#aaa' }}>{session.user?.name || session.user?.email}</span>
              <button className="btn-red" onClick={() => router.push('/signout')}>Sign Out</button>
            </>
          ) : (
            <>
              <button className="btn-outline" onClick={() => router.push('/signin')}>Sign In</button>
              <button className="btn-red" onClick={() => router.push('/signup')}>Get Started</button>
            </>
          )}
            <button
              onClick={() => { const n = theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('theme', n); document.documentElement.setAttribute('data-theme',n); setTheme(n) }}
              style={{ background: 'none', border: `1.5px solid ${isDark ? '#2a2a2a' : '#d5d5d5'}`, color: isDark ? '#aaa' : '#666', width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0 }}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            
            
          </div>
        </nav>

        {/* HERO */}
        <div className="hero" style={{ padding: '52px 40px 0', textAlign: 'center' }}>
          <h1 style={{ fontSize: '64px', fontWeight: '800', letterSpacing: '-2px', lineHeight: 1.05 }}>
            AI Code Review — Free Tool
          </h1>
          <p style={{ fontSize: '18px', marginTop: '14px', maxWidth: '500px', margin: '14px auto 0', lineHeight: 1.7 }}>
            Get detailed, structured analysis with bug locations, severity ratings, and working code fixes.
          </p>
        </div>

        {/* TOOL CARD */}
        <div style={{ padding: '28px 40px 0' }}>
          <div className="tool-card">
            <div style={{ marginBottom: '24px' }}>
              <label className="tool-label" style={{fontSize:'16px',fontWeight:'700',marginBottom:'8px',display:'block'}}>Type of Review</label>
              <select className="mode-select" value={mode} onChange={e => setMode(e.target.value)} style={{width:'100%',padding:'14px 16px',borderRadius:'10px',border:'1.5px solid #ddd',fontSize:'16px',background:'#fff',color:'#111',cursor:'pointer',appearance:'auto',marginBottom:'6px'}}>
                {MODES.map(m => <option key={m.id} value={m.id}>{m.icon} {m.label}</option>)}
              </select>
              <div style={{fontSize:'13px',color:'#888',marginBottom:'8px'}}>{MODES.find(m => m.id === mode)?.desc}</div>
            </div>




            <div style={{ marginBottom: '16px' }}>
              <label className="tool-label">Enter Code</label>
              <textarea
                className="tool-textarea"
                placeholder="Paste your code here..."
                value={codeText}
                onChange={e => { setCodeText(e.target.value); if (e.target.value) setInputMode('text') }}
              />
              <div className="tool-hint">Or upload a file below. Language is auto-detected.</div>
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label className="tool-label">Upload Code File</label>
              {!file ? (
                <div
                  className={'drop-zone' + (dragging ? ' drag' : '')}
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                >
                  <button className="file-btn" onClick={() => fileInputRef.current?.click()}>CHOOSE FILE</button>
                  <span className="hint-text" style={{ fontSize: '13px' }}>No file chosen — or drag & drop here</span>
                  <input ref={fileInputRef} type="file" style={{ display: 'none' }} accept=".py,.js,.ts,.tsx,.jsx,.java,.cpp,.c,.cs,.rb,.go,.php,.swift,.kt,.rs" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: '1.5px solid #22c55e', borderRadius: '8px', background: '#f0fdf4' }}>
                  <span style={{ fontSize: '18px' }}>📄</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#16a34a', fontFamily: 'DM Mono,monospace' }}>{file.name}</div>
                    <div style={{ fontSize: '11px', color: '#86efac' }}>{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <button onClick={() => { setFile(null); setInputMode('text') }} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '22px', lineHeight: 1 }}>×</button>
                </div>
              )}
              <div className="tool-hint">Supported: .py .js .ts .tsx .jsx .java .cpp .cs .rb .go .php .swift .kt .rs — up to 4.5MB</div>
            </div>

            <button className="btn-red btn-red-lg" onClick={analyze} disabled={!hasInput || loading}>
              {loading
                ? <><div className="spin" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} /> Analyzing...</>
                : <><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="13,2 4,14 12,14 11,22 20,10 13,10"/></svg> Review Code</>}
            </button>
          </div>
        </div>
        {loading && (
          <div style={{ maxWidth: '860px', margin: '28px auto 0', padding: '0 40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div className="pip-line" />
              <div className="pip-dot pulse" />
              <div className="pip-line" />
              <div style={{ padding: '0 20px' }}>
                <div className="pip-box pulse">AI Model: <span>Analyzing your code...</span></div>
              </div>
              <div className="pip-line" />
              <div className="pip-dot pulse" />
              <div className="pip-line" />
            </div>
            <div style={{ border: '1.5px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ background: '#111', padding: '13px 20px' }}>
                <div className="skel" style={{ height: '16px', width: '200px' }} />
              </div>
              <div style={{ background: '#fff', padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[80, 60, 90, 50, 70, 40].map((w, i) => (
                  <div key={i} style={{ height: "14px", width: w+"%", borderRadius: "4px", background: "#f0f0f0" }} />
                ))}
              </div>
            </div>
          </div>
        )}
        {/* RESULT */}
        {result && !loading && (
          <div ref={resultRef}><AnalysisResult result={result} /></div>
        )}

        {/* HOW IT WORKS */}
        <div className="alt-section sep" style={{ marginTop: '64px', borderTopColor: isDark ? '#161616' : '#ddd' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 40px' }}>
            <h2 className="sec-title">How Code Reviewer Works</h2>
            <p className="sec-sub">Detailed, structured analysis in 4 simple steps</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '28px' }}>
              {STEPS.map(s => (
                <div key={s.n}>
                  <div className="step-circle">{s.n}</div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-body">{s.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WHAT YOU GET */}
        <div className="section sep" style={{ borderTopColor: isDark ? '#161616' : '#ddd' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 40px' }}>
            <h2 className="sec-title">What You Get in Every Review</h2>
            <p className="sec-sub">Each analysis is structured, detailed, and actionable — not generic feedback</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { icon: '🐛', title: 'Bug Detection with Line Numbers', desc: 'Every bug is located, explained, and given a working fix with severity rating.' },
                { icon: '🔧', title: 'Working Code Fixes', desc: 'Not just "this is wrong" — every issue includes a corrected code snippet.' },
                { icon: '📊', title: 'Quality Score', desc: 'Get an overall quality score with a professional verdict on the code\'s readiness.' },
                { icon: '⚡', title: 'Performance Analysis', desc: 'Time and space complexity analysis with optimized alternatives.' },
                { icon: '🛡️', title: 'Security Vulnerabilities', desc: 'OWASP-mapped vulnerabilities with attack scenarios and hardened code.' },
                { icon: '📄', title: 'Auto Documentation', desc: 'Complete JSDoc/docstrings, parameter tables, usage examples, and data flow.' },
              ].map(f => (
                <div key={f.title} className="feat-card">
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <div className="feat-title">{f.title}</div>
                    <div className="feat-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="alt-section sep" style={{ borderTopColor: isDark ? '#161616' : '#ddd' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 40px' }}>
            <h2 className="sec-title">FAQ</h2>
            <p className="sec-sub" style={{ marginBottom: '36px' }}>Frequently asked questions</p>
            {[
              { q: 'Is it free?', a: 'Yes — completely free, no registration needed. Powered by Llama 3.3 70B via Groq.' },
              { q: 'What languages are supported?', a: 'Python, JavaScript, TypeScript, Java, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, and more. Language is auto-detected.' },
              { q: 'How detailed is the analysis?', a: 'Very detailed. Each bug includes its location, explanation, impact, severity badge, and a working code fix.' },
              { q: 'What is the maximum file size?', a: 'Up to 4.5MB. For large codebases, split into smaller files for the best results.' },
              { q: 'Can I get documentation generated?', a: 'Yes — select "Documentation Generator" mode to get JSDoc/docstrings, parameter tables, and usage examples.' },
            ].map((f, i) => (
              <div key={i} className="faq-item">
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <span style={{ color: '#555', fontSize: '13px', opacity: 0.6 }}>?</span>
                  <span style={{ flex: 1 }}>{f.q}</span>
                  <span style={{ color: '#555', fontSize: '17px', lineHeight: 1 }}>{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && <div className="faq-a fade-up">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{background:isDark?'#0a0a0a':'#f0f0f0',borderTop:'1px solid'+(isDark?' #1e1e1e':' #e0e0e0'),padding:'60px 48px 32px'}}>
          <div style={{maxWidth:'1100px',margin:'0 auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'48px'}}>
              <div>
                <div style={{display:'flex',alignItems:'center',gap:'9px',marginBottom:'12px'}}>
                  <div style={{width:'28px',height:'28px',background:'#e53935',borderRadius:'7px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px'}}><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="13,2 4,14 12,14 11,22 20,10 13,10"/></svg></div>
                  <span style={{fontSize:'17px',fontWeight:'800',color:isDark?'#fff':'#111'}}>CodeLens AI</span>
                </div>
                <div style={{fontSize:'13px',color:isDark?'#555':'#888',maxWidth:'200px',lineHeight:1.6}}>AI-powered Code Analyzer for Developers</div>
                <div style={{display:'flex',gap:'10px',marginTop:'24px'}}>
                  <a href='https://x.com/kumar_ashi83412' target='_blank' rel='noopener noreferrer' style={{width:'44px',height:'44px',borderRadius:'10px',background:isDark?'#1a1a1a':'#e8e8e8',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDark?'#888':'#666'} strokeWidth="2"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg></a>
                  <a href='#' style={{width:'44px',height:'44px',borderRadius:'10px',background:isDark?'#1a1a1a':'#e8e8e8',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDark?'#888':'#666'} strokeWidth="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>
                  <a href='https://www.linkedin.com/in/ashish-kumar-2bb739285/' target='_blank' rel='noopener noreferrer' style={{width:'44px',height:'44px',borderRadius:'10px',background:isDark?'#1a1a1a':'#e8e8e8',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDark?'#888':'#666'} strokeWidth="2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
                </div>
              </div>
              <div style={{display:'flex',gap:'80px'}}>
                {[{title:'Company',links:[{l:'Blog',h:'/blog'},{l:'About',h:'/about'},{l:'Documentation',h:'/documentation'},{l:'FAQ',h:'#faq'}]},{title:'Resources',links:[{l:'Community',h:'/community'},{l:'Terms of Use',h:'/terms'},{l:'Privacy Policy',h:'/privacy'},{l:'Cookies Policy',h:'/cookies'}]}].map(col=>(
                  <div key={col.title}>
                    <div style={{fontSize:'11px',fontWeight:'700',color:isDark?'#444':'#999',textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:'16px'}}>{col.title}</div>
                    {col.links.map(item=><span key={item.l} onClick={()=>{ window.scrollTo(0,0); router.push(item.h) }} style={{display:'block',fontSize:'14px',color:isDark?'#666':'#777',textDecoration:'none',marginBottom:'10px',cursor:'pointer'}}>{item.l}</span>)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </footer>
        </div>
    </>
  )
}
