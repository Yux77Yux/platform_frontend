'use client';
import "./comment.scss"

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import TextPrompt from "@/src/client-components/prompt/TextPrompt"
import MenuPortal from "@/src/client-components/menu-portal/menu-portal"
import Modal from "@/src/client-components/modal-no-redirect/modal.component"

import { useParams } from "next/navigation";
import { getCookie } from "cookies-next";

import { formatTimestamp } from "@/src/tool/formatTimestamp"
import { getToken, getLoginUser, getLoginUserId } from "@/src/tool/getLoginUser"
import { reportInfo, Type, } from "@/src/tool/review"

// 发表评论
const publishComment = async (content, root, parent, dialog, creaitonId, createdAt, token) => {
    try {
        if (!content || root < 0) return null;

        const body = {
            comment: {
                root: root,
                parent: parent,
                dialog: dialog,
                content: content,
                creationId: creaitonId,
                createdAt: createdAt,
            },
            accessToken: {
                value: token,
            },
        }

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

        if (result.msg.status != "SUCESS" && result.msg.status != "PENDING") return false

        return true
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

        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

const CommentBox = () => {
    const [textPrompt, setTextPrompt] = useState({
        isOpen: false,
        text: "",
    })
    const [newId, setNewId] = useState(-1)
    const setPromptOpen = (isOpen) => setTextPrompt((prev) => ({ ...prev, isOpen: isOpen }))
    const creation = useParams()
    const { creationId } = creation

    const [loginUser, setUser] = useState(null)

    // 评论区相关
    const [area, setArea] = useState({})// 评论区信息，评论总数，评论区状态
    const [pageCount, setPageCount] = useState(0) // 一级评论总数
    const [page, setPage] = useState(1)// 页
    const [topComments, setTopComments] = useState([])// 一级评论
    const [isLoading, setIsLoading] = useState(false)

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
        parent: 0,  // 对话对象
        dialog: 0,
        token: "",
        creationId: "",

        parentName: "",
        parentUserId: "",
        parentUserAvatar: "",
    })

    const handleField = useCallback((obj) => setInfo((prev) => ({
        ...prev,
        ...obj,
    })), [])
    const handleReplyField = useCallback((obj) => setReply((prev) => ({
        ...prev,
        ...obj,
    })), [])

    const updateSubCount = (commentId, newCount) => {
        setTopComments((prevComments) =>
            prevComments.map((commentTop) =>
                commentTop.topComment.comment.commentId == commentId
                    ? {
                        ...commentTop,
                        topComment: {
                            ...commentTop.topComment,
                            subCount: newCount
                        }
                    }
                    : commentTop
            )
        );
    };

    const scrollAddPage = useCallback(() => {
        if (isLoading || page + 1 > pageCount) return;
        setIsLoading(true)
        setPage(page + 1)
    }, [isLoading, page, pageCount])

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
            setTopComments(comments)
            setArea({
                count: area ? area.totalComments : 0,
                status: area ? area.areaStatus : "DEFAULT",
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

    const publishTopComment = async () => {
        const { root, parent, dialog, content, creationId, token } = info
        const createdAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
        const newComment = {
            commentUser: {
                userBio: '',
                userAvatar: loginUser ? loginUser.avatar : '/img/slience.jpg',
                userDefault: {
                    userId: loginUser ? loginUser.id : -1,
                    userName: loginUser ? loginUser.name : '',
                },
            },
            topComment: {
                comment: {
                    commentId: newId,
                    content: content,
                    root: 0,
                    parent: 0,
                    dialog: 0,
                    media: "",
                    userId: loginUser ? loginUser.id : -1,
                    createdAt: createdAt,
                },
                subCount: 0,
            }
        }
        setNewId(newId - 1)

        const ok = await publishComment(content, root, parent, dialog, creationId, createdAt, token)
        if (!ok) return;
        setTextPrompt({ isOpen: true, text: "发布成功" })
        setTopComments((prev) => [newComment, ...prev])
    }

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
        if (page > pageCount || page <= 1) return
        setIsLoading(true)
        getTopComments(creationId, page)
            .then((result) => {
                if (!result) return;
                const { msg, comments } = result
                const status = msg.status;
                if (status != "SUCCESS") return;

                // 追加评论
                setTopComments((prev) => ([...prev, ...comments]))
            })
            .catch((error) => console.log("error: getMoreTopComments " + error))
        setTimeout(() => setIsLoading(false), 1500)
    }, [creationId, pageCount, page, getTopComments])

    useEffect(() => {
        getLoginUser()
            .then((result) => setUser(result))
            .catch((error) => console.log("getLoginUser error " + error))
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            if (isLoading || page > pageCount) return; // 避免多余的监听

            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= fullHeight * 0.95) {
                scrollAddPage();
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isLoading, page, pageCount, scrollAddPage]);

    return <div className="comment-box">
        {textPrompt.isOpen && <TextPrompt text={textPrompt.text} setOpen={setPromptOpen} />}
        <div className="h2">
            <h2 style={{ display: 'inline-block' }}>评论</h2>
            <span style={{ margin: '5px 0 0 12px', color: 'rgb(162, 166, 172)', fontSize: '19px' }}>
                {area.count || 0}
            </span>
        </div>

        {/* 评论区开始 */}
        <div className="comments-domain" style={{ marginTop: '20px', borderBottom: '0' }}>
            <div className="comment-one" style={{ pointerEvents: 'none' }}>
                <Avatar src={loginUser ? loginUser.avatar : '/img/slience.jpg'} height="56px" width="56px" />
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
        {topComments.map((commentTop) => (
            <TopCommentList handleReplyField={handleReplyField} commentTop={commentTop} reply={reply} key={commentTop.topComment.comment.commentId} updateSubCount={updateSubCount} />
        ))}
        {page >= pageCount && <div className="nomore">
            没有更多评论
        </div>}
    </div >
}

