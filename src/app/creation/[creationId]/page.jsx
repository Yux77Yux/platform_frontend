/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import "./page.scss";
import { getAddress } from "@/src/tool/getIp"
import { getLoginUserId, getToken, getLoginUserRole } from "@/src/tool/getLoginUser"
import { Type, reportInfo } from "@/src/tool/review"
import { Api_Status } from "@/src/tool/api-status"
import { followUser, cancelFollow, existFollowee } from "@/src/tool/space";
import { Creation_Status } from "@/src/tool/creation"
import { User_Role } from "@/src/tool/user"
import { cancelCollections } from "@/src/tool/interaction"
import { formatTimestamp } from "@/src/tool/formatTimestamp"
import { formatCount } from "@/src/tool/formatNumber"
import { fetchSimilarCreaiton } from "@/src/tool/get"

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import CommentBox from "@/src/client-components/comment/comment"
import TextPrompt from "@/src/client-components/prompt/TextPrompt"
import MenuPortal from "@/src/client-components/menu-portal/menu-portal"
import Modal from "@/src/client-components/modal-no-redirect/modal.component"
import Link from "next/link";

const Page = () => {
    const router = useRouter()
    const [textPrompt, setTextPrompt] = useState({
        isOpen: false,
        text: ""
    })
    const setTextPromptOpen = () => setTextPrompt((prev) => ({ ...prev, isOpen: true }))

    const timerRef = useRef(null)
    const [isPageLoading, setPageLoading] = useState(true)
    const triggerRef = useRef()
    const creationParams = useParams()
    const { creationId } = creationParams
    const [token, setToken] = useState(null)
    const stableCreationId = useMemo(() => creationId, [creationId]);

    const [interaction, setInteraction] = useState({
        isLike: false,
        isCollection: false,
    })

    const [loginId, setLoginId] = useState()
    const [isHover, setHover] = useState(false)

    const [videoInfo, setVideoInfo] = useState({
        title: '只是个胜利结算动画而已',
        src: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media/%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5/%E5%8F%AA%E6%98%AF%E4%B8%AA%E8%83%9C%E5%88%A9%E7%BB%93%E7%AE%97%E5%8A%A8%E7%94%BB%E8%80%8C%E5%B7%B2/1-%E5%8F%AA%E6%98%AF%E4%B8%AA%E8%83%9C%E5%88%A9%E7%BB%93%E7%AE%97%E5%8A%A8%E7%94%BB%E8%80%8C%E5%B7%B2-480P%20%E6%B8%85%E6%99%B0-AVC.mp4',
        views: "36",
        time: '2022-10-20 07:28:18',
        likes: 3442,
        saves: 488,
        bio: '番名：想要成为影之实力者',
    })
    const [tag, setTag] = useState()
    const [author, setAuthor] = useState({
        userName: "伊江痕",
        userBio: "",
        userId: "",
        userAvatar: "/img/slience.jpg",
        followers: 0,
    })

    // 举报
    const [report, setReport] = useState({
        detail: "",
        id: creationId,
        isOpen: false,
    })
    const setReportOpen = (state) => {
        setReport((prev) => ({ ...prev, isOpen: state }))
    }

    const [recommends, setRecommends] = useState()

    // 初始化相似视频

    // 初始化视频信息
    const fetchCreation = useCallback(async (creationId) => {
        try {
            const ip = await getAddress()
            const response = await fetch(`http://localhost:8080/api/watch/${creationId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Forwarded-For": ip,
                }
            });
            if (!response.ok) {
                console.log("error: " + response.status)
                return null
            }

            const result = await response.json()
            const status = result.msg.status
            if (status != Api_Status.SUCCESS) return false
            return result
        } catch (error) {
            console.log(error)
            return null;
        }
    }, [])

    // 初始化用户的动作行为
    const fetchInteraction = useCallback(async (creationId, token) => {
        const body = {
            accessToken: {
                value: token
            },
            base: {
                creationId: creationId,
            },
        }
        try {
            const response = await fetch("http://localhost:8080/api/interaction", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            })
            if (!response.ok) {
                console.log("api/interaction error")
                return false
            }
            const result = await response.json()
            const status = result.msg.status
            if (status != Api_Status.SUCCESS && status != Api_Status.PENDING) return false
            return result
        } catch (error) {
            console.log(error)
            return false
        }
    }, [])

    const cancelLike = useCallback(async (creationId, token) => {
        const body = {
            accessToken: {
                value: token
            },
            base: {
                creationId: creationId,
            },
        }
        try {
            const response = await fetch("http://localhost:8080/api/interaction/like/cancel", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            })
            if (!response.ok) {
                console.log("api/interaction/like/cancel error")
                return false
            }
            const result = await response.json()
            const status = result.msg.status
            if (status != Api_Status.SUCCESS && status != Api_Status.PENDING) return false
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }, [])

    const clickCollect = useCallback(async (creationId, token) => {
        const body = {
            accessToken: {
                value: token
            },
            base: {
                creationId: creationId,
            },
        }
        try {
            const response = await fetch("http://localhost:8080/api/interaction/collection", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            })
            if (!response.ok) {
                console.log("api/interaction/collection error")
                return false
            }
            const result = await response.json()
            const status = result.msg.status
            if (status != Api_Status.SUCCESS && status != Api_Status.PENDING) return false
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }, [])

    const clickLike = useCallback(async (creationId, token) => {
        const body = {
            accessToken: {
                value: token
            },
            base: {
                creationId: creationId,
            },
        }
        try {
            const response = await fetch("http://localhost:8080/api/interaction/like", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            })
            if (!response.ok) {
                console.log("api/interaction/like error")
                return false
            }
            const result = await response.json()
            console.log(result)
            const status = result.msg.status
            if (status != Api_Status.SUCCESS && status != Api_Status.PENDING) return false
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }, [])

    const handleLikeEvent = useCallback(async () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current) // 清除上一次的定时器
        }

        timerRef.current = setTimeout(async () => {
            const likes = videoInfo.likes
            const isLike = interaction.isLike

            // 立即更新 UI（乐观更新）
            setInteraction((prev) => ({ ...prev, isLike: !isLike }));
            setVideoInfo((prev) => ({
                ...prev,
                likes: isLike ? likes - 1 : likes + 1,
            }));

            const result = isLike
                ? await cancelLike(creationId, token)
                : await clickLike(creationId, token);

            if (!result) {
                // 请求失败，恢复快照，并提示重试
                setInteraction((prev) => ({ ...prev, isLike: isLike }));
                setVideoInfo((prev) => ({ ...prev, likes: isLike }));
                setTextPrompt({ text: "请重试！", isOpen: true })
            }
        }, 300)
    }, [token, videoInfo.likes, interaction.isLike, creationId, cancelLike, clickLike])

    const handleCollectEvent = useCallback(async () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current) // 清除上一次的定时器
        }

        timerRef.current = setTimeout(async () => {
            const saves = videoInfo.saves
            const isCollection = interaction.isCollection

            setInteraction((prev) => ({ ...prev, isCollection: !isCollection }))
            setVideoInfo((prev) => ({ ...prev, saves: isCollection ? saves - 1 : saves + 1 }))

            const creationIds = [{ creationId: creationId }]
            const result = isCollection
                ? await cancelCollections(creationIds, token)
                : await clickCollect(creationId, token)
            if (!result) {
                // 失败
                setInteraction((prev) => ({ ...prev, isCollection: isCollection }))
                setVideoInfo((prev) => ({ ...prev, saves: saves }))
                setTextPrompt({ text: "请重试！", isOpen: true })
            }
        }, 300)
    }, [token, videoInfo.saves, interaction.isCollection, creationId, clickCollect])

    const reportCreation = useCallback(async () => {
        reportInfo(Type.CREATION, report.id, report.detail)
    }, [report])

    // 获取视频
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchCreation(creationId);
                setPageLoading(false);
                console.log(result)
                if (!result) {
                    console.log(result)
                    return;
                }

                const { creationInfo, creationUser } = result;
                if (!creationInfo || !creationUser) return;
                const { creation, creationEngagement, category } = creationInfo;
                const { uploadTime, baseInfo } = creation;
                const { authorId, bio, src, thumbnail, title, status, duration } = baseInfo;
                const { views, saves, likes, publishTime } = creationEngagement;
                const { categoryId, name, parent } = category;

                const { userDefault, userAvatar, userBio, followers } = creationUser;
                const { userId, userName } = userDefault;

                let loginUserId;
                try {
                    loginUserId = await getLoginUserId();
                } catch (error) {
                    console.log(error);
                    return;
                }

                let role = User_Role.GUEST;
                try {
                    const userRole = await getLoginUserRole();
                    if (userRole) {
                        role = userRole;
                    }
                } catch (error) {
                    console.log(error);
                    return;
                }

                if (status != Creation_Status.PUBLISHED) {
                    if (userId != loginUserId) {
                        if (role != User_Role.ADMIN && role != User_Role.SUPER_ADMIN) {
                            router.replace("/creation");
                            return;
                        }
                    }
                }

                const video = {
                    uploadTime: formatTimestamp(uploadTime),
                    authorId: authorId,
                    bio: bio,
                    src: src,
                    thumbnail: thumbnail,
                    title: title,
                    status: status,
                    duration: duration,
                    views: views,
                    saves: saves,
                    likes: likes,
                    publishTime: formatTimestamp(publishTime),
                };

                setVideoInfo((prev) => ({ ...prev, ...video }));
                setTag({ categoryId: categoryId, name: name, parent: parent });
                setAuthor({
                    userName: userName,
                    userBio: userBio,
                    userId: userId,
                    userAvatar: userAvatar,
                    followers: followers,
                });
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
        setReport((prev) => ({ ...prev, id: creationId }));
    }, [router, creationId, loginId, fetchCreation]);


    // 获取交互
    useEffect(() => {
        const execute = async () => {
            fetchInteraction(stableCreationId, token)
                .then((result) => {
                    if (!result) return;
                    const { actionTag } = result;
                    let isLike = false
                    let isCollection = false
                    if (actionTag & 2) {
                        isLike = true
                    }
                    if (actionTag & 4) {
                        isCollection = true
                    }

                    setInteraction({
                        isCollection: isCollection,
                        isLike: isLike,
                    })
                })
                .catch((error) => console.log("error: " + error))
        }
        execute()

    }, [token, stableCreationId, fetchInteraction])

    useEffect(() => {
        getToken()
            .then((token) => setToken(token))
    }, [])

    useEffect(() => {
        (async () => {
            const result = await fetchSimilarCreaiton(creationId)
            const { cards } = result
            if (!cards) return
            let videos = cards.map((info) => {
                const { creation, creationEngagement, timeAt, user } = info
                const { baseInfo } = creation
                return ({
                    ...baseInfo,
                    ...creationEngagement,
                    user,
                    timeAt: timeAt,
                })
            }, [])
            setRecommends(() => videos)
        })()
    }, [creationId])

    if (isPageLoading) return null;

    return (
        <>
            {textPrompt.isOpen && <TextPrompt text={textPrompt.text} setOpen={setTextPromptOpen} />}
            <div className="creation-left">
                <div className="creation-left-title">{videoInfo.title}</div>
                <div className="creation-additional-info">
                    <span className="video-icon"></span><span className="views">{videoInfo.views}</span>
                    <span className="time">{videoInfo.uploadTime || videoInfo.time}</span>
                </div>
                <div className="video-player">
                    <video key={videoInfo.src} className="video-element" autoPlay={false} controls>
                        <source src={videoInfo.src} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="user-options">
                    <span className="likes">
                        <Image src={interaction.isLike ? "/img/like-active.png" : "/img/like.png"}
                            onClick={handleLikeEvent}
                            height={40} width={40} quality={100} alt="" />
                        <span className="text">{videoInfo.likes}</span>
                    </span>
                    <span className="saves">
                        <Image src={interaction.isCollection ? "/img/save-active.png" : "/img/save.png"}
                            onClick={handleCollectEvent}
                            height={40} width={40} quality={100} alt="" />
                        <span className="text">{videoInfo.saves}</span>
                    </span>
                    {loginId === author.userId && <span className="master">
                        <button className="modify">编辑稿件</button>
                    </span>}
                    <span className="more-symbol" ref={triggerRef}
                        onMouseLeave={() => setHover(false)}
                        onMouseEnter={() => setHover(true)}>
                        {isHover && (
                            <MenuPortal targetRef={triggerRef} >
                                <div className="more-symbol-button-options">
                                    <button className="btn" onClick={() => setReportOpen(true)}>举报稿件</button>
                                </div>
                            </MenuPortal>
                        )}
                    </span>
                    {report.isOpen && <Modal setOpen={setReportOpen}>
                        <div className="report-creation">
                            <h4 className="title">作品信息举报</h4>
                            <div className="detail">
                                <textarea
                                    value={report.detail}
                                    onChange={(e) => setReport((prev) => ({ ...prev, detail: e.target.value }))}
                                    placeholder="请输入举报理由，请简要描述"
                                />
                            </div>

                            <div className="btns">
                                <button className="btn cancel" onClick={() => setReportOpen(false)}>取消</button>
                                <button className="btn confirm" disabled={report.detail.trim().length <= 0} onClick={reportCreation}>确定</button>
                            </div>
                        </div>
                    </Modal>}
                </div>
                <div ><span className="bio">{videoInfo.bio}</span></div>
                <CommentBox />
            </div >
            <div className="creation-right">
                <div className="creation-right-avatar-box">
                    <span className="avatar-circle" onClick={() => window.open(`/space/${author.userId}`)}>
                        <Image src={author.userAvatar} fill style={{ objectFit: 'cover' }} alt=""></Image>
                    </span>
                    <div className="user-name-box">
                        <span className="user-name" onClick={() => window.open(`/space/${author.userId}`)}>{author.userName}</span>
                        <div className="user-bio">{author.userBio}</div>
                        <FollowBtns userId={author.userId} followers={author.followers} />
                    </div>
                </div>
                <ul className="creation-right-list-box">
                    <h3 style={{ position: 'relative', marginBottom: '20px' }}></h3>
                    {recommends && recommends.map((video) => (
                        <li className="creation-right-item" key={video.creationId}>
                            <div className="item-cover" onClick={() => window.open(`/creation/${video.creationId}`, "_blank")}>
                                <Image src={video.thumbnail}
                                    alt="" fill style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="item-info-box">
                                <div className="item-title" onClick={() => window.open(`/creation/${video.creationId}`, "_blank")}>{video.title}</div>
                                <Link className="item-author-name" target="_blank" href={`/space/${video.user.userId}`}>UP：{video.user.userName}</Link>
                                <div className="item-views">播放数： {video.views}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

const FollowBtns = ({ userId, followers }) => {
    const [exist, setExist] = useState(false)
    const followUserHandler = useCallback(async () => {
        const ok = await followUser(userId)
        if (ok) {
            setExist(!exist)
        }
    }, [userId, exist])

    const cancelFollowUserHandler = useCallback(async () => {
        const ok = await cancelFollow(userId)
        if (ok) {
            setExist(!exist)
        }
    }, [userId, exist])

    useEffect(() => {
        (async () => {
            const exist = await existFollowee(userId)
            setExist(exist)
        })()
    }, [userId])

    return <>
        {!exist
            ? <button className="followbtn" onClick={followUserHandler}>关注 {formatCount(followers)}</button>
            : <button className="followbtn-cancel" onClick={cancelFollowUserHandler}>已关注 {formatCount(followers)}</button>}
    </>
}

export default Page;