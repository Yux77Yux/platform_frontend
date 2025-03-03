'use client'

import { useCallback, useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import './page.scss'
import { Status, getNewCreationReviews, getCreationReviews } from "@/src/tool/review"
import { getToken } from '@/src/tool/getLoginUser';
import { formatTimestamp, formatDuration } from '@/src/tool/formatTimestamp';
import Modal from '@/src/client-components/modal-no-redirect/modal.component';
import AdminVideo from '@/src/client-components/admin-video/admin-video'

const Page = () => {
    const [status, setStatus] = useState(Status.PENDING)
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [reviews, setReviews] = useState([])
    const statusChangedRef = useRef(false);

    const removeReview = useCallback((id) => {
        setReviews(reviews.filter(reviewInfo => reviewInfo.review.new.id != id));
    }, [reviews])

    const getNewReviews = useCallback(async () => {
        const token = await getToken()
        const result = await getNewCreationReviews(token)
        console.log(result)
        const { reviews } = result
        setIsLoading(true)
        setReviews((prev) => [...prev, ...reviews])
        setIsLoading(false)
    }, [])

    const scrollAddPage = useCallback(() => {
        if (isLoading || page + 1 > pageCount) return;
        setIsLoading(true)
        setPage(page + 1)
    }, [isLoading, page, pageCount])

    useEffect(() => {
        statusChangedRef.current = true;
        setPage(1);
        setReviews([])
    }, [status]);

    useEffect(() => {
        // 如果刚刚切换过状态，但 page 还没有更新到 1，则跳过此次请求
        if (statusChangedRef.current && page !== 1) {
            return;
        }

        (async () => {
            const token = await getToken();
            const result = await getCreationReviews(status, page, token);
            if (!result) return;

            const { count, reviews } = result
            setReviews((prev) => [...prev, ...reviews])
            setIsLoading(false)

            // 如果当前请求的是第一页，我们更新 count，
            // 并重置 statusChangedRef，这样后续翻页或切换状态时逻辑都正常
            if (page === 1) {
                statusChangedRef.current = false;
                setPageCount(count)
            }
        })();
    }, [page, status]);

    useEffect(() => {
        const handleScroll = () => {
            if (isLoading || page > pageCount) return; // 避免多余的监听

            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= fullHeight * 0.96) {
                console.log("执行")
                scrollAddPage();
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isLoading, page, pageCount, scrollAddPage]);

    if (isLoading) return null

    return (
        <div className='review-video'>
            <div className="status">
                <button onClick={() => setStatus(Status.PENDING)} className={`set-status ${status === Status.PENDING && "active"}`}>未审核</button>
                <button onClick={() => setStatus(Status.APPROVED)} className={`set-status ${status === Status.APPROVED && "active"}`}>已过审</button>
                <button onClick={() => setStatus(Status.REJECTED)} className={`set-status ${status === Status.REJECTED && "active"}`}>未过审</button>
            </div>

            <div className="content" style={{ boxShadow: 'none', borderBottom: '1px solid rgb(111,111,111)' }}>
                <div className="content-id">审核信息 ID</div>
                <div className="content-cover">封面</div>
                <div className="content-detail">理由</div>
                <div className="content-created">入审时间</div>
                <div className="content-status">状态</div>
                <div className="content-addition"> {reviews.length || 0} </div>
            </div>
            {reviews.map((reviewInfo) => <Content key={reviewInfo.review.new.id} reviewInfo={reviewInfo} removeReview={removeReview} />)}
            <div className="content">
                <div className="content-detail"
                    onClick={getNewReviews}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'rgb(114, 114, 231)',
                        cursor: 'pointer',
                    }}>尝试拉取新请求</div>
            </div>
        </div >
    );
}

const Content = ({ reviewInfo, removeReview }) => {
    const { creation, review } = reviewInfo
    const { createdAt, id, msg } = review.new
    const { thumbnail, duration } = creation.baseInfo
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // 禁用页面滚动
        } else {
            document.body.style.overflow = ''; // 恢复页面滚动
        }

        // 清理函数，防止意外
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return <>
        {isOpen && <Modal setOpen={setIsOpen}><AdminVideo reviewInfo={reviewInfo} removeReview={removeReview} /></Modal>}
        <div className="content">
            <div className="content-id">{id}</div>
            <div className="content-cover">
                <div style={{
                    position: 'relative',
                    height: '160px',
                    width: '82%',
                    borderRadius: '4px',
                    overflow: 'hidden',
                }}>
                    <Image src={thumbnail} alt='' fill quality={100} objectFit='cover' />
                    <span className="duration">{formatDuration(duration)}</span>
                </div>
            </div>
            <div className="content-detail">{msg}</div>
            <div className="content-created">{formatTimestamp(createdAt)}</div>
            <div className="content-status">待审核</div>
            <button className="content-addition" onClick={() => setIsOpen(true)}> 详情 </button>
        </div>
    </>
}

export default Page;