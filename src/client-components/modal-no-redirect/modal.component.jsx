'use client';

import React from "react";
import ReactDOM from "react-dom";
import "./modal.scss"

export default function Modal({ children, setOpen }) {
  return ReactDOM.createPortal(
    <div style={{
      display: 'flex',
      position: 'fixed',
      top: '0',
      left: '0',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      zIndex: 998,
      backgroundColor: 'rgba(23,24,25,0.5)',
    }}>
      <div style={{
        position: 'relative'
      }}>
        <button onClick={() => setOpen(false)}
          className="modal-close-btn"
        >
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}