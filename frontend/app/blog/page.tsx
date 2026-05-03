'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
export default function Blog() {
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
        <h1 style={{fontSize:'40px',fontWeight:800,marginBottom:'8px',color:fg}}>Blog</h1>
        <p style={{color:muted,marginBottom:'40px',fontSize:'15px',lineHeight:1.6}}>Latest updates, tutorials and insights from the CodeLens AI team.</p>
        <div style={{marginBottom:'24px',padding:'24px',background:card,borderRadius:'12px',border:`1px solid `}}>
          <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'10px',color:'#e53935'}}>CodeLens AI Launch</h2>
          <p style={{color:muted,lineHeight:1.7,fontSize:'14px'}}>We are excited to announce the launch of CodeLens AI - your AI-powered code analysis platform.</p>
        </div>
        <div style={{marginBottom:'24px',padding:'24px',background:card,borderRadius:'12px',border:`1px solid `}}>
          <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'10px',color:'#e53935'}}>How AI is Changing Code Review</h2>
          <p style={{color:muted,lineHeight:1.7,fontSize:'14px'}}>Artificial intelligence is transforming the way developers write and review code faster than ever before.</p>
        </div>
        <div style={{marginBottom:'24px',padding:'24px',background:card,borderRadius:'12px',border:`1px solid `}}>
          <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'10px',color:'#e53935'}}>Top 5 Code Quality Tips</h2>
          <p style={{color:muted,lineHeight:1.7,fontSize:'14px'}}>Here are our top tips for writing clean, maintainable and efficient code every day.</p>
        </div>
      </div>
    </>
  )
}
