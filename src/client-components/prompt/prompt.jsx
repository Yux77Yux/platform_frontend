'use client'

import React from "react";
import ReactDOM from "react-dom";

import { useEffect } from "react";
import "./prompt.scss"

const Prompt = ({ children, setOpen }) => {
    useEffect(() => {
        setTimeout(() => setOpen(false), 1500)
    }, [setOpen])

    return ReactDOM.createPortal(
        <div className="prompt">
            {children}
        </div>,
        document.body
    );
}

export default Prompt;