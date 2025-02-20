'use client';

import "./modal.styles.scss";

import { useRouter } from 'next/navigation'

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <div style={{
      display: 'flex',
      position: 'fixed',
      top: '0',
      left: '0',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: 'rgba(23,24,25,0.5)',
    }}>
      <div style={{
        position: 'relative'
      }}>
        <div style={{
          position: 'relative'
        }}>
          <button onClick={() => router.back()}
            className="modal-close-btn"
          ></button>
          {children}
        </div>
      </div>
    </div>
  )
}