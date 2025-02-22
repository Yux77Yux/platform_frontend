'use client'

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./space-user.styles.scss";

import Modal from "@/src/client-components/modal-no-redirect/modal.component"

import { Status, reportInfo } from "@/src/tool/review"


const SpaceUser = (props) => {
    const { user, master } = props;
    const { userAvatar, userDefault, userBio } = user;
    const { userName, userId } = userDefault;

    const avatar = userAvatar ? userAvatar : "/img/slience.jpg"

    const [isOpen, setOpen] = useState(false)
    const [report, setReport] = useState({
        detail: "",
        id: userId,
    })

    const reportUser = useCallback(() => {
        if (!report.detail) return
        reportInfo(Status.USER, report.id, report.detail)
    }, [report])

    useEffect(() => {
        setReport((prev) => ({ ...prev, id: userId }))
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
            <span className="space-bio">{userBio === "" ? "userBio" : userBio}</span>
            {!master && <button className="space-follow">关注</button>}
            {!master && <button className="space-review-box">···</button>}
            {!master && <button className="space-review" onClick={() => setOpen(true)}>举报</button >}
            {isOpen && <Modal setOpen={setOpen}>
                <div className="report-user">
                    <h4 className="title">个人信息举报</h4>
                    {/* <fieldset>
                            <legend>举报内容</legend>
                            <ul>
                                <li><label><input type="checkbox" /><span></span> 头像违规</label></li>
                                <li><label><input type="checkbox" /><span></span> 昵称违规</label></li>
                                <li><label><input type="checkbox" /><span></span> 签名违规</label></li>
                            </ul>
                        </fieldset>

                        <fieldset>
                            <legend>举报理由</legend>
                            <ul>
                                <li><label><input type="checkbox" /><span></span> 色情低俗</label></li>
                                <li><label><input type="checkbox" /><span></span> 不实信息</label></li>
                                <li><label><input type="checkbox" /><span></span> 人身攻击</label></li>
                                <li><label><input type="checkbox" /><span></span> 赌博诈骗</label></li>
                            </ul>
                        </fieldset> */}


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