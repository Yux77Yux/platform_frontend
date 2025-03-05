'use client'

import { useCallback, useState } from 'react';
import './admin-video.scss'
import CategoryMenu from "@/src/client-components/select/select";
import { getToken } from '@/src/tool/getLoginUser';
import { updateReview, Status } from '@/src/tool/review';
import { Creation_Status } from '@/src/tool/creation';
import Modal from '@/src/client-components/modal-no-redirect/modal.component';
import TextPrompt from "@/src/client-components/prompt/TextPrompt";
import Link from "next/link"

const AdminVideo = ({ reviewInfo, removeReview }) => {
    const { creation, review } = reviewInfo
    const { id } = review.new
    const { baseInfo, creationId } = creation;
    const { bio, src, title, category_id, status } = baseInfo

    const [textPrompt, setTextPrompt] = useState({
        isOpen: false,
        text: "",
    })

    const [reject, setReject] = useState({
        isOpen: false,
        reason: "",
    })

    const [del, setDel] = useState({
        isOpen: false,
        reason: "",
    })

    let statusText = "待审核"
    switch (status) {
        case Creation_Status.DELETE:
            statusText = "已删除"
            break;
        case Creation_Status.DRAFT:
            statusText = "草稿"
            break;
        case Creation_Status.PUBLISHED:
            statusText = "已发布"
            break;
        case Creation_Status.REJECTED:
            statusText = "已驳回"
            break;
    }

    const setTextPromptOpen = (open) => setTextPrompt((prev) => ({ ...prev, isOpen: open, }))
    const setRejectOpen = (open) => setReject((prev) => ({ ...prev, isOpen: open }))
    const setDelOpen = (open) => setDel((prev) => ({ ...prev, isOpen: open }))

    const updateReport = useCallback(async (status, remark) => {
        const token = await getToken()
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
    }, [id, removeReview])

    return <>
        {textPrompt.isOpen && <TextPrompt text={textPrompt.text} setOpen={setTextPromptOpen} />}
        <div className="detail-slot">
            <div className="detail-left">
                <div className="detail-player">
                    <video className="player-element" autoPlay={false} controls>
                        <source src={src} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="buttons">
                    <button className="btn" onClick={() => updateReport(Status.APPROVED, void 0)}>通过审核</button>
                    <button className="btn" onClick={() => setRejectOpen(true)}>不予过审</button>
                    {reject.isOpen && <Modal setOpen={setRejectOpen}>
                        <div className="confirm-box">
                            <h2>不予过审理由</h2>
                            <textarea
                                value={reject.reason}
                                onChange={(e) => setReject((prev) => ({ ...prev, reason: e.target.value }))}
                                placeholder="请输入理由"
                                rows="4"
                            />

                            <div className="btns">
                                <button className="btn cancel" onClick={() => setRejectOpen(false)}>取消</button>
                                <button className={`btn confirm ${reject.reason.trim().length <= 0 && "hide"}`}
                                    onClick={() => updateReport(Status.REJECTED, reject.reason)}>确定</button>
                            </div>
                        </div>
                    </Modal>}
                    <button className="btn" onClick={() => setDelOpen(true)}>永久删除</button>
                    {del.isOpen && <Modal setOpen={setDelOpen}>
                        <div className="confirm-box">
                            <h2>删除审核信息理由</h2>
                            <textarea
                                value={del.reason}
                                onChange={(e) => setDel((prev) => ({ ...prev, reason: e.target.value }))}
                                placeholder="请输入理由"
                                rows="4"
                            />

                            <div className="btns">
                                <button className="btn cancel" onClick={() => setDelOpen(false)}>取消</button>
                                <button className={`btn confirm ${del.reason.trim().length <= 0 && "hide"}`}
                                    onClick={() => updateReport(Status.DELETED, reject.reason)}>确定</button>
                            </div>
                        </div>
                    </Modal>}
                </div>
                <Link href={`/creation/${creationId}`} target="_blank" className="transform">跳转观看</Link>
            </div>
            <div className="detail-right">
                <div className="title">
                    <span className='label'>标题</span>
                    <span className='content'>{title}</span>
                </div>
                <div className="status">
                    <span className='label'>状态</span>
                    <span className='content'>{statusText}</span>
                </div>
                <div className="category">
                    <span className='label'>分区</span>
                    <span className='content' style={{
                        position: 'relative',
                        top: '-6px',
                        pointerEvents: id ? 'none' : 'auto',
                        opacity: id ? 0.5 : 1, // 显示禁用效果
                    }}>
                        <CategoryMenu categoryId={category_id} handleChange={null} />
                    </span>
                </div>
                <div className="bio">
                    <span className='label'>简介</span>
                    <span className='bio-content'>{bio || "无简介"}</span>
                </div>
            </div>
        </div>
    </>
}

export default AdminVideo;