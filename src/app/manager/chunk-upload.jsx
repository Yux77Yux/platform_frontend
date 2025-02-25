'use client';

import Image from "next/image";
import "./chunk-upload.scss"
import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from 'next/navigation';
import CategorySelect from './select';

import { client } from './oss';
import { getCookie } from "cookies-next";

const ChunkUploadBox = () => {
    const searchParams = useSearchParams()
    const id = searchParams.get('id') || null;

    const ref = useRef({
        draft: null,
        publish: null,
    });
    const [info, setInfo] = useState({
        file: null,
        uploading: false,
        progress: 0,
        imageBlob: null,  // 封面图片的显示
        coverUpload: false, //前端上传图片进行时 判断

        // 提交后端字段
        fileSrc: null,   // 视频的src
        title: '',    // 作品的标题
        bio: '',// 作品的描述
        category: void 0,// 存储分区
        imageSrc: null,   // 前端上传返回的地址
        duration: 0,
        submit: '',
    })

    // 更新字段的通用方法
    const handleChange = useCallback((key, value) => {
        setInfo(prevState => ({
            ...prevState,
            [key]: value,
        }));
    }, [])

    const getMimeType = useCallback((fileName) => {
        const ext = fileName.split('.').pop().toLowerCase(); // 获取文件扩展名
        const mimeTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'bmp': 'image/bmp',
            'webp': 'image/webp',
            'tiff': 'image/tiff',
            'svg': 'image/svg+xml'
        };
        return mimeTypes[ext] || 'application/octet-stream'; // 默认二进制流
    }, [])

    // 上传封面至oss
    const handleCoverImageChange = useCallback(async (event) => {
        const file = event.target.files[0];
        if (file) {
            // 创建临时 URL 以显示图片
            const imageBlob = URL.createObjectURL(file);
            handleChange("imageBlob", imageBlob);

            // 读取文件字节
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);

            // 上传至oss
            try {
                // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
                // 您可以通过自定义文件名（例如exampleobject.txt）或文件完整路径（例如exampledir/exampleobject.txt）的形式实现将数据上传到当前Bucket或Bucket中的指定目录。
                // data对象可以自定义为file对象、Blob数据或者OSS Buffer。
                const mimeType = getMimeType(file.name);
                const options = {
                    meta: { temp: "demo" },       // 可选，元数据
                    mime: mimeType,               // 动态设置 MIME 类型
                    headers: { "Content-Type": mimeType },
                };
                const result = await client.put("cover/" + file.name, file, options);
                let imageSrc = result.res.requestUrls[0];
                // 将 http 改为 https
                imageSrc = imageSrc.replace('http://', 'https://');
                handleChange("imageSrc", imageSrc)
            } catch (e) {
                console.log(e);
            }
        }
    }, [handleChange, getMimeType]);

    // 前后端交互
    const uploadCreation = useCallback(async () => {
        const accessToken = getCookie('accessToken');
        if (!accessToken) {
            alert("未登录")
            return;
        }

        const status = info.submit === "PENDING" ? 1 : 0;

        const body = {
            baseInfo: {
                src: info.fileSrc,
                thumbnail: info.imageSrc,
                title: info.title,
                bio: info.bio,
                status: status,
                duration: Math.round(info.duration),
                categoryId: info.category,
            },
            accessToken: {
                value: accessToken,
            }
        }
        try {
            const response = await fetch('http://localhost:8080/api/creation', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),  // 将表单数据作为 JSON 发送
            });

            if (response.ok) {
                const result = await response.json();  // 解析 JSON 响应
                console.log(result);
            }
        } catch (error) {
            console.log(error)
        }
    }, [info.bio, info.category, info.duration, info.fileSrc, info.imageSrc, info.submit, info.title])
    const updateCreation = useCallback(async () => {
        const accessToken = getCookie('accessToken');
        if (!accessToken) {
            alert("未登录")
            return;
        }

        const status = info.submit === "PENDING" ? 1 : 0;

        const body = {
            baseInfo: {
                src: info.fileSrc,
                thumbnail: info.imageSrc,
                title: info.title,
                bio: info.bio,
                status: status,
                duration: Math.round(info.duration),
            },
            accessToken: {
                value: accessToken,
            }
        }
        try {
            const response = await fetch('http://localhost:8080/api/creation', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),  // 将表单数据作为 JSON 发送
            });

            if (response.ok) {
                const result = await response.json();  // 解析 JSON 响应
                console.log(result);
            }
        } catch (error) {
            console.log(error)
        }
    }, [info.bio, info.duration, info.fileSrc, info.imageSrc, info.submit, info.title])

    // 上传视频文件至oss
    const handleFileChange = async (event) => {
        if (!event.target.files) {
            console.log("event.target.files do not exists");
            return;
        }
        const file = event.target.files[0];
        handleChange("file", file);
        // 创建一个 video 元素来获取视频时长
        const videoElement = document.createElement('video');
        const objectURL = URL.createObjectURL(file);

        videoElement.src = objectURL;

        // 等待 metadata 加载完成
        videoElement.onloadedmetadata = () => {
            const videoDuration = videoElement.duration; // 获取时长
            handleChange("duration", videoDuration);
            URL.revokeObjectURL(objectURL); // 释放创建的 URL
        };
        handleChange("uploading", true);

        const options = {
            // 获取分片上传进度、断点和返回值。
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            progress: (p) => {
                handleChange("progress", (p * 100).toFixed(1));
            },
            // 设置并发上传的分片数量。
            parallel: 8,
            // 设置分片大小。根据视频文件的大小和网络环境调整，10 MB 是一个常用的值。
            partSize: 1024 * 1024,
            // 自定义元数据，通过 HeadObject 接口可以获取 Object 的元数据。
            meta: {
                year: 2024,
                contentType: "video/mp4",
                description: "Sample MP4 Video"
            },
            // MIME 类型设置为 MP4 文件的类型
            mime: "video/mp4",
        };
        try {
            // 分片上传。
            const result = await client.multipartUpload("video/" + file.name, file, {
                ...options,
            });

            // 视频src地址
            let srcUrl = result.res.requestUrls[0]
            // 去掉 .mp4 之后的部分
            srcUrl = srcUrl.split('.mp4')[0] + '.mp4'; // 保留.mp4
            // 将 http 改为 https
            srcUrl = srcUrl.replace('http://', 'https://');
            handleChange("fileSrc", srcUrl);
            handleChange("uploading", false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        // 当上传中时，监听页面离开事件
        const handleBeforeUnload = (event) => {
            if (info.file) {
                const message = '正在上传文件，你确定终止并离开吗？';
                event.returnValue = message; // 标准浏览器
                return message; // 旧版浏览器
            }
        };
        // 绑定事件
        window.addEventListener('beforeunload', handleBeforeUnload);
        // 清理事件监听器
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [info.file]); // 上传文件存在则添加事件

    useEffect(() => {
        if (!ref) return;
        const [title, imageSrc, category] = [info.title, info.imageSrc, info.category];
        if (title === '' || !imageSrc || !category) {
            if (!ref.current.draft || !ref.current.publish) return;
            ref.current.draft.classList.add('disable')
            ref.current.publish.classList.add('disable')
        } else {
            ref.current.draft.classList.remove('disable')
            ref.current.publish.classList.remove('disable')
        }
    }, [info.title, info.imageSrc, info.category])

    useEffect(() => {
        const [submit, fileSrc, uploading] = [info.submit, info.fileSrc, info.uploading];
        // 未提交，视频源地址为空，正在上传则立即返回
        if (!submit || !fileSrc || uploading) return;
        // 上传事件
        console.log("it's creating creation!")

        const handleSubmit = async () => {
            if (id) {
                await updateCreation()
            } else {
                await uploadCreation()
            }
        };
        handleSubmit()
        console.log("success")
    }, [id, info.submit, info.fileSrc, info.uploading, uploadCreation, updateCreation])

    return (
        <>
            {(info.file || id) && <div className="upload-video-box">
                <label style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: '100%',
                    width: '100%',
                    cursor: "pointer",
                    backgroundColor: "rgb(111,111,111)",
                    flexDirection: 'column',
                }}>
                    <span style={{
                        fontSize: "20px",
                        letterSpacing: "10px",
                    }}>点击上传</span>
                    <input

                        type="file"
                        name="video"
                        style={{
                            position: "absolute",
                            visibility: "hidden",
                        }}
                        onChange={handleFileChange}
                    />
                </label>
            </div>}
            {(info.file || id) && <div className="jichuxinxi">
                {/* 进度条 */}
                {info.file && <div className="biaodan-option">
                    <div className="progress-bar">
                        <div className="progress"
                            style={{ width: `${info.progress}%`, }}
                        ></div>
                        <span>{`${info.progress}%`}</span>
                    </div>
                </div>}

                {/* 封面上传 */}
                <div className="biaodan-option">
                    <label className="biaodan-key">*封面:</label>
                    <div className="biaodan-value info-circle">
                        <label style={{
                            height: '160px',
                            width: '160px',
                            position: 'relative',
                            border: '1px solid rgb(50, 51, 50)',
                            backgroundImage: 'url(/plus.svg)',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '30px',
                        }}>
                            {info.imageBlob && <Image
                                src={info.imageBlob}
                                alt="info"
                                fill
                                style={{ objectFit: 'cover' }}
                                quality={100}
                            />}
                            <input type="file" style={{ position: 'absolute', visibility: 'hidden', opacity: 0, }} onChange={handleCoverImageChange} />
                        </label>
                    </div>
                </div>

                {/* 标题 */}
                <div className="biaodan-option">
                    <label className="biaodan-key">*标题:</label>
                    <div className="biaodan-value">
                        <input
                            type="text"
                            value={info.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            maxLength="80"
                        />
                        <p>{info.title.length}/80</p>
                    </div>
                </div>

                {/* 分区 */}
                {id && <div className="biaodan-option">
                    <label className="biaodan-key">*分区:</label>
                    <div className="biaodan-value">
                        <CategorySelect handleChange={handleChange} />
                    </div>
                </div>}

                {/* 简介 */}
                <div className="biaodan-option">
                    <label className="biaodan-key">简介:</label>
                    <div className="biaodan-value">
                        <textarea
                            value={info.bio}
                            onChange={(e) => handleChange('bio', e.target.value)}
                            placeholder="请输入简介"
                            rows="4"
                        />
                    </div>
                </div>

                {/* 按钮 */}
                <div className="button-group">
                    {!id
                        ? <>
                            <button type="submit" ref={(el) => (ref.current.draft = el)} className="biaodan-button"
                                onClick={() => handleChange("submit", "DRAFT")}>存草稿</button>

                            <button type="submit" ref={(el) => (ref.current.publish = el)}
                                className="biaodan-button"
                                onClick={() => handleChange("submit", "PENDING")}>发布</button>
                        </>
                        : <button type="submit" ref={(el) => (ref.current.draft = el)} className="biaodan-button"
                            onClick={() => handleChange("submit", "PENDING")}>更新</button>}
                </div>
            </div>}
        </>
    );
};


export default ChunkUploadBox;