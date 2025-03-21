'use client'

import { useCallback, useEffect, useState } from "react";
import { useSpace } from "./context";

import VideoList from "@/src/client-components/video-slight-list/VideoList"
import { ByCount, fetchCreationInfo } from "@/src/tool/space"

import "./page.scss";

export default function Page() {
    const [spaceCreations, setSpaceCreations] = useState({
        type: ByCount.PUBLISHED_TIME,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [creationInfoGroup, setCreationInfoGroup] = useState({
        count: 0,
        creations: [],
    })

    // user
    const { space } = useSpace()
    const { user } = space
    const { userGender, userBday, userDefault, userUpdatedAt } = user
    const { userId } = userDefault
    const genderText = userGender === "MALE" ? "男" : userGender === "FEMALE" ? "女" : "未设置";

    const handlerField = useCallback((key, value) => setSpaceCreations((prev) => ({
        ...prev,
        [key]: value
    })), [])

    useEffect(() => {
        const type = spaceCreations.type

        const exeCute = async () => {
            const result = await fetchCreationInfo(userId, 1, type)
            if (!result) return
            const creationInfos = result.creationInfoGroup
            const count = { result }
            let videos = creationInfos.map((info) => {
                const { creation, creationEngagement } = info
                const { baseInfo } = creation
                return ({
                    ...baseInfo,
                    ...creationEngagement,
                })
            }, [])
            videos = videos.slice(0, 12)

            setCreationInfoGroup(() => ({
                count: count,
                creations: videos
            }))
        }
        exeCute()
    }, [userId, spaceCreations.type])

    return (
        <div className="person-page">
            <div className="creations-block">
                <div className="title-box">
                    <h2 className="title">视频</h2>
                    <button className="type" onClick={() => handlerField("type", ByCount.PUBLISHED_TIME)}>最新发布</button>
                    <button className="type" onClick={() => handlerField("type", ByCount.VIEWS)}>最多播放</button>
                    <button className="type" onClick={() => handlerField("type", ByCount.COLLECTIONS)}>最多收藏</button>
                </div>
                <div className="creation-list">
                    <VideoList videos={creationInfoGroup.creations} />
                </div>
            </div>
            <div className="person-information">
                <h3>个人资料</h3>
                <div className="uid"><strong>UID:</strong> {userId}</div>
                {userBday && <div className="bday"><strong>生日:</strong> {(new Date(userBday)).toISOString().split("T")[0]}</div>}
                <div className="gender"><strong>性别:</strong> {genderText}</div>
                {userUpdatedAt && <div className="updatedAt"><strong>更新时间:</strong> {(new Date(userUpdatedAt)).toISOString().split("T")[0]}</div>}
            </div>
        </div>
    );
}