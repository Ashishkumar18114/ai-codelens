'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
export default function Privacy() {
  const router = useRouter()
  const [theme,setTheme]=useState<'dark'|'light'>('dark')
  useEffect(()=>{ const t=localStorage.getItem('theme') as any; if(t) setTheme(t) },[])
  const isDark=theme==='dark'
  const bg=isDark?'#0d0d0d':'#f4f4f4'
  const fg=isDark?'#fff':'#111'
  const card=isDark?'#111':'#fff'
  const border=isDark?'#2a2a2a':'#e0e0e0'
  return (
    <>
      <style dangerouslySetInnerHTML={{__html:`*{box-sizing:border-box;margin:0;padding:0}body{font-family:Syne,sans-serif;background:;color:}`}} />
      <nav className='page-nav'>
        <div style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer'}} onClick={()=>router.push('/')}>
          <div style={{width:'32px',height:'32px',background:'#e53935',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="13,2 4,14 12,14 11,22 20,10 13,10"/></svg></div>
          <span style={{fontSize:'19px',fontWeight:'800',color:fg}}>CodeLens AI</span>
        </div>
      </nav>
      <div style={{maxWidth:'800px',margin:'0 auto',padding:'60px 40px'}}>
        <button onClick={()=>router.back()} style={{background:'#e53935',border:'none',color:'#fff',padding:'8px 18px',borderRadius:'8px',fontSize:'13px',fontWeight:'700',cursor:'pointer',fontFamily:'inherit',marginBottom:'32px'}}><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="13,2 4,14 12,14 11,22 20,10 13,10"/></svg>← Back</button>
        <h1 style={{fontSize:'40px',fontWeight:'800',marginBottom:'8px',color:fg}}>Privacy Policy</h1>
        <p style={{color:isDark?'#555':'#888',marginBottom:'40px'}}>Last updated: April 2026</p>
        {[
          {t:'Information We Collect',b:'We collect information you provide when using CodeLens AI, including code snippets submitted for analysis. We do not store your code permanently.'},
          {t:'How We Use Your Information',b:'Your information is used solely to provide the code analysis service. We do not sell or share your data with third parties.'},
          {t:'Cookies',b:'We use local storage to remember your theme preference. No tracking cookies are used.'},
          {t:'Data Security',b:'We implement reasonable security measures to protect your data. However, no method of transmission over the internet is 100% secure.'},
          {t:'Contact Us',b:'If you have questions about this Privacy Policy, please contact us through our website.'},
        ].map(s=>(
          <div key={s.t} style={{marginBottom:'32px',padding:'24px',background:card,borderRadius:'12px',border:`1px solid `}}>
            <h2 style={{fontSize:'18px',fontWeight:'700',marginBottom:'10px',color:'#e53935'}}>{s.t}</h2>
            <p style={{color:isDark?'#888':'#555',lineHeight:1.7}}>{s.b}</p>
          </div>
        ))}
      </div>
    </>
  )
}
