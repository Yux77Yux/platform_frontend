'use client'

import { useCallback, useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import './page.scss'

import { useRouter } from 'next/navigation';
import Pagination from '@/src/client-components/pagination/pagination';
import TextPrompt from '@/src/client-components/prompt/TextPrompt';
import Modal from "@/src/client-components/modal-no-redirect/modal.component"

import { Creation_Status } from "@/src/tool/creation"
import { getToken } from '@/src/tool/getLoginUser';
import { Api_Status } from '@/src/tool/api-status';
import { formatChineseDate, formatDuration } from '@/src/tool/formatTimestamp';

const CreationInfoCard = ({ creationInfo }) => {
    const router = useRouter()
    const { creation, creationEngagement } = creationInfo
    const { baseInfo, creationId, uploadTime } = creation
    const { likes, saves, views } = creationEngagement
    const { duration, thumbnail, title } = baseInfo

    const time = formatChineseDate(uploadTime)
    const durationTime = formatDuration(duration)

    // 删除确认盒子
    const [delOpen, setDelOpen] = useState(false)

    const [textPrompt, setTextPrompt] = useState({
        isOpen: false,
        text: "",
    })
    const setTextPromptOpen = (open) => setTextPrompt((prev) => ({ ...prev, isOpen: open }))

    const deleteCreation = useCallback(async (body) => {
        try {
            const response = await fetch("http://localhost:8080/api/creation/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                alert("网络不通")
                return false
            }

            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }, [])


    const clickDelete = useCallback(async () => {
        const token = await getToken()
        const body = {
            accessToken: {
                value: token,
            },
            creationId: creationId,
        }
        const result = await deleteCreation(body)
        if (result) {
            setTextPrompt({ isOpen: true, text: "删除成功！即将回到首页" })
            setTimeout(() => router.replace("/"), 1500)
        } else {
            setTextPrompt({ isOpen: true, text: "删除失败，请重试！或等待一段时间" })
            setDelOpen(false)
        }
    }, [router, creationId, deleteCreation])

    return <>
        {textPrompt.isOpen && <TextPrompt text={textPrompt.text} setOpen={setTextPromptOpen} />}
        {delOpen && <Modal setOpen={setDelOpen}>
            <div className="report">
                <h4 className="title">是否删除？</h4>
                <div className="btns">
                    <button className="btn cancel" onClick={() => setDelOpen(false)}>取消</button>
                    <button className="btn confirm" onClick={clickDelete}>确定</button>
                </div>
            </div>
        </Modal>}
        <div className="content">
            <div className="cover" onClick={() => window.open(`/creation/${creationId}`, "_blank", "noopener,noreferrer")}>
                <Image src={thumbnail}
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={100}
                    alt=""
                />
                <span className="duration">{durationTime}</span>
            </div>
            <div className="description">
                <p className="title" onClick={() => window.open(`/creation/${creationId}`, "_blank", "noopener,noreferrer")}>{title}</p>
                <p className="time">{time}</p>
                <div className="statistics">
                    <span className="count">
                        <span className="icon">
                            <Image src="/img/video-16px.png"
                                fill
                                style={{ objectFit: 'cover' }}
                                quality={100}
                                alt=""
                            />
                        </span>
                        <span className="value">{views}</span>
                    </span>
                    <span className="count">
                        <span className="icon">
                            <Image src="/img/like-16px.png"
                                fill
                                style={{ objectFit: 'cover' }}
                                quality={100}
                                alt=""
                            />
                        </span>
                        <span className="value">{likes}</span>
                    </span>
                    <span className="count">
                        <span className="icon">
                            <Image src="/img/star-16px.png"
                                fill
                                style={{ objectFit: 'cover' }}
                                quality={100}
                                alt=""
                            />
                        </span>
                        <span className="value">{saves}</span>
                    </span>
                </div>
            </div>
            <div className="btns">
                <button className="btn" onClick={() => router.push(`/manager?id=${creationId}`)}>编辑</button>
                <button className="btn" onClick={() => setDelOpen(true)}>删除</button>
            </div>
        </div>
    </>
}

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
            const { creationInfoGroup, count } = result;
            console.log(creationInfoGroup);
            setCreationInfos(creationInfoGroup);

            // 如果当前请求的是第一页，我们更新 count，
            // 并重置 statusChangedRef，这样后续翻页或切换状态时逻辑都正常
            if (page === 1) {
                statusChangedRef.current = false;
                setPageCount(count)
            }
        })();
    }, [page, status, fetchCreations]);

    return <div className="manager-creations">
        {creationInfos.map((creationInfo) =>
            <CreationInfoCard creationInfo={creationInfo} key={creationInfo.creation.creationId}
            />)
        }
        {pageCount > 1 && <Pagination count={pageCount} page={page} setPage={setPage} />}
    </div>
}

const Page = () => {
    const [status, setStatus] = useState(Creation_Status.PUBLISHED);

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