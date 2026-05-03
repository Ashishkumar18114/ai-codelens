"use client";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function AuthStatus() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!session) return null;

  const initial = session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase();

  return (
    <div ref={ref} style={{ position: 'fixed', top: 14, right: 16, zIndex: 9999 }}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 38, height: 38, borderRadius: '50%',
          background: '#ef4444', border: '2px solid #ff6b6b',
          color: 'white', fontWeight: 700, fontSize: 15,
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 2px 12px rgba(239,68,68,0.4)'
        }}
      >
        {initial}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 46, right: 0,
          background: '#111118', border: '1px solid #2a2a3a',
          borderRadius: 12, padding: '4px',
          minWidth: 220, boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
        }}>
          {/* Profile Info */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #2a2a3a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#ef4444', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0
              }}>
                {initial}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>
                  {session.user?.name || 'User'}
                </div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                  {session.user?.email}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div style={{ padding: '4px' }}>
            <button style={{
              width: '100%', textAlign: 'left', padding: '9px 12px',
              background: 'none', border: 'none', color: '#d1d5db',
              fontSize: 13, cursor: 'pointer', borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 8
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#1a1a24')}
            onMouseOut={e => (e.currentTarget.style.background = 'none')}
            >
              👤 Profile
            </button>
            <button style={{
              width: '100%', textAlign: 'left', padding: '9px 12px',
              background: 'none', border: 'none', color: '#d1d5db',
              fontSize: 13, cursor: 'pointer', borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 8
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#1a1a24')}
            onMouseOut={e => (e.currentTarget.style.background = 'none')}
            >
              ⚙️ Settings
            </button>
            <div style={{ height: 1, background: '#2a2a3a', margin: '4px 0' }} />
            <button
              onClick={() => signOut({ callbackUrl: '/signin' })}
              style={{
                width: '100%', textAlign: 'left', padding: '9px 12px',
                background: 'none', border: 'none', color: '#ef4444',
                fontSize: 13, cursor: 'pointer', borderRadius: 8,
                display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#1a0a0a')}
              onMouseOut={e => (e.currentTarget.style.background = 'none')}
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}