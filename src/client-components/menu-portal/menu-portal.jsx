'use client';

import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";

// 菜单 Portal 组件
const MenuPortal = ({ children, targetRef }) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });

    // 计算并更新菜单位置
    const updatePosition = useCallback(() => {
        if (targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY, // 考虑页面滚动
                left: rect.left + window.scrollX ,
            });
        }
    }, [targetRef])

    // 在布局变更后更新位置
    React.useLayoutEffect(() => {
        updatePosition();
        window.addEventListener("resize", updatePosition);
        return () => window.removeEventListener("resize", updatePosition);
    }, [updatePosition]);

    return ReactDOM.createPortal(
        <div
            style={{
                position: "absolute",
                top: position.top,
                left: position.left,
                zIndex: 1000,
            }}
        >
            {children}
        </div>,
        document.body
    );
};

export default MenuPortal;