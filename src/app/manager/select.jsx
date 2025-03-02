'use client'

import React, { useState, useEffect, useRef } from "react";
import { Category } from './category'; // 导入 Category 数据

function CategoryMenu({ categoryId, handleChange }) {
    const menuRef = useRef(null); // 创建一个 ref 来引用菜单
    const buttonRef = useRef(null); // 创建一个 ref 来引用按钮
    const [showMenu, setShowMenu] = useState(false);
    const [selectedTopCategory, setSelectedTopCategory] = useState(Category[0]);
    const [selectedSubCategory, setSelectedSubCategory] = useState(
        Category[0].sub[0]
    );

    const handleTopCategoryClick = (category) => {
        setSelectedTopCategory(category);
        setSelectedSubCategory(category.sub[0]); // 默认选中第一个二级分区
    };

    const handleSubCategoryClick = (subCategory) => {
        setSelectedSubCategory(subCategory);
    };

    useEffect(() => {
        handleChange("category", selectedSubCategory.id)
    }, [handleChange, selectedSubCategory.id])

    // 点击外部关闭菜单的逻辑
    useEffect(() => {
        // 点击文档时判断点击位置
        const handleClickOutside = (event) => {
            // 如果点击的是菜单按钮或菜单内容之外的地方，关闭菜单
            if (menuRef.current && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        // 监听点击事件
        document.addEventListener('click', handleClickOutside);

        // 清理事件监听
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const topCategory = Category.find(top =>
            top.sub.some(second => second.id == categoryId)
        );
        const subCategory = topCategory?.sub.find(second => second.id == categoryId);

        if (topCategory && subCategory) {
            setSelectedTopCategory(topCategory);
            setSelectedSubCategory(subCategory);
        }

    }, [categoryId])

    return (
        <div style={{ position: "relative" }}>
            {/* 菜单触发器 */}
            <button ref={buttonRef} onClick={() => setShowMenu(!showMenu)}
                style={{
                    border: '1px solid rgb(111,111,111)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                    fontSize: '16px',
                    display: 'flex',
                    height: '40px',
                    width: '400px',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                {selectedTopCategory.name} - {selectedSubCategory.name}
            </button>

            {/* 菜单内容 */}
            {showMenu && (
                <div ref={menuRef}
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "600px",
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr", // 设置为两列布局
                        gap: "10px",
                        padding: "10px",
                        zIndex: 1000,
                        height: "300px", // 限制整体高度
                    }}
                >
                    {/* 一级分区 */}
                    <div className="custom-scroll"
                        style={{
                            padding: "10px",
                            overflowY: "auto",
                        }}
                    >
                        {Category.map((category) => (
                            <div
                                key={category.id}
                                onClick={() => handleTopCategoryClick(category)}
                                style={{
                                    fontSize: '20px',
                                    padding: "8px",
                                    cursor: "pointer",
                                    background:
                                        selectedTopCategory.id === category.id ? "#f0f0f0" : "",
                                    fontWeight:
                                        selectedTopCategory.id === category.id ? "bold" : "normal",
                                }}
                            >
                                {category.name}
                            </div>
                        ))}
                    </div>

                    {/* 二级分区 */}
                    <div className="custom-scroll"
                        style={{
                            padding: "10px",
                            overflowY: "auto",
                        }}
                    >
                        {selectedTopCategory.sub.map((subCategory) => (
                            <div
                                key={subCategory.id}
                                onClick={() => handleSubCategoryClick(subCategory)}
                                style={{
                                    padding: "8px",
                                    cursor: "pointer",
                                    background:
                                        selectedSubCategory.id === subCategory.id
                                            ? "#f0f0f0"
                                            : "",
                                    fontWeight:
                                        selectedSubCategory.id === subCategory.id ? "bold" : "normal",
                                }}
                            >
                                <p>{subCategory.name}</p>
                                <p style={{ fontSize: "12px", color: "#888" }}>
                                    {subCategory.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <style jsx>{`
  .custom-scroll::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scroll::-webkit-scrollbar-track {
    background: transparent; /* 去掉轨道背景 */
  }
  .custom-scroll::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }
  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
  .custom-scroll::-webkit-scrollbar-button {
    display: none; /* 去掉上下箭头 */
  }
`}</style>
        </div>

    );
}

export default CategoryMenu;
