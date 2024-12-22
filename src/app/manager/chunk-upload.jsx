/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from "next/image";
import "./chunk-upload.scss"
import { useState, useCallback } from "react";

const ChunkUploadBox = () => {
    const [info, setInfo] = useState({
        file: null,
        progress: 40,
        title: "",
        description: "",
        category: void 0,// 存储分区
        imageSrc: null,  // 存储封面图片
        fileBytes: null,
    })

    // 更新字段的通用方法
    const handleChange = useCallback((key, value) => {
        setInfo(prevState => ({
            ...prevState,
            [key]: value,
        }));
    }, [setInfo])

    const handleCoverImageChange = useCallback((event) => {
        const file = event.target.files[0];
        if (file) {
            // 创建临时 URL 以显示图片
            const imageUrl = URL.createObjectURL(file);
            handleChange("imageSrc", imageUrl);

            // 读取文件字节
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    const bytes = new Uint8Array(reader.result);
                    // 调用 handleChange，将字节数据传递给它
                    handleChange("fileBytes", bytes);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    }, [handleChange]);

    const handleFileChange = async (event) => {
        if (!event.target.files) {
            console.log("event.target.files do not exists");
            return;
        }
        const file = event.target.files[0];
        handleChange("file", file);

        const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        // for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        //     const start = chunkIndex * CHUNK_SIZE;
        //     const end = Math.min(start + CHUNK_SIZE, file.size);
        //     const chunk = file.slice(start, end);

        //     const formData = new FormData();
        //     formData.append('chunk', chunk);
        //     formData.append('filename', file.name);
        //     formData.append('chunkIndex', `${chunkIndex}`);
        //     formData.append('totalChunks', `${totalChunks}`);

        //     try {
        //         await fetch('/api/upload', {
        //             method: 'POST',
        //             body: formData,
        //         });

        //         // Update progress
        //         setProgress(((chunkIndex + 1) / totalChunks) * 100);
        //     } catch (error) {
        //         console.log('Upload failed for chunk', chunkIndex, error);
        //         return;
        //     }
        // }

        // alert('File uploaded successfully!');
    };

    return (
        <>
            {/* <div className={`upload-video-box ${info.file && "hide"}`}>
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
            </div> */}
            {!info.file && (
                <div className="jichuxinxi">
                    {/* 进度条 */}
                    <div className="biaodan-option">
                        <div className="progress-bar">
                            <div
                                className="progress"
                                style={{ width: `${info.progress}%` }}
                            ></div>
                            <span>{`${info.progress}%`}</span>
                        </div>
                    </div>

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
                                {info.imageSrc && <Image
                                    src={info.imageSrc}
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

                    {/* 简介 */}
                    <div className="biaodan-option description">
                        <label className="biaodan-key">*简介:</label>
                        <div className="biaodan-value">
                            <textarea
                                value={info.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="请输入简介"
                                rows="4"
                            />
                        </div>
                    </div>

                    {/* 分区 */}
                    <div className="biaodan-option">
                        <label className="biaodan-key">*分区:</label>
                        <div className="biaodan-value">
                            <select
                                value={info.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                            >
                                <option value="">请选择分区</option>
                                <option value="knowledge">知识</option>
                                <option value="technology">科技</option>
                                <option value="food">美食</option>
                                <option value="movie_clips">电影片段</option>
                                <option value="animation_clips">动画片段</option>
                            </select>
                        </div>
                    </div>

                    {/* 按钮 */}
                    <div className="button-group">
                        <button type="submit" className="biaodan-button">存草稿</button>
                        <button type="submit" className="biaodan-button">提交</button>
                    </div>
                </div>
            )}
        </>
    );
};


export default ChunkUploadBox;