/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import "./page.scss";

import { Comments } from './comments'

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

const Page = () => {
    const [info, setInfo] = useState({
        content: '',
        root: 0,    // 楼层id
        parent: 0,  // 对话对象
        dialog: 0,  // 第一个二级评论
        like: false,
        saves: false,
    })

    const [reply, setReply] = useState({
        content: '',
        root: -1,    // 楼层id
        parent: -1,  // 对话对象
        dialog: -1,  // 第一个二级评论
    })

    const recommends = [
        {
            src: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5%2F%5B+%5D%2F1-CATACLYSM+-+%E6%9A%97%E5%BD%B1%E6%A0%BC%E6%96%97+2+%5BEdit+GMV%5D-480P+%E6%B8%85%E6%99%B0-AVC.Cover.jpg",
            title: "暗影格斗 2 [Edit GMV]", views: 568, author: "小品漫剪"
        },
        {
            src: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5%2F%E7%9A%87%E5%A5%B3%E5%8F%91%E7%8E%B0%E7%9C%9F%E6%83%B3%EF%BC%8C%E5%B8%8C%E5%BE%B7%E5%B0%B1%E6%98%AF%E6%9A%97%E5%BD%B1%E5%A4%A7%E4%BA%BA%EF%BC%8C%E5%BD%BB%E5%BA%95%E6%85%8C%E4%BA%86%E2%80%A6%2F1-%E7%9A%87%E5%A5%B3%E5%8F%91%E7%8E%B0%E7%9C%9F%E6%83%B3%EF%BC%8C%E5%B8%8C%E5%BE%B7%E5%B0%B1%E6%98%AF%E6%9A%97%E5%BD%B1%E5%A4%A7%E4%BA%BA%EF%BC%8C%E5%BD%BB%E5%BA%95%E6%85%8C%E4%BA%86%E2%80%A6-480P+%E6%B8%85%E6%99%B0-AVC.Cover.jpg",
            title: "暗影的圣剑被嘲笑为小蚯蚓，起身后直接吓呆公主···", views: 5114, author: "日推动漫"
        },
        {
            src: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5%2F%E4%BD%A0%E5%B0%8F%E6%97%B6%E5%80%99%E7%9A%84%E5%85%84%E5%BC%9F%E9%95%BF%E5%A4%A7%E4%BA%86...%E2%80%9D%2F11-%E2%80%9C%E9%98%BF%E5%B0%BC%E4%BA%9A%E8%A2%AB%E5%87%B6%E4%BA%86%EF%BC%8C%E8%A6%81%E7%A6%BB%E5%AE%B6%E5%87%BA%E8%B5%B0%E2%80%9D-480P+%E6%B8%85%E6%99%B0-AVC.Cover.jpg",
            title: "阿尼亚被凶了，要离家出走", views: 875, author: "已将很"
        },
        {
            src: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5%2F%E6%9A%97%E5%BD%B1%E5%A4%A7%E4%BA%BA%E7%9A%84%E9%80%80%E4%BC%91%E7%94%9F%E6%B4%BB%2F1-%E6%9A%97%E5%BD%B1%E5%A4%A7%E4%BA%BA%E7%9A%84%E9%80%80%E4%BC%91%E7%94%9F%E6%B4%BB-480P+%E6%B8%85%E6%99%B0-AVC.jpg",
            title: "暗影大人的退休生活", views: 8335, author: "猫羽雫"
        },
        {
            src: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5%2F%E5%86%8D%E6%AC%A1%E7%9B%B8%E9%81%87%EF%BC%8C%E7%B2%89%E6%AF%9B%E5%BE%97%E7%9F%A5%E7%9C%9F%E7%9B%B8%EF%BC%8C%E6%83%B3%E8%A6%81%E8%BF%BD%E9%9A%8F%E6%9A%97%E5%BD%B1%EF%BC%8C%E6%9A%97%E5%BD%B1%E5%8D%B4%E4%B8%8D%E8%BE%9E%E8%80%8C%E5%88%AB%EF%BC%8C%E7%B2%89%E6%AF%9B%E5%BD%BB%E5%BA%95%E7%A0%B4%E9%98%B2%2F1-%E5%86%8D%E6%AC%A1%E7%9B%B8%E9%81%87%EF%BC%8C%E7%B2%89%E6%AF%9B%E5%BE%97%E7%9F%A5%E7%9C%9F%E7%9B%B8%EF%BC%8C%E6%83%B3%E8%A6%81%E8%BF%BD%E9%9A%8F%E6%9A%97%E5%BD%B1%EF%BC%8C%E6%9A%97%E5%BD%B1%E5%8D%B4%E4%B8%8D%E8%BE%9E%E8%80%8C%E5%88%AB%EF%BC%8C%E7%B2%89%E6%AF%9B%E5%BD%BB%E5%BA%95%E7%A0%B4%E9%98%B2-480P+%E6%B8%85%E6%99%B0-AVC.jpg",
            title: "再次相遇，粉毛得知真相，想要追随暗影，暗影却不辞而别，粉毛彻底破防", views: 5675, author: "仞之下_仞下"
        },
    ]

    const handleField = useCallback((key, value) => setInfo((prev) => ({
        ...prev,
        [key]: value,
    })), [])
    const handleReplyField = useCallback((key, value) => setReply((prev) => ({
        ...prev,
        [key]: value,
    })), [])

    // 发表评论
    const publishComment = useCallback(async (content, root, parent, dialog) => {
        try {
            const response = await fetch("http://localhost:8080/api/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),  // 将表单数据作为 JSON 发送
            });
        } catch (error) {
            console.log(error)
        }
    }, []);

    // 删除评论
    const deleteComment = useCallback(async (commentId, root, parent, dialog) => {
        try {
            const response = await fetch("http://localhost:8080/api/comment", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),  // 将表单数据作为 JSON 发送
            });
        } catch (error) {
            console.log(error)
        }
    }, []);

    // 举报
    const reportInfo = useCallback(async (type, id, detail, userId) => {
        try {
            const response = await fetch("http://localhost:8080/api/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),  // 将表单数据作为 JSON 发送
            });
        } catch (error) {
            console.log(error)
        }
    }, []);

    const videoInfo = {
        title: '只是个胜利结算动画而已',
        src: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media/%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5/%E5%8F%AA%E6%98%AF%E4%B8%AA%E8%83%9C%E5%88%A9%E7%BB%93%E7%AE%97%E5%8A%A8%E7%94%BB%E8%80%8C%E5%B7%B2/1-%E5%8F%AA%E6%98%AF%E4%B8%AA%E8%83%9C%E5%88%A9%E7%BB%93%E7%AE%97%E5%8A%A8%E7%94%BB%E8%80%8C%E5%B7%B2-480P%20%E6%B8%85%E6%99%B0-AVC.mp4',
        views: "36.7万",
        time: '2023-10-20 07:28:18',
        likes: 3442,
        saves: 488,
        bio: '番名：想要成为影之实力者',
    }

    return (
        <>
            <div className="creation-left">
                <div className="creation-left-title">{videoInfo.title}</div>
                <div className="creation-additional-info">
                    <span className="views">播放数：{videoInfo.views}</span>
                    <span className="time">{videoInfo.time}</span>
                </div>
                <div className="video-player">
                    <video className="video-element" autoPlay={false} controls>
                        <source src="https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media/%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5/%E5%8F%AA%E6%98%AF%E4%B8%AA%E8%83%9C%E5%88%A9%E7%BB%93%E7%AE%97%E5%8A%A8%E7%94%BB%E8%80%8C%E5%B7%B2/1-%E5%8F%AA%E6%98%AF%E4%B8%AA%E8%83%9C%E5%88%A9%E7%BB%93%E7%AE%97%E5%8A%A8%E7%94%BB%E8%80%8C%E5%B7%B2-480P%20%E6%B8%85%E6%99%B0-AVC.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="user-options">
                    <span className="likes">
                        <Image src="/img/like.png" height={40} width={40} quality={100} alt="" />
                        <span style={{ position: 'relative', marginLeft: "20px" }}>1000</span>
                    </span>
                    <span className="saves">
                        <Image src="/img/save.png" height={40} width={40} quality={100} alt="" />
                        <span style={{ position: 'relative', marginLeft: "20px" }}>1178</span>
                    </span>
                </div>
                <div ><span className="bio">{videoInfo.bio}</span></div>
                <div className="comment-box">
                    <div className="h2">
                        <h2 style={{ display: 'inline-block' }}>评论</h2>
                        <span style={{ margin: '5px 0 0 8px', color: 'rgb(162, 166, 172)', }}>15</span>
                    </div>

                    {/* 评论区开始 */}
                    <div className="comments-domain" style={{ marginTop: '20px', borderBottom: '0' }}>
                        <div className="comment-one" style={{ pointerEvents: 'none' }}>
                            <Avatar src="/img/slience.jpg" height="56px" width="56px" />
                        </div>
                        <div className="comment-two">
                            <div
                                contentEditable="true"
                                dangerouslySetInnerHTML={{ __html: info.content }}
                                onInput={(event) => handleField("content", event.target.value)}
                                className="editor-comment"></div>
                            <div className="publish-btn">
                                <button className="btn">发布</button>
                            </div>
                        </div>
                    </div>
                    {Comments.filter(value => value.parent === value.root && value.root === 0).map((commentOne, i) => (
                        <div className="comments-domain" key={i}>
                            <div className="comment-one">
                                <Avatar src="/img/slience.jpg" height="56px" width="56px" />
                            </div>
                            <div className="comment-two" >
                                <div className="name"><span>{commentOne.name}</span></div>
                                <div className="content">{commentOne.content}</div>
                                <div className="additional">
                                    <span className="time">{commentOne.time}</span>
                                    <button className="reply"
                                        onClick={
                                            () => {
                                                handleReplyField("root", commentOne.id);
                                                handleReplyField("parent", commentOne.id);
                                                handleReplyField("dialog", -1);
                                            }}
                                    >回复</button>
                                    <button className="option">···</button>
                                </div>

                                {/* 二级评论 */}
                                {Comments.filter(val => val.root === commentOne.id).map((comment, j) => (
                                    <div className="comments-second-domain" key={j}>
                                        <div className="comment-second-one">
                                            <Avatar src="/img/slience.jpg" height="36px" width="36px" />
                                        </div>
                                        <div className="comment-second-two">
                                            <div className="second-speak">
                                                <span className="name">
                                                    <Link href="/" target="_blank"
                                                        style={{ cursor: 'pointer', fontSize: 'inherit',color:'black' }}>
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
                                                    onClick={
                                                        () => {
                                                            handleReplyField("root", comment.root);
                                                            handleReplyField("parent", comment.id);
                                                            handleReplyField("dialog", comment.dialog);
                                                        }}
                                                >回复</button>
                                                <button className="option">···</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {commentOne.id === reply.root && <SelfSpeak reply={reply} handleReplyField={handleReplyField} />}
                            </div>
                        </div>
                    ))}
                </div>
            </div >
            <div className="creation-right">
                <div className="creation-right-avatar-box">
                    <span className="avatar-circle">
                        <Image src="/img/slience.jpg" fill style={{ objectFit: 'cover' }} alt=""></Image>
                    </span>
                    <div className="user-name-box">
                        <span className="user-name">伊江痕</span>
                        <button className="followbtn">+ 关注 89</button>
                    </div>
                </div>
                <ul className="creation-right-list-box">
                    <h3 style={{ position: 'relative', marginBottom: '20px' }}>相似视频</h3>
                    {recommends.map((value, i) => (
                        <li className="creation-right-item" key={i}>
                            <div className="item-cover">
                                <Image src={value.src}
                                    alt="" fill style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="item-info-box">
                                <div className="item-title">{value.title}</div>
                                <div className="item-author-name">UP：{value.author}</div>
                                <div className="item-views">播放数： {value.views}</div>
                            </div>
                        </li>
                    ))}

                </ul>
            </div>
        </>
    );
}

const SelfSpeak = ({ reply, handleReplyField }) => (
    <div className="self-reply">
        <div className="comment-one" style={{ pointerEvents: 'none' }}>
            <Avatar src="/img/slience.jpg" height="56px" width="56px" />
        </div>
        <div className="comment-two">
            <div
                contentEditable="true"
                dangerouslySetInnerHTML={{ __html: reply.content }}
                onInput={(event) => handleReplyField("content", event.target.value)}
                className="editor-comment"></div>
            <div className="publish-btn">
                <button className="btn">发布</button>
            </div>
        </div>
    </div>
)

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

export default Page;