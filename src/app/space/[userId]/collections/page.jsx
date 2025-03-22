'use client'

import { useEffect, useState } from "react";
import { useSpace } from "../context";

import VideoList from "@/src/client-components/video-slight-list/interaction-videoList"
import { fetchCollections } from "@/src/tool/get"
import "./page.scss";

export default function Page() {
    const [creationInfoGroup, setCreationInfoGroup] = useState({
        count: 0,
        creations: [],
    })

    const { space } = useSpace()
    const { user, master } = space

    // user
    const { userDefault } = user
    const { userId } = userDefault

    useEffect(() => {
        const exeCute = async () => {
            const result = await fetchCollections(1)
            if (!result) return
            const { cards } = result
            let videos = cards.map((info) => {
                const { creation, creationEngagement, timeAt } = info
                const { baseInfo } = creation
                return ({
                    ...baseInfo,
                    ...creationEngagement,
                    timeAt: timeAt,
                })
            }, [])

            setCreationInfoGroup(() => ({
                creations: videos
            }))
        }
        exeCute()
    }, [userId])

    if (!master) {
        return null
    }

    return (
        <div className="collections-page">
            <div className="creations-block">
                <div className="title-box">
                    <h2 className="title">收藏夹</h2>

                </div>
                <div className="creation-list">
                    <VideoList videos={creationInfoGroup.creations} />
                </div>
            </div>
        </div>
    );
}