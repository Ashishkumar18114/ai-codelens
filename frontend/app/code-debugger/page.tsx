'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CodeDebugger() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [theme,setTheme]=useState<'dark'|'light'>('dark')
  const isDark = theme === 'dark'
  useEffect(()=>{ const t=document.documentElement.getAttribute('data-theme') as any; if(t) setTheme(t) })
  const bg = isDark ? '#0d0d0d' : '#f4f4f4'
  const fg = isDark ? '#fff' : '#111'
  const card = isDark ? '#111' : '#fff'
  const border = isDark ? '#2a2a2a' : '#e0e0e0'
  const inp = isDark ? '#1a1a1a' : '#fafafa'
  const NAV = [['Code Generator','/code-generator'],['Code Converter','/code-converter'],['Code Formatter','/code-formatter'],['Code Debugger','/code-debugger'],['Code Review','/']]

  const debug = async () => {
    if (!code.trim()) return
    setLoading(true); setResult('')
    try {
      const formData = new FormData()
      formData.append('file', new Blob([code], { type: 'text/plain' }), 'code.txt')
      formData.append('mode', 'explain')
      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      const data = await res.json()
      setResult(data.analysis || data.error || 'No result')
    } catch { setResult('Connection error.') }
    finally { setLoading(false) }
  }

  return (
    <>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:Syne,sans-serif;background:;color:}`}</style>
      <nav className='page-nav'>
        <div style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer'}} onClick={()=>router.push('/')}>
          <div style={{width:'32px',height:'32px',background:'#e53935',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="13,2 4,14 12,14 11,22 20,10 13,10"/></svg></div>
          <span style={{fontSize:'19px',fontWeight:'800',color:fg}}>CodeLens AI</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
          {NAV.map(([l,h])=><span key={l} onClick={()=>router.push(h)} style={{fontSize:'13px',fontWeight:l==='Code Debugger'?'800':'600',color:l==='Code Debugger'?'#e53935':isDark?'#777':'#555',cursor:'pointer'}}>{l}</span>)}
        </div>
      </nav>
      <div style={{maxWidth:'960px',margin:'0 auto',padding:'48px 40px'}}>
        <button onClick={()=>router.back()} style={{display:'flex',alignItems:'center',gap:'6px',background:'#e53935',border:'none',color:'#fff',padding:'8px 18px',borderRadius:'8px',fontSize:'13px',fontWeight:'700',cursor:'pointer',fontFamily:'inherit',marginBottom:'28px'}}>Debug Code</button>
        <h1 style={{fontSize:'48px',fontWeight:'800',color:fg,marginBottom:'10px'}}>Code Debugger</h1>
        <p style={{color:isDark?'#666':'#888',marginBottom:'32px'}}>Paste buggy code and get a full bug report with fixed code.</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'20px'}}>
          <div><label style={{display:'block',fontSize:'11px',fontWeight:'700',color:isDark?'#555':'#999',marginBottom:'8px',textTransform:'uppercase'}}>Buggy Code</label>
          <textarea spellCheck={false} value={code} onChange={e=>setCode(e.target.value)} placeholder="Paste your buggy code here..." style={{width:'100%',height:'400px',padding:'13px 14px',borderRadius:'8px',border:'1.5px solid #2a2a2a',fontSize:'13px',background:inp,color:fg,resize:'none',outline:'none',fontFamily:'Consolas,monospace',lineHeight:1.65}} /></div>
          <div><label style={{display:'block',fontSize:'11px',fontWeight:'700',color:isDark?'#555':'#999',marginBottom:'8px',textTransform:'uppercase'}}>Debug Report</label>
          <div style={{width:'100%',height:'400px',padding:'13px 14px',borderRadius:'8px',border:'1.5px solid #2a2a2a',fontSize:'13px',background:card,color:isDark?'#aaa':'#333',overflow:'auto',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{loading?<div style={{textAlign:'center',marginTop:'160px',color:'#555'}}>Analyzing...</div>:result?<div style={{whiteSpace:'pre-wrap'}}>{result}</div>:<div style={{textAlign:'center',marginTop:'160px',color:isDark?'#333':'#bbb'}}>Debug report will appear here</div>}</div>
          </div>
        </div>
        <button onClick={debug} disabled={!code.trim()||loading} style={{width:'100%',background:loading?'#2a2a2a':'#e53935',color:loading?'#555':'#fff',border:'none',padding:'13px',borderRadius:'8px',fontSize:'15px',fontWeight:'700',cursor:'pointer',fontFamily:'inherit'}}>{loading ? 'Debugging...' : 'Debug Code'}</button>
      </div>
    </>
  )
}
