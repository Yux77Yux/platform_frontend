'use client';
import "./comment.scss"
import { Comments } from './comments'

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { getCookie } from "cookies-next";

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
const deleteComment = async (commentId) => {
    try {
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

// 举报
const reportComment = (id, detail) => {
    reportInfo(Status.COMMENT, id, detail)
}

const CommentBox = () => {
    const creation = useParams()
    const creationId = creation.creationId

    const [count, setCount] = useState(0)

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
            console.log(result)

            return result
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
            console.log(result)

            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }, [])

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

    return <div className="comment-box">
        <div className="h2">
            <h2 style={{ display: 'inline-block' }}>评论</h2>
            <span style={{ margin: '5px 0 0 8px', color: 'rgb(162, 166, 172)', }}>
                {Comments.length}
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
    </div>
}

// 一级评论列表
const TopCommentList = ({ handleReplyField, commentOne, reply }) => {
    const [isHover, setIsHover] = useState(false);

    const root = commentOne.id
    const parent = root
    const dialog = -1
    const parentName = commentOne.name

    const getSecondComments = useCallback(async (creationId, root, page) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/watch/comments/seconds/${creationId}/${root}/${page}`,
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

    const setReplyFields = useCallback(() => {
        handleReplyField({
            root: root,
            parent: parent,
            dialog: dialog,
            parentName: parentName,
            content: null,
        })
    }, [handleReplyField, root, parent, dialog, parentName])

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
                    <button className={`option ${isHover && "show"}`}>···</button>
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
    const secondComments = Comments.filter(val => val.root === commentOne.id);
    const [open, setOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 10; // 每页显示的评论数量

    // 计算当前页显示的评论
    const startIndex = (currentPage - 1) * commentsPerPage;
    const currentComments = secondComments.slice(startIndex, startIndex + commentsPerPage);

    // 计算总页数
    const totalPages = Math.ceil(secondComments.length / commentsPerPage);

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
            ))
            }
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
                    <button className={`option ${isHovered && "show"}`}>···</button>
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