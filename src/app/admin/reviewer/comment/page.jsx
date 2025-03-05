'use client'

import { useCallback, useEffect, useState, useRef } from 'react';
import './page.scss'
import { Status, updateReview, getNewCommentReviews, getCommentReviews } from "@/src/tool/review"
import { getToken } from '@/src/tool/getLoginUser';
import { formatTimestamp } from '@/src/tool/formatTimestamp';
import TextPrompt from "@/src/client-components/prompt/TextPrompt";
import Modal from "@/src/client-components/modal-no-redirect/modal.component";
import Link from 'next/link';

const Page = () => {
    const [status, setStatus] = useState(Status.PENDING)
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [reviews, setReviews] = useState([])
    const statusChangedRef = useRef(false);
    const [textPrompt, setTextPrompt] = useState({
        isOpen: false,
        text: "",
    })

    const setTextPromptOpen = (open) => setTextPrompt((prev) => ({ ...prev, isOpen: open, }))

    const removeReview = useCallback((id) => {
        setIsLoading(true)
        setReviews(reviews.filter(reviewInfo => reviewInfo.review.new.id != id));
        setIsLoading(false)
    }, [reviews])

    const getNewReviews = useCallback(async () => {
        if (isLoading) return;
        setIsLoading(true)

        const token = await getToken()
        const result = await getNewCommentReviews(token)
        const { reviews } = result
        if (reviews.length <= 0) {
            setTextPrompt({ isOpen: true, text: "无更多请求..." })
        } else {
            setReviews((prev) => [...prev, ...reviews])
        }

        setIsLoading(false)
    }, [isLoading])

    const scrollAddPage = useCallback(() => {
        if (isLoading || page + 1 > pageCount) return;
        setIsLoading(true)
        setPage(page + 1)
    }, [isLoading, page, pageCount])

    useEffect(() => {
        statusChangedRef.current = true;
        setReviews([])
        setPage(1);
    }, [status]);

    useEffect(() => {
        // 如果刚刚切换过状态，但 page 还没有更新到 1，则跳过此次请求
        if (statusChangedRef.current && page !== 1) {
            return;
        }

        (async () => {
            const token = await getToken();
            const result = await getCommentReviews(status, page, token);
            if (!result) return;

            const { count, reviews } = result
            console.log(result)
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

    return <>
        {textPrompt.isOpen && <TextPrompt text={textPrompt.text} setOpen={setTextPromptOpen} />}
        <div className='review-comment'>
            <div className="status">
                <button onClick={() => setStatus(Status.PENDING)} className={`set-status ${status === Status.PENDING && "active"}`}>未审核</button>
                <button onClick={() => setStatus(Status.APPROVED)} className={`set-status ${status === Status.APPROVED && "active"}`}>已过审</button>
                <button onClick={() => setStatus(Status.REJECTED)} className={`set-status ${status === Status.REJECTED && "active"}`}>未过审</button>
            </div>

            <div className="content" style={{ pointerEvents: 'none', boxShadow: 'none', borderBottom: '1px solid rgb(111,111,111)' }}>
                <div className="content-id">审核信息 ID</div>
                <div className="content-commentId">评论 ID</div>
                <div className="content-comment">评论内容</div>
                <div className="content-userId">用户 ID</div>
                <div className="content-creationId">作品 ID</div>
                <div className="content-detail" style={{ cursor: 'default' }}>理由</div>
                <div className="content-created" style={{ cursor: 'default' }}>入审时间</div>
                <div className="content-btns" style={{ cursor: 'default' }}>审核结果</div>
                <div className="content-addition" style={{ cursor: 'default', color: '#000', fontSize: '15px' }}>{reviews.length || 0}</div>
            </div>
            {reviews.map((reviewInfo) => <Content key={reviewInfo.review.new.id}
                reviewInfo={reviewInfo}
                removeReview={removeReview}
                setTextPrompt={setTextPrompt}
            />)}
            <div onClick={getNewReviews}
                style={{
                    display: 'flex',
                    position: 'relative',
                    width: '100%',
                    height: '56px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'rgb(114, 114, 231)',
                    cursor: 'pointer',
                }}>尝试拉取新请求
            </div>
        </div >
    </>
}

const Content = ({ reviewInfo, removeReview, setTextPrompt }) => {
    const { comment, review } = reviewInfo
    const { createdAt, id, msg } = review.new
    const { userId, content, commentId, creationId } = comment
    const [confirmBox, setConfirmBox] = useState({
        isOpen: false,
        reason: "",
        status: "",
    })

    const setConfirmBoxOpen = (open) => setConfirmBox((prev) => ({ ...prev, isOpen: open }))

    const updateReport = useCallback(async (status, remark) => {
        const token = await getToken();
        const body = {
            accessToken: { value: token },
            review: {
                new: {
                    id: id,
                },
                remark: remark,
                status: status,
            },
        }
        const result = await updateReview(body)
        if (result) {
            setTextPrompt({ text: "成功！", isOpen: true })
            setTimeout(() => removeReview(id), 750)
        } else {
            setTextPrompt({ text: "失败！请重试！", isOpen: false })
        }
    }, [id, removeReview, setTextPrompt])

    useEffect(() => {
        if (confirmBox.isOpen) {
            document.body.style.overflow = 'hidden'; // 禁用页面滚动
        } else {
            document.body.style.overflow = ''; // 恢复页面滚动
        }

        // 清理函数，防止意外
        return () => {
            document.body.style.overflow = '';
        };
    }, [confirmBox.isOpen]);

    return <>
        <div className="content">
            <div className="content-id">{id}</div>
            <div className="content-commentId">{commentId}</div>
            <div className="content-comment">{content}</div>
            <Link href={`/space/${userId}`} title='查看空间' target='_blank' className="content-userId">{userId}</Link>
            <Link href={`/creation/${creationId}`} title='查看作品' target='_blank' className="content-creationId">{creationId}</Link>
            <div className="content-detail">{msg}</div>
            <div className="content-created">{formatTimestamp(createdAt)}</div>
            <div className="content-btns">
                <button className="btn"
                    onClick={() => setConfirmBox({ isOpen: true, reason: "", status: Status.APPROVED })}
                >
                    通过
                </button>
                <button className="btn"
                    onClick={() => setConfirmBox({ isOpen: true, reason: "", status: Status.REJECTED })}
                >
                    封禁
                </button>
            </div>
            <button className="content-addition"
                onClick={() => setConfirmBox({ isOpen: true, reason: "", status: Status.DELETED })}
            >
                丢弃
            </button>
        </div >
        {confirmBox.isOpen && <Modal setOpen={setConfirmBoxOpen}>
            <div className="confirm-box">
                <h2>理由</h2>
                <textarea
                    value={confirmBox.reason}
                    onChange={(e) => setConfirmBox((prev) => ({ ...prev, reason: e.target.value }))}
                    placeholder={confirmBox.status == Status.APPROVED ? "可空" : "请输入理由"}
                    rows="4"
                />

                <div className="btns">
                    <button className="btn cancel" onClick={() => setConfirmBoxOpen(false)}>取消</button>
                    <button className={`btn confirm ${confirmBox.status != Status.APPROVED && confirmBox.reason.trim().length <= 0 && "hide"}`}
                        onClick={() => updateReport(confirmBox.status, confirmBox.reason)}>确定</button>
                </div>
            </div>
        </Modal>}
    </>
}

export default Page;