'use client';

import { createPortal } from 'react-dom';
import "./modal.styles.scss";

import { useRouter } from 'next/navigation'

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    createPortal(
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}>
        <div style={{
          position:'relative'
        }}>
          <button onClick={() => router.back()}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              backgroundColor: 'transparent',
              right: '20px',
              fontSize: '50px',
              cursor: 'pointer',
            }}
          >
            &#215;
          </button>
          {children}
        </div>
      </div>,
      document.getElementById('modal-root')!)
  )
}