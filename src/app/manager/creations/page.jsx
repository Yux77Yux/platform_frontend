'use client'

import { useCallback, useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import './page.scss'
import Link from 'next/link';

import { Creation_Status } from "@/src/tool/creation"
import { getToken } from '@/src/tool/getLoginUser';
import { Api_Status } from '@/src/tool/api-status';

const ManagerCreations = ({ status }) => {
    const [page, setPage] = useState(1)
    const statusChangedRef = useRef(false);
    const [pageCount, setPageCount] = useState(1)
    const [creationInfos, setCreationInfos] = useState([])

    const fetchCreations = useCallback(async (body) => {
        try {
            const response = await fetch("http://localhost:8080/api/manager/creations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            })
            if (!response.ok) {
                alert("网络不通")
                return false
            }
            const result = await response.json()
            const { status } = result.msg
            if (status != Api_Status.SUCCESS) {
                return false
            }
            return result
        } catch (error) {
            console.log(error)
            return false
        }
    }, [])

    // 当 status 改变时，重置 page 为 1，并请求第一页数据（更新 count）
    useEffect(() => {
        statusChangedRef.current = true;
        setPage(1);
    }, [status]);

    // 当用户主动改变页码时（page ≠ 1），发起翻页请求
    useEffect(() => {
        // 如果刚刚切换过状态，但 page 还没有更新到 1，则跳过此次请求
        if (statusChangedRef.current && page !== 1) return;

        (async () => {
            const token = await getToken();
            const body = { accessToken: { value: token }, page, status };
            const result = await fetchCreations(body);
            console.log(result);
            const { creationInfoGroup, count } = result;
            setCreationInfos(creationInfoGroup);

            // 如果当前请求的是第一页，我们更新 count，
            // 并重置 statusChangedRef，这样后续翻页或切换状态时逻辑都正常
            if (page === 1) {
                statusChangedRef.current = false;
                setPageCount(count)
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, status]);

    return <>
        <button onClick={() => setPage(5)}>1111111111</button>
    </>
}

const Page = () => {
    const [status, setStatus] = useState(Creation_Status.DRAFT);

    const handlerStatus = useCallback((status) => {
        setStatus(status)
    }, [])

    return (
        <div className='creations-page'>
            <div className="creation-status">
                <button className={`btn ${status !== Creation_Status.DRAFT && "active"}`} onClick={() => handlerStatus(Creation_Status.PUBLISHED)}>全部稿件</button>
                <button className={`btn ${status === Creation_Status.DRAFT && "active"}`} onClick={() => handlerStatus(Creation_Status.DRAFT)}>草稿</button>
            </div>
            {status !== Creation_Status.DRAFT && <div className="creation-review-status">
                <button className={`btn ${status === Creation_Status.PENDING && "active"}`} onClick={() => handlerStatus(Creation_Status.PENDING)}>进行中</button>|
                <button className={`btn ${status === Creation_Status.PUBLISHED && "active"}`} onClick={() => handlerStatus(Creation_Status.PUBLISHED)}>已通过</button>|
                <button className={`btn ${status === Creation_Status.REJECTED && "active"}`} onClick={() => handlerStatus(Creation_Status.REJECTED)}>未通过</button>
            </div>}
            <ManagerCreations status={status} />
        </div >
    );
}

export default Page;