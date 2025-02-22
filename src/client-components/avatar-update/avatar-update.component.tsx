/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Image from 'next/image';
import "./avatar-update.styles.scss";
import { useSpace } from "@/src/app/space/[userId]/context";
import { getCookie } from "cookies-next";

const AvatarUpdate = () => {
    const data = useSpace();
    const [avatar, setAvatar] = useState({
        userAvatar: "/img/slience.jpg",
        imageSrc: "",
        fileBytes: new Uint8Array(),
    })

    // 更新字段的通用方法
    const handleChange = useCallback((key: keyof typeof avatar, value: string | Uint8Array) => {
        setAvatar(prevState => ({
            ...prevState,
            [key]: value,
        }));
    }, [setAvatar])

    // 将 Uint8Array 转为 Base64
    const uint8ArrayToBase64 = useCallback((uint8Array: Uint8Array) => {
        const binaryString = Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join('');
        return btoa(binaryString);
    }, []);

    const uploadAvatar = useCallback(async () => {
        const { userId } = data.space.user.userDefault;
        const url = "http://localhost:8080/api/user/avatar";
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
            console.log("no token in cookie");
            return;
        }

        const base64Avatar = uint8ArrayToBase64(avatar.fileBytes);
        const body = {
            userUpdateAvatar: {
                userId: userId,
                userAvatar: base64Avatar,
            },
            accessToken: {
                value: accessToken
            }
        };

        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),  // 将表单数据作为 JSON 发送
        });

        if (!response.ok) {
            console.log("error occur response are not ok");
            return;
        }
        console.log(await response.json())
    }, [data, avatar, uint8ArrayToBase64]);

    const changeHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // 创建临时 URL 以显示图片
            const imageUrl = URL.createObjectURL(file);
            handleChange("imageSrc", imageUrl);

            // 读取文件字节
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    const bytes: Uint8Array = new Uint8Array(reader.result as ArrayBuffer);
                    // 调用 handleChange，将字节数据传递给它
                    handleChange("fileBytes", bytes);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    }, [handleChange]);

    useEffect(() => {
        const { user } = data.space;
        const { userAvatar } = user;
        const avatar = userAvatar || "/img/slience.jpg";

        localStorage.setItem("avatar", avatar);

        setAvatar(prevState => ({
            ...prevState,
            userAvatar: avatar
        }))
    }, [data]);

    return (
        <>
            <div className="choose-file-box">
                <label className="choose-label">
                    更新
                    <input type="button" onClick={uploadAvatar} />
                </label>
                <label className="choose-label">
                    选择本地图片
                    <input type="file" onChange={changeHandler} name="userAvatar" style={{ position: "absolute", visibility: "hidden" }} />
                </label>
            </div>

            <div className="avatar-circle">
                {avatar.imageSrc ? (
                    <Image
                        src={avatar.imageSrc}
                        alt="Avatar"
                        fill
                        objectFit="cover"
                        objectPosition="center"
                        quality={100}
                    />
                ) : (
                    <Image
                        src={avatar.userAvatar}
                        alt="Default Avatar"
                        fill
                        style={{ objectFit: 'cover' }}
                        quality={100}
                    />
                )}
            </div>
        </>
    );
}

export default AvatarUpdate;