'use client';
import "./comment.scss"
import { Comments } from './comments'

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import MenuPortal from "@/src/client-components/menu-portal/menu-portal"
import Modal from "@/src/client-components/modal-no-redirect/modal.component"

import { useParams } from "next/navigation";
import { getCookie } from "cookies-next";

import { getToken } from "@/src/tool/getLoginUser"
import { reportInfo, Status } from "@/src/tool/review"

// 发表评论
const publishComment = async (content, root, parent, dialog, creaitonId, token) => {
    try {
        if (!content) return null;

        const body = {
            comment: {
                root: root,
                parent: parent,
                dialog: dialog,
                content: content,
                creationId: creaitonId,
            },
            accessToken: {
                value: token,
            },
        }
        console.log(body)
        const response = await fetch("http://localhost:8080/api/comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),  // 将表单数据作为 JSON 发送
        });
        if (!response.ok) {
            console.log(response.error)
            return null
        }

        const result = await response.json()
        console.log(result)

        return result
    } catch (error) {
        console.log(error)
    }
}

// 删除评论
const deleteComment = async (comment_id, creation_id, token) => {
    try {
        const body = {
            commentId: comment_id,
            creationId: creation_id,
            accessToken: {
                value: token
            }
        }
        const response = await fetch("http://localhost:8080/api/comment/delete", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),  // 将表单数据作为 JSON 发送
        });
        if (!response.ok) {
            console.log(response.error)
            return null
        }

        const result = await response.json()
        console.log(result)

        return result
    } catch (error) {
        console.log(error)
    }
}

