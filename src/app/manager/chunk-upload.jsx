'use client';

import Image from "next/image";
import "./chunk-upload.scss"
import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import CategorySelect from '@/src/client-components/select/select';

import TextPrompt from "@/src/client-components/prompt/TextPrompt"

import { client } from './oss';
import { getCookie } from "cookies-next";
import { Api_Status } from "@/src/tool/api-status";
import { getToken } from "@/src/tool/getLoginUser";
import { Creation_Status } from "@/src/tool/creation";

const ChunkUploadBox = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get('id') || false;

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
        status: '',
    })

    const [textPrompt, setTextPrompt] = useState({
        isOpen: false,
        text: ""
    })
    const setTextPromptOpen = (open) => setTextPrompt((prev) => ({ ...prev, isOpen: open }))

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
            setInfo((prev) => ({ ...prev, imageBlob: imageBlob, imageSrc: null }));

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

    // id存在时使用的函数
    const fetchCreation = useCallback(async (body) => {
        try {
            const response = await fetch("http://localhost:8080/api/creation/private", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(body)
            })
            if (!response.ok) {
                alert("网络不通")
                return false
            }
            const result = await response.json()
            const { status } = result.msg
            if (status != Api_Status.SUCCESS) {
                console.log(result)
                return false
            }
            return result
        } catch (error) {
            alert(error)
            return false
        }
    }, [])

    // 前后端交互
    const uploadCreation = useCallback(async () => {
        const accessToken = getCookie('accessToken');
        if (!accessToken) {
            alert("未登录")
            return;
        }

        const status = info.submit === Creation_Status.PENDING ? 1 : 0;

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

            if (!response.ok) {
                console.log(result);
                return false
            }
            const result = await response.json();  // 解析 JSON 响应
            console.log(result)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }, [info.bio, info.category, info.duration, info.fileSrc, info.imageSrc, info.submit, info.title])
    const updateCreation = useCallback(async () => {
        const accessToken = getCookie('accessToken');
        if (!accessToken) {
            alert("未登录")
            return;
        }

        let status = info.submit === Creation_Status.PENDING
            ? Creation_Status.PENDING : info.status;
        if (info.status == Creation_Status.PENDING) {
            // 已经被审核了，就不需要再审核
            status = Creation_Status.PUBLISHED
        }

        const body = {
            updateInfo: {
                creationId: id,
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
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),  // 将表单数据作为 JSON 发送
            });

            if (!response.ok) {
                console.log(result);
                return false
            }
            const result = await response.json();  // 解析 JSON 响应
            console.log(result)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }, [id, info.bio, info.duration, info.fileSrc, info.imageSrc, info.submit, info.title, info.status])

    // 上传视频文件至oss
    const handleFileChange = async (event) => {
        if (!event.target.files) {
            console.log("event.target.files do not exists");
            return;
        }
        const file = event.target.files[0];
        setInfo((prev) => ({
            ...prev,
            fileSrc: null,
            file: file,
            progress: 0,
        }))
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
        const [title, fileSrc, imageSrc, category] = [info.title, info.fileSrc, info.imageSrc, info.category];
        if (title == "" || !fileSrc || !imageSrc || !category) {
            if (ref.current.draft) {
                ref.current.draft.classList.add('disable')
            }
            if (ref.current.publish) {
                ref.current.publish.classList.add('disable')
            }
        } else {
            if (ref.current.draft) {
                ref.current.draft.classList.remove('disable')
            }
            if (ref.current.publish) {
                ref.current.publish.classList.remove('disable')
            }
        }
    }, [info.title, info.fileSrc, info.imageSrc, info.category])

    useEffect(() => {
        const [submit, fileSrc, uploading] = [info.submit, info.fileSrc, info.uploading];
        // 未提交，视频源地址为空，正在上传则立即返回
        if (!submit || !fileSrc || uploading) return;

        (async () => {
            let result
            if (id) {
                result = await updateCreation()
            } else {
                result = await uploadCreation()
            }
            if (result) {
                let text = "可至草稿箱查看"
                if (ref.current.publish) {
                    text = "成功"
                }
                setTextPrompt({ isOpen: true, text: text })
                setTimeout(() => router.replace("/manager/creations"), 2000);
            }
        })();
    }, [router, id, info.submit, info.fileSrc, info.uploading, uploadCreation, updateCreation])

    useEffect(() => {
        if (!id) return;
        (async () => {
            const token = await getToken()
            const body = {
                accessToken: {
                    value: token
                },
                creationId: id,
            };
            const result = await fetchCreation(body)
            if (!result) {
                setTextPrompt({
                    isOpen: true,
                    text: "未通过验证",
                })
                setTimeout(() => router.replace("/"), 1500)
                return;
            }
            console.log(result)
            const { bio, categoryId, status, src, thumbnail, title, duration } = result.creationInfo.creation.baseInfo
            setInfo((prev) => ({
                ...prev,
                fileSrc: src,
                title: title,
                bio: bio,
                category: categoryId,
                imageSrc: thumbnail,
                duration: duration,
                progress: 100,
                status: status,
            }))
        })()
    }, [id, router, fetchCreation])

    return (
        <>
            {textPrompt.isOpen && <TextPrompt text={textPrompt.text} setOpen={setTextPromptOpen} />}
            {!id && !info.file && <div className="upload-video-box">
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
                {info.progress == 100 && <label style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '8px 12px',
                    backgroundColor: 'rgb(222,222,222)',
                    cursor: 'pointer',
                    borderRadius: '6px',
                }}>
                    <span style={{
                        fontSize: "14px",
                        letterSpacing: "2px",
                    }}>更换视频</span>
                    <input type="file"
                        name="video"
                        style={{
                            position: "absolute",
                            visibility: "hidden",
                        }}
                        onChange={handleFileChange}
                    />
                </label>}

                {/* 进度条 */}
                {(info.file || id) && <div className="biaodan-option">
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
                            {info && (info.imageBlob || info.imageSrc) && (
                                <Image
                                    src={info.imageBlob || info.imageSrc}
                                    alt="info"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    quality={100}
                                />
                            )}
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
                        <p style={{ position: 'relative', marginLeft: '16px' }}>{info.title.length}/80</p>
                    </div>
                </div>

                {/* 分区 */}
                <div className="biaodan-option">
                    <label className="biaodan-key">*分区:</label>
                    <div className="biaodan-value" style={{
                        pointerEvents: id ? 'none' : 'auto',
                        opacity: id ? 0.5 : 1, // 显示禁用效果
                    }}>
                        <CategorySelect categoryId={info.category} handleChange={handleChange} />
                    </div>
                </div>

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
                            <button type="submit" ref={(el) => (ref.current.draft = el)}
                                className="biaodan-button"
                                onClick={() => handleChange("submit", "DRAFT")}>存草稿</button>

                            <button type="submit" ref={(el) => (ref.current.publish = el)}
                                className="biaodan-button"
                                onClick={() => handleChange("submit", "PENDING")}>发布</button>
                        </>
                        : <>
                            <button type="submit" ref={(el) => {
                                if (info.status == 'DRAFT') {
                                    return ref.current.draft = el
                                }
                                return ref.current.publish = el
                            }}
                                className="biaodan-button"
                                onClick={() => handleChange("submit", info.status == 'DRAFT' ? 'DRAFT' : 'PENDING')}>更新</button>
                            {info.status == 'DRAFT' && <button type="submit" ref={(el) => (ref.current.publish = el)}
                                className="biaodan-button"
                                onClick={() => handleChange("submit", "PENDING")}>发布</button>}
                            <button className="biaodan-button"
                                onClick={() => router.back()}>取消</button>
                        </>
                    }
                </div>
            </div>}
        </>
    );
};


export default ChunkUploadBox;