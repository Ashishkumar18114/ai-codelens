'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
export default function Documentation() {
  const router = useRouter()
  const [theme,setTheme]=useState<'dark'|'light'>('dark')
  useEffect(()=>{ const t=localStorage.getItem('theme') as any; if(t) setTheme(t) },[])
  const isDark=theme==='dark'
  const bg=isDark?'#0d0d0d':'#f4f4f4'
  const fg=isDark?'#fff':'#111'
  const card=isDark?'#111':'#fff'
  const border=isDark?'#2a2a2a':'#e0e0e0'
  const muted=isDark?'#888':'#555'
  return (
    <>
      <style dangerouslySetInnerHTML={{__html:`*{box-sizing:border-box;margin:0;padding:0}body{font-family:Syne,sans-serif;background:;color:}`}} />
      <nav style={{background:bg,borderBottom:`1px solid `,padding:'0 40px',height:'64px',display:'flex',alignItems:'center',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer'}} onClick={()=>router.push('/')}>
          <div style={{width:'32px',height:'32px',background:'#e53935',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="13,2 4,14 12,14 11,22 20,10 13,10"/></svg></div>
          <span style={{fontSize:'19px',fontWeight:'800',color:fg}}>CodeLens AI</span>
        </div>
      </nav>
      <div style={{maxWidth:'800px',margin:'0 auto',padding:'60px 40px'}}>
        <button onClick={()=>router.back()} style={{background:'#e53935',border:'none',color:'#fff',padding:'8px 18px',borderRadius:'8px',fontSize:'13px',fontWeight:'700',cursor:'pointer',fontFamily:'inherit',marginBottom:'32px',display:'inline-flex',alignItems:'center',gap:'6px'}}><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="13,2 4,14 12,14 11,22 20,10 13,10"/></svg>← Back</button>
        <h1 style={{fontSize:'40px',fontWeight:800,marginBottom:'8px',color:fg}}>Documentation</h1>
        <p style={{color:muted,marginBottom:'40px',fontSize:'15px',lineHeight:1.6}}>Learn how to use all the tools in CodeLens AI.</p>
        <div style={{marginBottom:'24px',padding:'24px',background:card,borderRadius:'12px',border:`1px solid `}}>
          <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'10px',color:'#e53935'}}>Code Generator</h2>
          <p style={{color:muted,lineHeight:1.7,fontSize:'14px'}}>Describe what you want to build and our AI will generate clean, working code in your chosen language.</p>
        </div>
        <div style={{marginBottom:'24px',padding:'24px',background:card,borderRadius:'12px',border:`1px solid `}}>
          <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'10px',color:'#e53935'}}>Code Converter</h2>
          <p style={{color:muted,lineHeight:1.7,fontSize:'14px'}}>Paste code in one language and convert it to another instantly. Supports Python, JavaScript, TypeScript, Java, C++ and more.</p>
        </div>
        <div style={{marginBottom:'24px',padding:'24px',background:card,borderRadius:'12px',border:`1px solid `}}>
          <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'10px',color:'#e53935'}}>Code Formatter</h2>
          <p style={{color:muted,lineHeight:1.7,fontSize:'14px'}}>Paste messy code and get it back clean, properly indented and formatted according to best practices.</p>
        </div>
        <div style={{marginBottom:'24px',padding:'24px',background:card,borderRadius:'12px',border:`1px solid `}}>
          <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'10px',color:'#e53935'}}>Code Debugger</h2>
          <p style={{color:muted,lineHeight:1.7,fontSize:'14px'}}>Paste buggy code and get a full bug report with explanations and the fixed code.</p>
        </div>
        <div style={{marginBottom:'24px',padding:'24px',background:card,borderRadius:'12px',border:`1px solid `}}>
          <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'10px',color:'#e53935'}}>Code Review</h2>
          <p style={{color:muted,lineHeight:1.7,fontSize:'14px'}}>Get a detailed AI-powered review of your code including quality score, issues and improvement suggestions.</p>
        </div>
      </div>
    </>
  )
}