const CommentBox = () => {
    const creation = useParams()
    const creationId = creation.creationId

    // 评论区相关
    const [area, setArea] = useState({})// 评论区信息，评论总数，评论区状态
    const [pageCount, setPageCount] = useState(0) // 一级评论总数
    const [page, setPage] = useState(1)// 页
    const [topComments, setTopComments] = useState([])// 一级评论

    // 用于直接评论
    const [info, setInfo] = useState({
        content: null,
        root: 0,    // 楼层id
        parent: 0,  // 对话对象
        dialog: 0,
        token: "",
        creationId: "",
    })

    // 用于回复评论
    const [reply, setReply] = useState({
        content: null,
        root: -1,    // 楼层id
        parent: -1,  // 对话对象
        dialog: -1,
        token: "",
        creationId: "",

        parentName: "",
    })

    const handleField = useCallback((obj) => setInfo((prev) => ({
        ...prev,
        ...obj,
    })), [])
    const handleReplyField = useCallback((obj) => setReply((prev) => ({
        ...prev,
        ...obj,
    })), [])

    // 初始化评论
    const initialComments = useCallback(async (creationId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/watch/comments/${creationId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                console.log(response.error)
                return null
            }

            const result = await response.json()
            const { area, comments, pageCount } = result
            setPageCount(pageCount)
            setTopComments([...comments])
            setArea({
                count: area.totalComments,
                status: area.areaStatus,
            })

            return "OK"
        } catch (error) {
            console.log(error)
            return null
        }
    }, [])

    // 获取更多评论
    const getTopComments = useCallback(async (creationId, page) => {
        try {
            const response = await fetch(`http://localhost:8080/api/watch/comments/${creationId}/${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                console.log(response.error)
                return null
            }

            const result = await response.json()
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }, [])

    const getMoreTopComments = useCallback(() => {
        console.log("getMore")

        if (page >= pageCount) return
        getTopComments(creationId, page + 1)
            .then((result) => {
                if (!result) return;
                const { msg, comments } = result
                const status = msg.status;
                if (status != "SUCCESS") return;

                // 追加评论
                setPage(page + 1)
                setTopComments((prev) => ([...prev, ...comments]))
            })
            .catch((error) => console.log("error: getMoreTopComments " + error))
    }, [creationId, pageCount, page, setPage, setTopComments, getTopComments])

    const publishTopComment = useCallback(async () => {
        const { root, parent, dialog, content, creationId, token } = info
        await publishComment(content, root, parent, dialog, creationId, token)
    }, [info])

    useEffect(() => {
        const accessToken = getCookie('accessToken');
        if (accessToken) {
            handleField({ token: accessToken, creationId: creationId })
            handleReplyField({ token: accessToken, creationId: creationId })
        } else {
            handleField({ creationId: creationId })
            handleReplyField({ creationId: creationId })
        }
    }, [creationId, handleField, handleReplyField])

    useEffect(() => {
        initialComments(creationId)
    }, [creationId, initialComments])

    useEffect(() => {
        console.log(topComments.length)
        console.log(topComments)
    }, [topComments])

    return <div className="comment-box">
        <div className="h2">
            <h2 style={{ display: 'inline-block' }}>评论</h2>
            <span style={{ margin: '5px 0 0 8px', color: 'rgb(162, 166, 172)', }}>
                {area.count}
            </span>
        </div>

        {/* 评论区开始 */}
        <div className="comments-domain" style={{ marginTop: '20px', borderBottom: '0' }}>
            <div className="comment-one" style={{ pointerEvents: 'none' }}>
                <Avatar src="/img/slience.jpg" height="56px" width="56px" />
            </div>
            <div className="comment-two">
                <div
                    contentEditable="true"
                    ref={(div) => {
                        if (div && div.innerText !== info.content) {
                            div.innerText = info.content; // 保持内容同步
                        }
                    }}
                    onInput={(event) => {
                        const newContent = event.target.innerText;
                        handleField({ content: newContent });
                        const trim = newContent.trim();
                        if (trim === '' && trim.length === 0) {
                            handleField({ content: null });
                        }
                    }}
                    className="editor-comment"
                    data-placeholder="快来发布评论吧！"
                ></div>
                <div className="publish-btn">
                    <button className="btn" onClick={publishTopComment}>发布</button>
                </div>
            </div>
        </div>
        {Comments.filter(value => value.parent === value.root && value.root === 0).map((commentOne, i) => (
            <TopCommentList handleReplyField={handleReplyField} commentOne={commentOne} reply={reply} key={i} />
        ))}
        <div style={{ color: 'rgb(148, 153, 160)', fontSize: '14px' }}>
            <button onClick={getMoreTopComments}
                style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                    position: 'relative',
                    backgroundColor: 'transparent',
                    color: 'inherit',
                    fontSize: 'inherit',
                    margin: '8px',
                    letterSpacing: '2px',
                    fontSize: '16px',
                    pointerEvents: page < pageCount ? 'auto' : 'none'
                }}>
                {page < pageCount ? "更多评论" : "已到底"}
            </button>
        </div>
    </div >
}

// 一级评论列表
const TopCommentList = ({ handleReplyField, commentOne, reply }) => {
    const [isHover, setIsHover] = useState(false);
    const [isOpen, setOpen] = useState(false)
    const triggerRef = useRef();

    const param = useParams()

    const id = commentOne.id
    const root = id
    const parent = root
    const dialog = -1
    const parentName = commentOne.name

    // 举报
    const [report, setReport] = useState({
        detail: "",
        isOpen: false,
    })

    // 删除
    const [delInfo, setDelInfo] = useState({
        isOpen: false,
    })

    const setReplyFields = useCallback(() => {
        handleReplyField({
            root: root,
            parent: parent,
            dialog: dialog,
            parentName: parentName,
            content: null,
        })
    }, [handleReplyField, root, parent, dialog, parentName])

    const setReportOpen = useCallback((state) => {
        setReport((prev) => ({ ...prev, isOpen: state }))
    }, [setReport])

    const setDelOpen = useCallback((state) => {
        setDelInfo((prev) => ({ ...prev, isOpen: state }))
    }, [setDelInfo])

    // 举报发送
    const reportComment = useCallback(() => {
        reportInfo(Status.COMMENT, id, report.detail)
    }, [id, report])

    // 删除评论
    const delComment = useCallback(async () => {
        const token = await getToken()
        deleteComment(id, param.creationId, token)
    }, [id, param])

    return (
        <div className="comments-domain">
            <div className="comment-one"
                onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
                <Avatar src="/img/slience.jpg" height="56px" width="56px" />
            </div>
            <div className="comment-two" >
                <div className="name"
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                >
                    <span>{commentOne.name}</span></div>
                <div className="content"
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                >
                    {commentOne.content}</div>
                <div className="additional"
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                >
                    <span className="time">{commentOne.time}</span>
                    <button className="reply"
                        onClick={setReplyFields}
                    >回复</button>
                    <span className={`option ${isHover && "show"}`}
                        ref={triggerRef}
                        onClick={() => setOpen(true)}
                        onMouseLeave={() => setOpen(false)}>
                        ···
                        {isOpen && <MenuPortal targetRef={triggerRef}>
                            <div className="more-symbol-button-options">
                                <button className="btn" onClick={() => setReportOpen(true)}>举报</button>
                                <button className="btn" onClick={() => setDelOpen(true)}>删除</button>
                            </div>
                        </MenuPortal>}
                    </span>
                    {delInfo.isOpen && <Modal setOpen={setDelOpen}>
                        <div className="report-comment">
                            <h4 className="title">是否删除？</h4>
                            <div className="btns">
                                <button className="btn cancel" onClick={() => setDelOpen(false)}>取消</button>
                                <button className="btn confirm" onClick={delComment}>确定</button>
                            </div>
                        </div>
                    </Modal>}
                    {report.isOpen && <Modal setOpen={setReportOpen}>
                        <div className="report-comment">
                            <h4 className="title">评论信息举报</h4>
                            <div className="detail">
                                <textarea
                                    value={report.detail}
                                    onChange={(e) => setReport((prev) => ({ ...prev, detail: e.target.value }))}
                                    placeholder="请输入举报理由，请简要描述"
                                />
                            </div>

                            <div className="btns">
                                <button className="btn cancel" onClick={() => setReportOpen(false)}>取消</button>
                                <button className="btn confirm" disabled={report.detail.trim().length <= 0} onClick={reportComment}>确定</button>
                            </div>
                        </div>
                    </Modal>}
                </div>

                {/* 二级评论列表 */}
                <SecondCommentList commentOne={commentOne} handleReplyField={handleReplyField} />

                {commentOne.id === reply.root && <SelfSpeak reply={reply} handleReplyField={handleReplyField} />}
            </div>
        </div>
    );
}

// 二级评论列表
const SecondCommentList = ({ commentOne, handleReplyField }) => {
    const [pageCount, setPageCount] = useState(0) // 一级评论总数
    const [page, setPage] = useState(1)// 页
    const [topComments, setTopComments] = useState([])// 一级评论

    const secondComments = Comments.filter(val => val.root === commentOne.id);
    const [open, setOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 10; // 每页显示的评论数量

    // 计算当前页显示的评论
    const startIndex = (currentPage - 1) * commentsPerPage;
    const currentComments = secondComments.slice(startIndex, startIndex + commentsPerPage);

    // 计算总页数
    const totalPages = Math.ceil(secondComments.length / commentsPerPage);

    const initialSecondComments = useCallback(async (creationId, root, page) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/watch/comments/second/${creationId}/${root}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            if (!response.ok) {
                console.log(response.error)
                return null
            }

            const result = await response.json()
            console.log(result)

            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }, [])

    const getSecondComments = useCallback(async (creationId, root, page) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/watch/comments/second/${creationId}/${root}/${page}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            if (!response.ok) {
                console.log(response.error)
                return null
            }

            const result = await response.json()
            console.log(result)

            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }, [])

    return (
        <>
            {!open && <div style={{ color: 'rgb(148, 153, 160)', fontSize: '14px' }}>
                共 {secondComments.length} 条回复，
                <button onClick={() => setOpen(true)} style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                    position: 'relative',
                    backgroundColor: 'transparent',
                    color: 'inherit',
                    fontSize: 'inherit',
                }}>
                    点击查看
                </button>
            </div>}
            {open && currentComments.map((comment, j) => (
                <SecondComment handleReplyField={handleReplyField} comment={comment} key={j} />
            ))}

            {/* 分页器 */}
            {open && totalPages > 1 && <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    上一页
                </button>
                <span>
                    第 {currentPage} 页 / 共 {totalPages} 页
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    下一页
                </button>
            </div>}
        </>
    );
}

// 二级评论内容
const SecondComment = ({ handleReplyField, comment }) => {
    const [isHovered, setIsHovered] = useState(false);
    const triggerRef = useRef()
    const [isOpen, setOpen] = useState(false)
    const param = useParams()

    const id = comment.id
    const root = comment.root
    const parent = comment.id
    const dialog = comment.dialog
    const parentName = comment.name

    const setReplyFields = useCallback(() => {
        handleReplyField({
            root: root,
            parent: parent,
            dialog: dialog,
            parentName: parentName,
            content: null,
        })
    }, [handleReplyField, root, parent, dialog, parentName])

    // 举报
    const [report, setReport] = useState({
        detail: "",
        isOpen: false,
    })

    // 删除
    const [delInfo, setDelInfo] = useState({
        isOpen: false,
    })

    const setReportOpen = useCallback((state) => {
        setReport((prev) => ({ ...prev, isOpen: state }))
    }, [setReport])

    const setDelOpen = useCallback((state) => {
        setDelInfo((prev) => ({ ...prev, isOpen: state }))
    }, [setDelInfo])

    // 举报发送
    const reportComment = useCallback(() => {
        reportInfo(Status.COMMENT, id, report.detail)
    }, [id, report])

    // 删除评论
    const delComment = useCallback(async () => {
        const token = await getToken()
        deleteComment(id, param.creationId, token)
    }, [id, param])

    return (
        <div className="comments-second-domain"
            onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
        >
            <div className="comment-second-one">
                <Avatar src="/img/slience.jpg" height="36px" width="36px" />
            </div>
            <div className="comment-second-two">
                <div className="second-speak">
                    <span className="name">
                        <Link href="/" target="_blank"
                            style={{ cursor: 'pointer', fontSize: 'inherit', color: 'black' }}>
                            {comment.name}
                        </Link>

                        {comment.parent !== comment.root &&
                            <>
                                <span href="/" target="_blank"
                                    style={{ fontSize: '15px', margin: '0 6px 0 8px', color: 'black' }}>
                                    回复
                                </span>
                                <Link href="/" target="_blank" className="link">
                                    @{Comments.find(val => val.id === comment.parent).name}
                                </Link>
                                <span style={{ position: 'relative', marginLeft: '4px', fontSize: '15px', color: 'black' }}>:</span>
                            </>
                        }
                    </span>
                    <span className="content">{comment.content}</span>
                </div>
                <div className="additional">
                    <span className="time">{comment.time}</span>
                    <button className="reply"
                        onClick={setReplyFields}
                    >回复</button>
                    <span className={`option ${isHovered && "show"}`}
                        ref={triggerRef}
                        onClick={() => setOpen(true)}
                        onMouseLeave={() => setOpen(false)}>
                        ···
                        {isOpen && (
                            <MenuPortal targetRef={triggerRef}>
                                <div className="more-symbol-button-options">
                                    <button className="btn" onClick={() => setReportOpen(true)}>举报</button>
                                    <button className="btn" onClick={() => setDelOpen(true)}>删除</button>
                                </div>
                            </MenuPortal>
                        )}
                    </span>
                    {delInfo.isOpen && <Modal setOpen={setDelOpen}>
                        <div className="report-comment">
                            <h4 className="title">是否删除？</h4>
                            <div className="btns">
                                <button className="btn cancel" onClick={() => setDelOpen(false)}>取消</button>
                                <button className="btn confirm" onClick={delComment}>确定</button>
                            </div>
                        </div>
                    </Modal>}
                    {report.isOpen && <Modal setOpen={setReportOpen}>
                        <div className="report-comment">
                            <h4 className="title">评论信息举报</h4>
                            <div className="detail">
                                <textarea
                                    value={report.detail}
                                    onChange={(e) => setReport((prev) => ({ ...prev, detail: e.target.value }))}
                                    placeholder="请输入举报理由，请简要描述"
                                />
                            </div>

                            <div className="btns">
                                <button className="btn cancel" onClick={() => setReportOpen(false)}>取消</button>
                                <button className="btn confirm" disabled={report.detail.trim().length <= 0} onClick={reportComment}>确定</button>
                            </div>
                        </div>
                    </Modal>}
                </div>
            </div>
        </div>
    );
}

// 回复框
const SelfSpeak = ({ reply, handleReplyField }) => {
    const replyComment = useCallback(async () => {
        const { root, parent, dialog, content, creationId, token } = reply
        await publishComment(content, root, parent, dialog, creationId, token)
    }, [reply])

    return (
        <div className="self-reply">
            <div className="comment-one" style={{ pointerEvents: 'none' }}>
                <Avatar src="/img/slience.jpg" height="56px" width="56px" />
            </div>
            <div className="comment-two">
                <div
                    contentEditable="true"
                    ref={(div) => {
                        if (div && div.innerText !== reply.content) {
                            div.innerText = reply.content; // 保持内容同步
                        }
                    }}
                    onInput={(event) => {
                        const newContent = event.target.innerText;
                        handleReplyField({ content: newContent });
                        const trim = newContent.trim();
                        if (trim === '' && trim.length === 0) {
                            handleReplyField({ content: null });
                        }
                    }}
                    className="editor-comment"
                    data-placeholder={`回复 @${reply.parentName}:`}
                >
                </div>
                <div className="publish-btn">
                    <button className="btn" onClick={replyComment}>发布</button>
                </div>
            </div>
        </div>
    );
}

const Avatar = ({ src, height, width }) => <Link href="/" target="_blank" style={{
    display: 'block',
    cursor: 'pointer',
    position: 'relative',
    height: height,
    width: width,
    clipPath: 'circle(50%)',
}}>
    <Image src={src} quality={100} fill objectFit="cover" alt="" />
</Link>

export default CommentBox;