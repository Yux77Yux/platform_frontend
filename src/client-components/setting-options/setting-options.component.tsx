'use client';

import { useCallback, useEffect, useState } from "react";
import "./setting-options.styles.scss";
import { useSpace } from "@/src/app/space/[userId]/context";
import { getCookie } from "cookies-next/client";
import { usePathname, useRouter } from "next/navigation";

const SettingOptions = () => {
    const router = useRouter();
    const path = usePathname();
    const data = useSpace();
    const genderOptions = [
        { label: "未定义", value: "UNDEFINED" },
        { label: "男", value: "MALE" },
        { label: "女", value: "FEMALE" },
    ];

    const [userInfo, setUserInfo] = useState({
        userId: '',
        userName: '',
        userBio: '',
        userGender: '',
        userBday: '', // 初始值为 null
        master: false,
    });

    const updateUser = useCallback(async () => {
        const { userId,
            userName,
            userBio,
            userGender,
            userBday,
        } = userInfo;

        const url = "http://localhost:8080/api/user/space";
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
            console.log("no token in cookie");
            return;
        }
        const body = {
            userUpdateSpace: {
                userDefault: {
                    userId: userId,
                    userName: userName,
                },
                userBio: userBio,
                userGender: userGender,
                userBday: userBday === "" ? void 0 : new Date(userBday).toISOString(),
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

        window.location.reload();
    }, [userInfo]);

    // 更新字段的通用方法
    const handleChange = useCallback((key: keyof typeof userInfo, value: string | Date | null) => {
        setUserInfo(prevState => ({
            ...prevState,
            [key]: value,
        }));
    }, [setUserInfo])

    useEffect(() => {
        const { master } = data.space;
        const { user } = data.space;
        const { userBio, userDefault, userGender, userBday } = user;
        const { userId, userName } = userDefault;

        setUserInfo(prevState => ({
            ...prevState,
            userId: userId,
            userName: userName,
            userBio: userBio,
            userGender: userGender,
            userBday: !userBday ? null : userBday.split("T")[0],
            master: master,
        }));

        if (!master) {
            const match = path.match(/space\/(\d+)/);
            if (match) {
                router.replace(`/space/${match[1]}`)
            }
        }
    }, [data, path, router]);

    if (!userInfo.master) {
        return null;
    }

    return (
        <>
            <div className="setting-options">
                <div className="setting-option ">
                    <span className="option-key">昵称：</span>
                    <span className="option-value">
                        <input type="text" name="userName" value={userInfo.userName} onChange={e => { handleChange("userName", e.target.value) }} />
                    </span>
                </div>
                <div className="setting-option ">
                    <span className="option-key">我的签名：</span>
                    <span className="option-value">
                        <textarea name="userBio" placeholder={userInfo.userBio} value={userInfo.userBio} onChange={e => { handleChange("userBio", e.target.value) }} />
                    </span>
                </div>
                <div className="setting-option">
                    <span className="option-key">性别：</span>
                    <span className="option-value">
                        <div className="gender-options">
                            {genderOptions.map(option => (
                                <label key={option.value}
                                    className={
                                        userInfo.userGender === option.value
                                            ? "gender-option-active"
                                            : "gender-option"
                                    }
                                >
                                    {option.label}
                                    <input
                                        type="radio"
                                        name="userGender"
                                        onChange={e => handleChange("userGender", e.target.value)}
                                        checked={userInfo.userGender === option.value}
                                        value={option.value}
                                    />
                                </label>
                            ))}
                        </div>
                    </span>
                </div>
                <div className="setting-option">
                    <span className="option-key">生日：</span>
                    <span className="option-value">
                        <input type="date" name="userBday" value={userInfo.userBday || ""} onChange={e => handleChange("userBday", e.target.value)} />
                    </span>
                </div>
            </div >
            <button type="button" className="submit" onClick={updateUser}>保存</button>
        </>
    );
}

export default SettingOptions;