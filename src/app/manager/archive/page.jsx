'use client'

import { useEffect, useState } from 'react'
import Archive from './Archive'
import {
    getArchivesExist,
} from "@/src/tool/archive"
import "./page.scss"

const Page = () => {
    const [info, setInfo] = useState({
        choose: 0,

        // left为初始存档，即历史记录
        left: 0,
        leftCover: void 0,
        leftBytes: void 0,
        leftExist: true,

        middle: 1,
        middleArchive: void 0,
        middleCover: void 0,
        middleBytes: void 0,
        middleAble: false,
        middleExist: false,

        right: 2,
        rightArchive: void 0,
        rightCover: void 0,
        rightBytes: void 0,
        rightAble: false,
        rightExist: false,
    });

    const fileHandler = (key, event) => {
        const file = event.target.files[0];
        if (file) {
            // 创建临时 URL 以显示图片
            const imageUrl = URL.createObjectURL(file);
            setInfo((prev) => ({ ...prev, [`${key}Cover`]: imageUrl }));

            // 读取文件字节
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    const bytes = new Uint8Array(reader.result);
                    // 调用 handleChange，将字节数据传递给它
                    setInfo((prev) => ({ ...prev, [`${key}Bytes`]: bytes }));
                }
            };
            reader.readAsArrayBuffer(file);
        }
    }

    useEffect(() => {
        (async () => {
            const result = await getArchivesExist()
            console.log(result)
            setInfo((prev) => ({
                ...prev,
                choose: parseInt(result.order),
                middleExist: result.exist[1],
                rightExist: result.exist[2],
            }))
        })()
    }, [])

    const props = {
        info: info,
        handleField: setInfo,
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