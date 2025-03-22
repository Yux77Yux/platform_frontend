'use client';

import { useEffect, useState } from "react";
import "./page.scss";

import { searchCreaiton } from "@/src/tool/get"
import { useSearchParams } from "next/navigation";

import VideoList from "@/src/client-components/home-list/interaction-videoList";
import SearchInputBox from "@/src/client-components/search-box/search-input-box.component";
import Pagination from "@/src/client-components/pagination/pagination"

const Page = () => {
    const search = useSearchParams()
    const [creationInfoGroup, setCreationInfoGroup] = useState({
        count: 0,
        creations: [],
    })
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(1)
    }, [search])

    useEffect(() => {
        (async () => {
            const result = await searchCreaiton(search.get("query"), page);
            const { count, cards } = result
            const videos = cards.map((info) => {
                const { creation, creationEngagement, timeAt, user } = info
                const { baseInfo } = creation
                return ({
                    ...baseInfo,
                    ...creationEngagement,
                    user,
                    timeAt,
                })
            }, [])
            setCreationInfoGroup(() => ({
                count: count,
                creations: videos,
            }))
        })()
    }, [search, page])

    return <div className="search-page">
        <div className="none"></div>
        <div className="search-input">
            <SearchInputBox />
        </div>
        <div className="search-content">
            <VideoList videos={creationInfoGroup.creations} />
        </div>

        <div className="pagination-box">
            {creationInfoGroup.count > 1 && <Pagination page={page} setPage={setPage} count={creationInfoGroup.count} />}
        </div>
    </div>
}

export default Page;