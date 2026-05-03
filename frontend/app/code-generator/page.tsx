'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CodeGenerator() {
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState('python')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const languages=['Python','JavaScript','TypeScript','Java','C++','Go','Rust','PHP','Swift','Kotlin']
  const [theme,setTheme]=useState<'dark'|'light'>('dark')
  const isDark=theme==='dark'
  useEffect(()=>{ const t=document.documentElement.getAttribute('data-theme') as any; if(t) setTheme(t) })
  const bg=isDark?'#0d0d0d':'#f4f4f4'
  const fg=isDark?'#fff':'#111'
  const card=isDark?'#111':'#fff'
  const border=isDark?'#2a2a2a':'#e0e0e0'
  const inp=isDark?'#1a1a1a':'#fafafa'
  const LANGS=['Python','JavaScript','TypeScript','Java','C++','C#','Go','Rust','PHP','Ruby','Swift','Kotlin','R','Scala','Dart','Bash','SQL','C','Haskell','Lua']

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true); setResult('')
    try {
      const formData = new FormData()
      formData.append('file', new Blob(['Generate ' + language + ' code for: ' + prompt], { type: 'text/plain' }), 'code.txt')
      formData.append('mode', 'generate')
      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      const data = await res.json()
      const raw = data.analysis || data.error || 'No result'
      setResult(raw.replace(/`[\w]*\n?/g,'').replace(/`/g,'').trim())
    } catch { setResult('Connection error.') }
    finally { setLoading(false) }
  }

  const NAV = [['Code Generator','/code-generator'],['Code Converter','/code-converter'],['Code Formatter','/code-formatter'],['Code Review','/']]

  return (
    <>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:Syne,sans-serif;background:#0d0d0d;color:#fff}`}</style>
      <nav style={{background:'#0d0d0d',borderBottom:'1px solid #181818',padding:'0 40px',height:'64px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer'}} onClick={() => router.push('/')}>
          <div style={{width:'32px',height:'32px',background:'#e53935',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="13,2 4,14 12,14 11,22 20,10 13,10"/></svg></div>
          <span style={{fontSize:'19px',fontWeight:'800',color:'#fff'}}>CodeLens AI</span>
        </div>
        <div style={{display:'flex',gap:'20px'}}>
          {NAV.map(([l,h]) => <span key={l} onClick={() => router.push(h)} style={{fontSize:'13px',fontWeight:l==='Code Generator'?'800':'600',color:l==='Code Generator'?'#e53935':'#777',cursor:'pointer'}}>{l}</span>)}
        </div>
      </nav>
      <div style={{maxWidth:'860px',margin:'0 auto',padding:'48px 40px'}}>
        <button onClick={()=>router.back()} style={{display:'flex',alignItems:'center',gap:'6px',background:'#e53935',border:'none',color:'#fff',padding:'8px 18px',borderRadius:'8px',fontSize:'13px',fontWeight:'700',cursor:'pointer',fontFamily:'inherit',marginBottom:'28px'}}>← Back</button>
        <h1 style={{fontSize:'48px',fontWeight:'800',marginBottom:'10px'}}>Code Generator</h1>
        <p style={{color:'#666',marginBottom:'40px'}}>Describe what you want to build and get working code instantly.</p>
        <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'14px',padding:'28px 32px',marginBottom:'24px'}}>
          <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:'#555',marginBottom:'8px',textTransform:'uppercase'}}>Language</label>
          <select value={language} onChange={e => setLanguage(e.target.value)} style={{width:'100%',padding:'11px 14px',borderRadius:'8px',border:'1.5px solid #2a2a2a',fontSize:'14px',background:'#1a1a1a',color:'#fff',outline:'none',marginBottom:'16px'}}>
            {languages.map(l=>(<option key={l} value={l.toLowerCase()}>{l}</option>))}
          </select>
          <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:'#555',marginBottom:'8px',textTransform:'uppercase'}}>Describe what to build</label>
          <textarea spellCheck={false} value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g. A REST API endpoint that validates emails..." style={{width:'100%',padding:'13px 14px',borderRadius:'8px',border:'1.5px solid #2a2a2a',fontSize:'14px',background:'#1a1a1a',color:'#fff',resize:'vertical',minHeight:'140px',outline:'none',lineHeight:1.65,fontFamily:'inherit',marginBottom:'20px'}} /><button onClick={generate} disabled={!prompt.trim()||loading} style={{width:'100%',background:loading?'#2a2a2a':'#e53935',color:loading?'#555':'#fff',border:'none',padding:'13px',borderRadius:'8px',fontSize:'15px',fontWeight:'700',cursor:'pointer',fontFamily:'inherit'}}>Generate Code</button>
        </div>
        {result && <div><div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}><span style={{color:'#e53935',fontWeight:'700',fontSize:'13px'}}>Generated Code</span><button onClick={() => { navigator.clipboard.writeText(result); const b=document.activeElement as HTMLButtonElement; if(b){const t=b.textContent; b.textContent='Copied!'; setTimeout(()=>b.textContent=t,2000)} }} style={{background:'#1a1a1a',border:'1px solid #2a2a2a',color:'#aaa',padding:'5px 13px',borderRadius:'6px',fontSize:'12px',fontWeight:'700',cursor:'pointer',fontFamily:'inherit'}}>Copy</button></div><pre style={{background:'#1e1e1e',color:'#d4d4d4',padding:'24px',borderRadius:'10px',fontFamily:'Consolas,monospace',fontSize:'13px',lineHeight:1.8,overflowX:'auto',whiteSpace:'pre-wrap',border:'1px solid #2a2a2a'}}>{result}</pre></div>}
      </div>
    </>
  )
}