// 一级评论列表
const TopCommentList = ({ handleReplyField, commentTop, reply, updateSubCount }) => {
    const [loginId, setLoginId] = useState()
    const { commentUser, topComment } = commentTop;
    const { comment } = topComment
    const { commentId, userId, content, createdAt } = comment
    const { userDefault, userAvatar } = commentUser
    const { userName } = userDefault

    const time = formatTimestamp(createdAt)

    const [isHover, setIsHover] = useState(false);
    const [isOpen, setOpen] = useState(false)
    const triggerRef = useRef();

    const creation = useParams()
    const { creationId } = creation

    const id = commentId
    const root = id
    const parent = root
    const dialog = -1
    const parentName = userName

    // 举报
    const [report, setReport] = useState({
        detail: "",
        isOpen: false,
    })

    const [textPrompt, setTextPrompt] = useState({
        isOpen: false,
        text: ""
    })
    const setTextPromptOpen = () => setTextPrompt((prev) => ({ ...prev, isOpen: true }))

    // 删除
    const [delInfo, setDelInfo] = useState({
        isOpen: false,
    })

    const setReplyFields = () => {
        handleReplyField({
            root: root,
            parent: parent,
            dialog: dialog,
            parentName: parentName,
            content: null,
        })
    }

    const setReportOpen = useCallback((state) => {
        setReport((prev) => ({ ...prev, isOpen: state }))
    }, [setReport])

    const setDelOpen = (state) => {
        setDelInfo((prev) => ({ ...prev, isOpen: state }))
    }

    // 举报发送
    const reportComment = useCallback(() => {
        reportInfo(Type.COMMENT, id, report.detail)
    }, [id, report])

    // 删除评论
    const delComment = useCallback(async () => {
        const token = await getToken()
        const result = await deleteComment(id, creationId, token)
        if (result) {
            setTextPrompt({ isOpen: true, text: "删除成功" })
            setDelOpen(false)
            setTimeout(() => window.location.reload(), 4000)
        } else {
            setTextPrompt({ isOpen: true, text: "删除失败，请重试！" })
            setDelOpen(false)
        }
    }, [id, creationId])

    useEffect(() => {
        getLoginUserId()
            .then((userId) => {
                if (!userId) return
                setLoginId(userId)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    return (
        <>
            {textPrompt.isOpen && <TextPrompt text={textPrompt.text} setOpen={setTextPromptOpen} />}
            <div className="comments-domain">
                <div className="comment-one"
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                >
                    <Avatar src={userAvatar || "/img/slience.jpg"}
                        height="56px" width="56px"
                        userId={userId}
                    />
                </div>
                <div className="comment-two" >
                    <div className="name"
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                    >
                        <span style={{ color: 'rgb(111,116,122)' }}>{userName}</span>
                    </div>
                    <div className="content"
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                    >
                        {content}</div>
                    <div className="additional"
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                    >
                        <span className="time">{time}</span>
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
                                    {loginId != userId
                                        ? <button className="btn" onClick={() => setReportOpen(true)}>举报</button>
                                        : <button className="btn" onClick={() => setDelOpen(true)}>删除</button>}
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
                    <SecondCommentList reply={reply} commentTop={commentTop} handleReplyField={handleReplyField} updateSubCount={updateSubCount} />
                </div>
            </div>
        </>
    );
}

// 二级评论列表
const SecondCommentList = ({ reply, commentTop, handleReplyField, updateSubCount }) => {
    const { topComment } = commentTop;
    const { comment } = topComment
    const { commentId } = comment

    const params = useParams()
    const { creationId } = params

    const { subCount } = topComment

    const pageCount = Math.ceil(subCount / 10) // 楼层里的评论总数
    const [page, setPage] = useState(-1)// 页
    const [comments, setComments] = useState([])// 楼层里的评论

    const id = commentId
    const root = id

    const [open, setOpen] = useState(false);

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
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }, [])

    const changePageComments = useCallback((creationId, root, page) => {
        console.log("changePage")

        getSecondComments(creationId, root, page)
            .then((result) => {
                if (!result) return;
                const { msg, comments } = result
                const status = msg.status;
                if (status != "SUCCESS") return;
                // 改变评论
                setComments(() => comments)
            })
            .catch((error) => console.log("error: getMoreTopComments " + error))
    }, [getSecondComments])

    const pushComment = useCallback((newComment) => {
        setComments((prev) => [...prev, newComment])
    }, [])

    useEffect(() => {
        if (page <= 0) return;
        changePageComments(creationId, root, page)
    }, [creationId, root, page, changePageComments])

    useEffect(() => { if (comments.length > 0) console.log(comments) }, [comments])

    return (
        <>
            {subCount > 0 && !open && <div style={{ color: 'rgb(148, 153, 160)', fontSize: '14px' }}>
                共 {subCount} 条回复，
                <button onClick={() => { setOpen(true); setPage(1) }} style={{
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
            {open && comments.map((commentSecond) => (
                <SecondComment handleReplyField={handleReplyField} commentSecond={commentSecond} key={commentSecond.secondComment.comment.commentId} />
            ))}

            {/* 分页器 */}
            {open && pageCount > 1 && <div className="pagination">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    上一页
                </button>
                <span>
                    第 {page} 页 / 共 {pageCount} 页
                </span>
                <button
                    disabled={page === pageCount}
                    onClick={() => setPage(page + 1)}
                >
                    下一页
                </button>
            </div>}
            {/* 回复插入仍未拿到数据库回来的id，所以回复自己新评论是不可以的 */}
            {id > 0 && id === reply.root && <SelfSpeak pushComment={pushComment} reply={reply} handleReplyField={handleReplyField} subCount={subCount} updateSubCount={updateSubCount} />}
        </>
    );
}

// 二级评论内容
const SecondComment = ({ handleReplyField, commentSecond }) => {
    const [loginId, setLoginId] = useState()
    const { replyUser, secondComment } = commentSecond;
    let replyName = replyUser.userDefault.userName
    let replyUserId = replyUser.userDefault.userId

    const { commentUser, comment } = secondComment;
    const { commentId, userId, content, createdAt } = comment
    const { userDefault, userAvatar } = commentUser
    const { userName } = userDefault

    const commentParent = comment.parent; // 指评论的回复的id
    if (commentParent <= 0) {
        replyName = userName
        replyUserId = userId
    }

    const time = formatTimestamp(createdAt)

    const [isHovered, setIsHovered] = useState(false);
    const triggerRef = useRef()
    const [isOpen, setOpen] = useState(false)
    const params = useParams()
    const { creationId } = params

    const id = commentId
    const root = comment.root
    const parent = id
    let dialog = comment.dialog
    if (dialog == -1) {
        dialog = id
    }
    const parentName = userName

    const setReplyFields = () => {
        handleReplyField({
            root: root,
            parent: parent,
            dialog: dialog,
            parentName: parentName,
            content: null,

            parentUserId: userId,
            parentUserAvatar: userAvatar,
        })
    }

    const [textPrompt, setTextPrompt] = useState({
        isOpen: false,
        text: ""
    })
    const setTextPromptOpen = () => setTextPrompt((prev) => ({ ...prev, isOpen: true }))

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

    const setDelOpen = (state) => {
        setDelInfo((prev) => ({ ...prev, isOpen: state }))
    }

    // 举报发送
    const reportComment = useCallback(() => {
        reportInfo(Type.COMMENT, id, report.detail)
    }, [id, report])

    // 删除评论
    const delComment = useCallback(async () => {
        const token = await getToken()
        const result = await deleteComment(id, creationId, token)
        if (result) {
            setTextPrompt({ isOpen: true, text: "删除成功" })
            setDelOpen(false)
            setTimeout(() => window.location.reload(), 2000)
        } else {
            setTextPrompt({ isOpen: true, text: "删除失败，请重试！" })
            setDelOpen(false)
        }
    }, [id, creationId])

    useEffect(() => {
        getLoginUserId()
            .then((userId) => {
                if (!userId) return
                setLoginId(userId)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    return (
        <>
            {textPrompt.isOpen && <TextPrompt text={textPrompt.text} setOpen={setTextPromptOpen} />}
            <div className="comments-second-domain"
                onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
            >
                <div className="comment-second-one">
                    <Avatar src={userAvatar || "/img/slience.jpg"}
                        userId={userId}
                        height="36px"
                        width="36px"
                    />
                </div>
                <div className="comment-second-two">
                    <div className="second-speak">
                        <span className="name">
                            <Link href={`/space/${userId}`} target="_blank"
                                style={{ cursor: 'pointer', fontSize: 'inherit', color: 'rgb(111,116,122)' }}>
                                {userName}
                            </Link>

                            {comment.parent !== comment.root &&
                                <>
                                    <span href={`/space/${userId}`} target="_blank"
                                        style={{ fontSize: '15px', margin: '0 6px 0 8px', color: 'black' }}>
                                        回复
                                    </span>
                                    <Link href={`/space/${replyUserId}`} target="_blank" className="link">
                                        @{replyName}
                                    </Link>
                                </>
                            }
                            <span style={{ position: 'relative', marginLeft: '4px', fontSize: '15px', color: 'black' }}>:</span>
                        </span>
                        <span className="content">{content}</span>
                    </div>
                    <div className="additional">
                        <span className="time">{time}</span>
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
                                        {loginId != userId
                                            ? <button className="btn" onClick={() => setReportOpen(true)}>举报</button>
                                            : <button className="btn" onClick={() => setDelOpen(true)}>删除</button>}
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
        </>
    );
}

// 回复框
const SelfSpeak = ({ pushComment, reply, handleReplyField, subCount, updateSubCount }) => {
    const [textPrompt, setTextPrompt] = useState({
        isOpen: false,
        text: "",
    })
    const setPromptOpen = (isOpen) => setTextPrompt((prev) => ({ ...prev, isOpen: isOpen }))
    const [loginUser, setUser] = useState(null)

    const replyComment = async () => {
        const { root, parent, dialog, content, creationId, token, parentName, parentUserId, parentUserAvatar } = reply
        const createdAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
        const newComment = {
            replyUser: {
                userBio: '',
                userAvatar: parentUserAvatar || '/img/slience.jpg',
                userDefault: {
                    userId: parentUserId,
                    userName: parentName || '',
                },
            },
            secondComment: {
                commentUser: {
                    userBio: '',
                    userAvatar: loginUser ? loginUser.avatar : '/img/slience.jpg',
                    userDefault: {
                        userId: loginUser ? loginUser.id : -1,
                        userName: loginUser ? loginUser.name : '',
                    },
                },
                comment: {
                    commentId: 0,
                    content: content,
                    root: root,
                    parent: parent,
                    dialog: dialog,
                    media: "",
                    creationId: creationId,
                    userId: loginUser ? loginUser.id : -1,
                    createdAt: createdAt,
                },
            },
        }

        const ok = await publishComment(content, root, parent, dialog, creationId, createdAt, token)
        if (!ok) return;
        setTextPrompt({ text: "发布成功", isOpen: true })
        pushComment(newComment)
        const initialState = {
            content: null,
            root: -1,
        }
        handleReplyField(initialState)
        updateSubCount(root, subCount + 1)
    }

    useEffect(() => {
        getLoginUser()
            .then((result) => setUser(result))
            .catch((error) => console.log("getLoginUser error " + error))
    }, [])

    return (
        <>
            {textPrompt.isOpen && <TextPrompt text={textPrompt.text} setOpen={setPromptOpen} />}
            <div className="self-reply">
                <div className="comment-one" style={{ pointerEvents: 'none' }}>
                    <Avatar src={loginUser ? loginUser.avatar : '/img/slience.jpg'} height="56px" width="56px" />
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
        </>
    );
}

const Avatar = ({ userId, src, height, width }) => <Link href={`/space/${userId}`} target="_blank" style={{
    display: 'block',
    cursor: 'pointer',
    position: 'relative',
    height: height,
    width: width,
    clipPath: 'circle(50%)',
}}>
    <Image src={src || "/img/slience.jpg"} quality={100} fill objectFit="cover" alt="" />
</Link>

export default CommentBox;