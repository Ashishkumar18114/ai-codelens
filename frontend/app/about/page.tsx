'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
export default function About() {
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
        <h1 style={{fontSize:'40px',fontWeight:800,marginBottom:'8px',color:fg}}>About Us</h1>
        <p style={{color:muted,marginBottom:'40px',fontSize:'15px',lineHeight:1.6}}>Learn more about CodeLens AI and our mission.</p>
        <div style={{marginBottom:'24px',padding:'24px',background:card,borderRadius:'12px',border:`1px solid `}}>
          <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'10px',color:'#e53935'}}>Our Mission</h2>
          <p style={{color:muted,lineHeight:1.7,fontSize:'14px'}}>CodeLens AI was built to help developers write better code faster. We believe AI should empower developers, not replace them.</p>
        </div>
        <div style={{marginBottom:'24px',padding:'24px',background:card,borderRadius:'12px',border:`1px solid `}}>
          <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'10px',color:'#e53935'}}>What We Build</h2>
          <p style={{color:muted,lineHeight:1.7,fontSize:'14px'}}>We provide AI-powered tools for code generation, conversion, formatting, debugging and review - all in one platform.</p>
        </div>
        <div style={{marginBottom:'24px',padding:'24px',background:card,borderRadius:'12px',border:`1px solid `}}>
          <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'10px',color:'#e53935'}}>Our Team</h2>
          <p style={{color:muted,lineHeight:1.7,fontSize:'14px'}}>We are a passionate team of developers and AI enthusiasts dedicated to improving the developer experience.</p>
        </div>
        <div style={{marginBottom:'24px',padding:'24px',background:card,borderRadius:'12px',border:`1px solid `}}>
          <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'10px',color:'#e53935'}}>Contact Us</h2>
          <p style={{color:muted,lineHeight:1.7,fontSize:'14px'}}>Have questions or feedback? Reach out to us on LinkedIn or Twitter/X. We would love to hear from you.</p>
        </div>
      </div>
    </>
  )
}
