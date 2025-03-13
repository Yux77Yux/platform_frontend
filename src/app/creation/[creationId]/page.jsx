/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import "./page.scss";
import { getAddress } from "@/src/tool/getIp"
import { getLoginUserId, getToken, getLoginUserRole } from "@/src/tool/getLoginUser"
import { Type, reportInfo } from "@/src/tool/review"
import { Api_Status } from "@/src/tool/api-status"
import { Creation_Status } from "@/src/tool/creation"
import { User_Role } from "@/src/tool/user"
import { cancelCollections } from "@/src/tool/interaction"
import { formatTimestamp } from "@/src/tool/formatTimestamp"

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import CommentBox from "@/src/client-components/comment/comment"
import TextPrompt from "@/src/client-components/prompt/TextPrompt"
import MenuPortal from "@/src/client-components/menu-portal/menu-portal"
import Modal from "@/src/client-components/modal-no-redirect/modal.component"

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

    const [recommends, setRecommends] = useState([
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
    ])

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

                const { userDefault, userAvatar, userBio } = creationUser;
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
                        <button className="followbtn">+&nbsp;关注 </button>
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

export default Page;