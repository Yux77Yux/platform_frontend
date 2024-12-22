
import React, { useEffect } from 'react';
 
const BeforeUnload = () => {
  useEffect(() => {
    const showWarning = (event) => {
      // 设置提示信息
      event.preventDefault();
      event.returnValue = '你确定要离开吗？';
    };
 
    // 监听beforeunload事件
    window.addEventListener('beforeunload', showWarning);
 
    // 组件卸载时移除事件监听
    return () => window.removeEventListener('beforeunload', showWarning);
  }, []);
 
  return null;
};
 
export default BeforeUnload;