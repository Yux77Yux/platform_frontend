'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { useSpace } from "../context";

import Pagination from "@/src/client-components/pagination/pagination"
import VideoList from "@/src/client-components/video-slight-list/VideoList"
import { ByCount, fetchCreationInfo } from "@/src/tool/space"
import "./page.scss";

export default function Page() {
    const statusChangedRef = useRef()
    const [spaceCreations, setSpaceCreations] = useState({
        type: ByCount.PUBLISHED_TIME,
        page: 1,
        // search: "",
    });

    // user
    const { space } = useSpace()
    const { user } = space
    const { userDefault } = user
    const { userId } = userDefault

    // creation
    const [creationInfoGroup, setCreationInfoGroup] = useState({
        count: 0,
        creations: [],
    })
    const { count, creations } = creationInfoGroup
    let length = count ? count : 1

    const handlerField = useCallback((updates) => setSpaceCreations((prev) => ({
        ...prev,
        ...updates
    })), []);

    const changeSearch = useCallback((search) => setSpaceCreations((prev) => ({
        ...prev,
        search: search,
    })), []);

    const setPage = (page) => setSpaceCreations(prev => ({ ...prev, page: page }))

    // 当用户主动改变页码时（page ≠ 1），发起翻页请求
    useEffect(() => {
        // 如果刚刚切换过状态，但 page 还没有更新到 1，则跳过此次请求
        if (statusChangedRef.current && page !== 1) return;
        const { page, type } = spaceCreations;
        (async () => {
            const result = await fetchCreationInfo(userId, page, type);
            const { count } = result;
            const creationInfos = result.creationInfoGroup
            let videos = creationInfos.map((info) => {
                const { creation, creationEngagement } = info
                const { baseInfo } = creation
                return ({
                    ...baseInfo,
                    ...creationEngagement,
                })
            }, [])
            setCreationInfoGroup(() => ({
                count: count,
                creations: videos
            }))

            if (page == 1) {
                statusChangedRef.current = false;
            }
        })();
    }, [userId, spaceCreations]);

    return (
        <div className="creations-page">
            <div className="creations-block">
                <div className="title-box">
                    <button className="type" onClick={() => handlerField({ type: "PUBLISHED_TIME", page: 1 })}>最新发布</button>
                    <button className="type" onClick={() => handlerField({ type: "VIEWS", page: 1 })}>最多播放</button>
                    <button className="type" onClick={() => handlerField({ type: "COLLECTIONS", page: 1 })}>最多收藏</button>

                    <div className="search">
                        <input type="text" name="" id="" value={spaceCreations.search} onChange={(e) => changeSearch(e.target.value)} />
                        <button></button>
                    </div>
                </div>
                <div className="creation-list">
                    <VideoList videos={creations} />
                </div>
                <div className="pagination-box">
                    {length > 1 && <Pagination count={length} setPage={setPage} page={spaceCreations.page} />}
                </div>
            </div>
        </div>
    );
}