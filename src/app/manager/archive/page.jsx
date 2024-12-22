'use client'

import { useState } from 'react'
import Archive from './Archive'
import "./page.scss"

const Page = () => {
    const [info, setInfo] = useState({
        choose: "left",

        left: null,
        leftCover: void 0,
        leftBytes: void 0,
        leftName: '存档一',
        leftAble: false,

        middle: null,
        middleCover: void 0,
        middleBytes: void 0,
        middleAble: false,
        middleName: '存档二',

        right: null,
        rightCover: void 0,
        rightBytes: void 0,
        rightAble: false,
        rightName: '存档三',
    });

    const handleField = (key, value) => {
        setInfo((prev) => ({
            ...prev,
            [key]: value
        }))
    };

    const fileHandler = (key, event) => {
        const file = event.target.files[0];
        if (file) {
            // 创建临时 URL 以显示图片
            const imageUrl = URL.createObjectURL(file);
            handleField(`${key}Cover`, imageUrl);

            // 读取文件字节
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    const bytes = new Uint8Array(reader.result);
                    // 调用 handleChange，将字节数据传递给它
                    handleField(`${key}Bytes`, bytes);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    }

    const props = {
        info: info,
        handleField: handleField,
        fileHandler: fileHandler,
    }

    return (
        <div className="archive-page">
            <Archive {...props} selected="left" />
            <Archive {...props} selected="middle" />
            <Archive {...props} selected="right" />
        </div >
    );
}

export default Page;