'use client'

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./space-user.styles.scss";

import Modal from "@/src/client-components/modal-no-redirect/modal.component"

import { Type, reportInfo } from "@/src/tool/review"
import { User_Status } from "@/src/tool/user";
import { followUser, cancelFollow, existFollowee } from "@/src/tool/space";

const SpaceUser = (props) => {
    const { user, master } = props;
    const { userAvatar, userDefault, userBio, userStatus } = user;
    const { userName, userId } = userDefault;

    const avatar = userAvatar ? userAvatar : "/img/slience.jpg"

    const [exist, setExist] = useState(false)
    const [isOpen, setOpen] = useState(false)
    const [report, setReport] = useState({
        detail: "",
        id: userId,
    })

    const reportUser = useCallback(async() => {
        if (!report.detail) return
        reportInfo(Type.USER, report.id, report.detail)
    }, [report])

    const followUserHandler = useCallback(async() => {
        const ok = await followUser(userId)
        if(ok){
            setExist(!exist)
        }
    }, [userId,exist])

    const cancelFollowUserHandler = useCallback(async() => {
        const ok = await cancelFollow(userId)
        if(ok){
            setExist(!exist)
        }
    }, [userId,exist])

    useEffect(() => {
        setReport((prev) => ({ ...prev, id: userId }))
    }, [userId])

    useEffect(() => {
        (async () => {
            const exist = await existFollowee(userId)
            setExist(exist)
        })()
    }, [userId])

    return (
        <>
            <Link href={`/space/${userId}/setting`} className="space-avatar" style={{
                pointerEvents: master ? "auto" : "none",
            }}>
                <Image src={avatar}
                    id="user-avatar"
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={100}
                    alt=""
                />
                {master && <span className="hide">更换头像</span>}
            </Link>
            <span className="space-name">{userName === "" ? "今州皇帝" : userName}</span>
            <span className="space-bio">{userBio === "" ? "" : userBio}</span>
            {(User_Status.LIMITED != userStatus && User_Status.DELETE != userStatus)
                ? <>
                    {!master && <>
                        {!exist
                            ? <button className="space-follow" onClick={followUserHandler}>关注</button>
                            : <button className="space-follow-cancel" onClick={cancelFollowUserHandler}>已关注</button>}
                    </>}
                    {!master && <button className="space-review-box">···</button>}
                    {!master && <button className="space-review" onClick={() => setOpen(true)}>举报</button >}
                </>
                : master && <div style={{ position: 'absolute', fontSize: '20px', color: 'black', bottom: '0px' }}>
                    用户特殊状态
                </div>}
            {isOpen && <Modal setOpen={setOpen}>
                <div className="report-user">
                    <h4 className="title">个人信息举报</h4>

                    <div className="detail">
                        <textarea
                            value={report.detail}
                            onChange={(e) => setReport((prev) => ({ ...prev, detail: e.target.value }))}
                            placeholder="请输入举报理由，请简要描述"
                        />
                    </div>

                    <div className="btns">
                        <button className="btn cancel" onClick={() => setOpen(false)}>取消</button>
                        <button className="btn confirm" disabled={report.detail.trim().length <= 0} onClick={reportUser}>确定</button>
                    </div>
                </div>
            </Modal>}
        </>
    );
}

export default SpaceUser;