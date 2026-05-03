'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CodeConverter() {
  const [code, setCode] = useState('')
  const [fromLang, setFromLang] = useState('python')
  const [toLang, setToLang] = useState('javascript')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const LANGS=['Python','JavaScript','TypeScript','Java','C++','C#','Go','Rust','PHP','Ruby','Swift','Kotlin','R','Scala','Dart','Bash','SQL','C','Lua']
  const NAV=[['Code Generator','/code-generator'],['Code Converter','/code-converter'],['Code Formatter','/code-formatter'],['Code Review','/']]

  const convert = async () => {
    if (!code.trim()) return
    setLoading(true); setResult('')
    try {
      const prompt = 'Convert this ' + fromLang + ' code to ' + toLang + ':\n\n' + code
      const formData = new FormData()
      formData.append('file', new Blob([prompt], { type: 'text/plain' }), 'code.txt')
      formData.append('mode', 'convert')
      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      const data = await res.json()
      const raw = data.analysis || data.error || 'No result'
      setResult(raw.replace(/`[\w]*\n?/g,'').replace(/`/g,'').trim())
    } catch { setResult('Connection error.') }
    finally { setLoading(false) }
  }

  return (
    <>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:Syne,sans-serif;background:#0d0d0d;color:#fff}`}</style>
      <nav style={{background:'#0d0d0d',borderBottom:'1px solid #181818',padding:'0 40px',height:'64px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer'}} onClick={() => router.push('/')}>
          <div style={{width:'32px',height:'32px',background:'#e53935',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="13,2 4,14 12,14 11,22 20,10 13,10"/></svg></div>
          <span style={{fontSize:'19px',fontWeight:'800',color:'#fff'}}>CodeLens AI</span>
        </div>
        <div style={{display:'flex',gap:'20px'}}>{NAV.map(([l,h]) => <span key={l} onClick={() => router.push(h)} style={{fontSize:'13px',fontWeight:l==='Code Converter'?'800':'600',color:l==='Code Converter'?'#e53935':'#777',cursor:'pointer'}}>{l}</span>)}</div>
      </nav>
      <div style={{maxWidth:'960px',margin:'0 auto',padding:'48px 40px'}}>
        <button onClick={()=>router.back()} style={{background:'#e53935',border:'none',color:'#fff',padding:'8px 18px',borderRadius:'8px',fontSize:'13px',fontWeight:'700',cursor:'pointer',fontFamily:'inherit',marginBottom:'28px'}}>&#8592; Back</button>
        <h1 style={{fontSize:'48px',fontWeight:'800',marginBottom:'10px'}}>Code Converter</h1>
        <p style={{color:'#666',marginBottom:'32px'}}>Convert code from one language to another instantly.</p>
        <div style={{display:'flex',gap:'16px',marginBottom:'20px'}}>
          <div style={{flex:1}}>
            <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:'#555',marginBottom:'8px',textTransform:'uppercase'}}>From</label>
            <select value={fromLang} onChange={e => setFromLang(e.target.value)} style={{width:'100%',padding:'11px 14px',borderRadius:'8px',border:'1.5px solid #2a2a2a',fontSize:'14px',background:'#1a1a1a',color:'#fff',outline:'none'}}>{LANGS.map(l => (<option key={l} value={l.toLowerCase()}>{l}</option>))}</select>
          </div>
          <div style={{display:'flex',alignItems:'flex-end',paddingBottom:'2px',fontSize:'20px',color:'#e53935'}}>&#8594;</div>
          <div style={{flex:1}}>
            <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:'#555',marginBottom:'8px',textTransform:'uppercase'}}>To</label>
            <select value={toLang} onChange={e => setToLang(e.target.value)} style={{width:'100%',padding:'11px 14px',borderRadius:'8px',border:'1.5px solid #2a2a2a',fontSize:'14px',background:'#1a1a1a',color:'#fff',outline:'none'}}>{LANGS.map(l => (<option key={l} value={l.toLowerCase()}>{l}</option>))}</select>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'20px'}}>
          <div>
            <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:'#555',marginBottom:'8px',textTransform:'uppercase'}}>Input Code</label>
            <textarea spellCheck={false} value={code} onChange={e => setCode(e.target.value)} placeholder="Paste your code here..." style={{width:'100%',height:'320px',padding:'13px 14px',borderRadius:'8px',border:'1.5px solid #2a2a2a',fontSize:'13px',background:'#1a1a1a',color:'#fff',resize:'none',outline:'none',fontFamily:'Consolas,monospace',lineHeight:1.65}} />
          </div>
          <div>
            <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:'#555',marginBottom:'8px',textTransform:'uppercase'}}>Converted Code</label>
            <pre style={{width:'100%',height:'320px',padding:'13px 14px',borderRadius:'8px',border:'1.5px solid #2a2a2a',fontSize:'13px',background:'#1e1e1e',color:'#d4d4d4',overflow:'auto',whiteSpace:'pre-wrap',fontFamily:'Consolas,monospace',lineHeight:1.65,margin:0}}>{result || 'Converted code will appear here...'}</pre>
          </div>
        </div>
        <button onClick={convert} disabled={!code.trim()||loading} style={{width:'100%',background:loading?'#2a2a2a':'#e53935',color:loading?'#555':'#fff',border:'none',padding:'13px',borderRadius:'8px',fontSize:'15px',fontWeight:'700',cursor:'pointer',fontFamily:'inherit'}}>{loading ? 'Converting...' : 'Convert Code'}</button>
      </div>
    </>
  )
}
