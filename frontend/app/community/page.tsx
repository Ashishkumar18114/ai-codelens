'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
export default function Community() {
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
        <h1 style={{fontSize:'40px',fontWeight:800,marginBottom:'8px',color:fg}}>Community</h1>
        <p style={{color:muted,marginBottom:'40px',fontSize:'15px',lineHeight:1.6}}>Join the CodeLens AI developer community.</p>
        <div style={{marginBottom:'24px',padding:'24px',background:card,borderRadius:'12px',border:`1px solid `}}>
          <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'10px',color:'#e53935'}}>Join Our Community</h2>
          <p style={{color:muted,lineHeight:1.7,fontSize:'14px'}}>Connect with thousands of developers using CodeLens AI to write better code every day.</p>
        </div>
        <div style={{marginBottom:'24px',padding:'24px',background:card,borderRadius:'12px',border:`1px solid `}}>
          <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'10px',color:'#e53935'}}>Share Your Work</h2>
          <p style={{color:muted,lineHeight:1.7,fontSize:'14px'}}>Share your projects, get feedback and collaborate with other developers in the community.</p>
        </div>
        <div style={{marginBottom:'24px',padding:'24px',background:card,borderRadius:'12px',border:`1px solid `}}>
          <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'10px',color:'#e53935'}}>Stay Updated</h2>
          <p style={{color:muted,lineHeight:1.7,fontSize:'14px'}}>Follow us on Twitter/X and LinkedIn to stay up to date with the latest features and updates.</p>
        </div>
        <div style={{marginBottom:'24px',padding:'24px',background:card,borderRadius:'12px',border:`1px solid `}}>
          <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'10px',color:'#e53935'}}>Contribute</h2>
          <p style={{color:muted,lineHeight:1.7,fontSize:'14px'}}>CodeLens AI is built by developers for developers. We welcome contributions, feedback and feature requests.</p>
        </div>
      </div>
    </>
  )
}
