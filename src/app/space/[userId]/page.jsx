'use client'

import { useCallback, useEffect, useState } from "react";
import { useSpace } from "./context";

import VideoList from "@/src/client-components/video-slight-list/VideoList"

import { getAddress } from "@/src/tool/getIp"

import "./page.scss";

export default function Page() {
    const [spaceCreations, setSpaceCreations] = useState({
        type: "PUBLISHED_TIME",
    });

    const [creations, setCreations] = useState({
        count: 0,
        creationInfoGroup: [],
    })

    // user
    const { space } = useSpace()
    const { user } = space
    const { userGender, userBday, userDefault, userUpdatedAt } = user
    const { userId } = userDefault
    const genderText = userGender === "MALE" ? "男" : userGender === "FEMALE" ? "女" : "未设置";


    // const videos = []
    // for (let i = 0; i < creationInfos.length; i++) {
    //     const element = creationInfos[i];
    //     videos[i] = {
    //         thumbnail: element.creation.baseInfo.thumbnail,
    //         url: element.creation.baseInfo.src,
    //         title: element.creation.baseInfo.title,
    //         creationId: element.creation.creationId,
    //         authorId: element.creation.baseInfo.authorId,
    //         author: element.user.userDefault.userName,
    //     }
    // }

    const vvideos = [
        {
            thumbnail: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%9F%A5%E8%AF%86%2F%E6%9E%81%E5%BA%A6%E8%88%92%E9%80%82%EF%BC%81%E6%8B%BF%E6%9D%A5%E6%95%91%E5%91%BD%E7%9A%84%E8%8D%AF%EF%BC%8C%E5%8E%9F%E6%9D%A5%E6%98%AF%E8%BF%99%E6%A0%B7%E5%9C%A8%E8%BA%AB%E4%BD%93%E9%87%8C%E9%87%8A%E6%94%BE%E7%9A%84%2F1-%E8%89%BA%E6%9C%AF%E5%B0%B1%E6%98%AF%E7%88%86%E7%82%B8%EF%BC%9F%E6%89%8B%E6%90%93%E9%BB%91%E7%81%AB%E8%8D%AF%EF%BC%8C%E6%85%A2%E6%94%BE500%E5%80%8D%E7%9C%8B%E7%83%9F%E8%8A%B1%E7%9A%84%E5%8C%96%E5%AD%A6%E5%A5%A5%E7%A7%98%EF%BC%81-480P+%E6%B8%85%E6%99%B0-AVC.Cover.jpg",
            url: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%9F%A5%E8%AF%86%2F%E6%9E%81%E5%BA%A6%E8%88%92%E9%80%82%EF%BC%81%E6%8B%BF%E6%9D%A5%E6%95%91%E5%91%BD%E7%9A%84%E8%8D%AF%EF%BC%8C%E5%8E%9F%E6%9D%A5%E6%98%AF%E8%BF%99%E6%A0%B7%E5%9C%A8%E8%BA%AB%E4%BD%93%E9%87%8C%E9%87%8A%E6%94%BE%E7%9A%84%2F1-%E8%89%BA%E6%9C%AF%E5%B0%B1%E6%98%AF%E7%88%86%E7%82%B8%EF%BC%9F%E6%89%8B%E6%90%93%E9%BB%91%E7%81%AB%E8%8D%AF%EF%BC%8C%E6%85%A2%E6%94%BE500%E5%80%8D%E7%9C%8B%E7%83%9F%E8%8A%B1%E7%9A%84%E5%8C%96%E5%AD%A6%E5%A5%A5%E7%A7%98%EF%BC%81-480P+%E6%B8%85%E6%99%B0-AVC.mp4",
            title: '极度舒适！拿来救命的药，原来是这样在身体里释放的/1-艺术就是爆炸？手搓黑火药，慢放500倍看烟花的化学奥秘！',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%A7%91%E6%8A%80%2Fvision+Pro+%E7%8E%A9%E6%B8%B8%E6%88%8F%E7%9C%9F%E5%AE%9E%E4%BD%93%E9%AA%8C%2F1-vision+Pro+%E7%8E%A9%E6%B8%B8%E6%88%8F%E7%9C%9F%E5%AE%9E%E4%BD%93%E9%AA%8C-480P+%E6%B8%85%E6%99%B0-AVC.jpg",
            url: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%A7%91%E6%8A%80%2Fvision+Pro+%E7%8E%A9%E6%B8%B8%E6%88%8F%E7%9C%9F%E5%AE%9E%E4%BD%93%E9%AA%8C%2F1-vision+Pro+%E7%8E%A9%E6%B8%B8%E6%88%8F%E7%9C%9F%E5%AE%9E%E4%BD%93%E9%AA%8C-480P+%E6%B8%85%E6%99%B0-AVC.mp4",
            title: 'vision Pro 玩游戏真实体验',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%9F%A5%E8%AF%86%2F%E6%97%A5%E5%B8%B8%E7%94%9F%E6%B4%BB%E5%81%A5%E5%BA%B7%E8%AF%9D%E9%A2%98%2F9-%E7%AC%AC10%E9%9B%86-%E5%97%93%E5%AD%90%E7%BA%A2%E8%82%BF%E6%9C%89%E5%A6%99%E6%8B%9B-480P+%E6%B8%85%E6%99%B0-AVC.Cover.jpg",
            url: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%9F%A5%E8%AF%86%2F%E6%97%A5%E5%B8%B8%E7%94%9F%E6%B4%BB%E5%81%A5%E5%BA%B7%E8%AF%9D%E9%A2%98%2F9-%E7%AC%AC10%E9%9B%86-%E5%97%93%E5%AD%90%E7%BA%A2%E8%82%BF%E6%9C%89%E5%A6%99%E6%8B%9B-480P+%E6%B8%85%E6%99%B0-AVC.mp4",
            title: '日常生活健康话题/9-第10集-嗓子红肿有妙招',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%A7%91%E6%8A%80%2F%E6%9C%80%E8%B4%B5%E7%9A%84%E7%BA%A2%E7%B1%B3%EF%BC%8C%E6%83%B3%E5%B9%B2%E7%BF%BB%E5%B0%8F%E7%B1%B3%EF%BC%9F%EF%BC%9F%EF%BC%9F%E7%BA%A2%E7%B1%B3K80+Pro%E5%85%A8%E9%9D%A2%E6%B5%8B%E8%AF%95%E3%80%90%E7%A9%B7%E7%8E%A9%E7%BB%84%E3%80%91%2F1-Magic+V3%E8%AF%84%E6%B5%8B-480P+%E6%B8%85%E6%99%B0-AVC.Cover.jpg",
            url: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%A7%91%E6%8A%80%2F%E6%9C%80%E8%B4%B5%E7%9A%84%E7%BA%A2%E7%B1%B3%EF%BC%8C%E6%83%B3%E5%B9%B2%E7%BF%BB%E5%B0%8F%E7%B1%B3%EF%BC%9F%EF%BC%9F%EF%BC%9F%E7%BA%A2%E7%B1%B3K80+Pro%E5%85%A8%E9%9D%A2%E6%B5%8B%E8%AF%95%E3%80%90%E7%A9%B7%E7%8E%A9%E7%BB%84%E3%80%91%2F1-Magic+V3%E8%AF%84%E6%B5%8B-480P+%E6%B8%85%E6%99%B0-AVC.mp4",
            title: '最贵的红米，想干翻小米？？？红米K80 Pro全面测试',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5%2F%E4%BD%A0%E5%B0%8F%E6%97%B6%E5%80%99%E7%9A%84%E5%85%84%E5%BC%9F%E9%95%BF%E5%A4%A7%E4%BA%86...%E2%80%9D%2F29-%E2%80%9C%E4%B8%8D%E4%BC%9A%E5%BC%80%E6%B1%BD%E6%B0%B4%E7%9A%84%E7%AC%A8miku~%E2%80%9D-480P+%E6%B8%85%E6%99%B0-AVC.Cover.jpg",
            url: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5%2F%E4%BD%A0%E5%B0%8F%E6%97%B6%E5%80%99%E7%9A%84%E5%85%84%E5%BC%9F%E9%95%BF%E5%A4%A7%E4%BA%86...%E2%80%9D%2F29-%E2%80%9C%E4%B8%8D%E4%BC%9A%E5%BC%80%E6%B1%BD%E6%B0%B4%E7%9A%84%E7%AC%A8miku~%E2%80%9D-480P+%E6%B8%85%E6%99%B0-AVC.mp4",
            title: '你小时候的兄弟长大了...”/29-“不会开汽水的笨miku~”',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%BE%8E%E9%A3%9F%2F%E3%80%90%E4%B8%AD%E5%9B%BD%E3%80%91%E3%80%90%E7%BA%AA%E5%BD%95%E7%89%87%E3%80%91%E4%B8%AD%E5%9B%BD%E5%B0%8F%E5%90%83%E7%B3%BB%E5%88%97+Chinese+Snack+Series%2F1-%E8%B4%B5%E5%B7%9E%E5%B0%8F%E5%90%83-480P+%E6%B8%85%E6%99%B0-AVC.Cover.jpg",
            url: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%BE%8E%E9%A3%9F%2F%E3%80%90%E4%B8%AD%E5%9B%BD%E3%80%91%E3%80%90%E7%BA%AA%E5%BD%95%E7%89%87%E3%80%91%E4%B8%AD%E5%9B%BD%E5%B0%8F%E5%90%83%E7%B3%BB%E5%88%97+Chinese+Snack+Series%2F1-%E8%B4%B5%E5%B7%9E%E5%B0%8F%E5%90%83-480P+%E6%B8%85%E6%99%B0-AVC.mp4",
            title: '【中国】【纪录片】中国小吃系列 Chinese Snack Series/1-贵州小吃',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%BE%8E%E9%A3%9F%2F%E7%BE%8E%E9%A3%9F%E7%BA%AA%E5%BD%95%E7%89%87%E3%80%8A%E4%B8%8B%E9%A5%AD%E8%8F%9C%E3%80%8B%E7%AC%AC%E4%B8%80%E5%AD%A3%E4%B8%8A%E9%83%A8+%E5%85%A85%E9%9B%86+1080P%E8%B6%85%E6%B8%85%2F1-%E4%B8%8B%E9%A5%AD%E8%8F%9C+%E7%AC%AC1%E9%9B%86+%E7%BE%8A%E4%B9%B3%E9%A5%BC%E5%A4%B9%E7%81%AB%E8%85%BF%2B%E7%85%8E%E5%B8%A6%E9%B1%BC-%E8%93%9D%E5%85%891080P-480P+%E6%B8%85%E6%99%B0-AVC.Cover.png",
            url: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%BE%8E%E9%A3%9F%2F%E7%BE%8E%E9%A3%9F%E7%BA%AA%E5%BD%95%E7%89%87%E3%80%8A%E4%B8%8B%E9%A5%AD%E8%8F%9C%E3%80%8B%E7%AC%AC%E4%B8%80%E5%AD%A3%E4%B8%8A%E9%83%A8+%E5%85%A85%E9%9B%86+1080P%E8%B6%85%E6%B8%85%2F1-%E4%B8%8B%E9%A5%AD%E8%8F%9C+%E7%AC%AC1%E9%9B%86+%E7%BE%8A%E4%B9%B3%E9%A5%BC%E5%A4%B9%E7%81%AB%E8%85%BF%2B%E7%85%8E%E5%B8%A6%E9%B1%BC-%E8%93%9D%E5%85%891080P-480P+%E6%B8%85%E6%99%B0-AVC.mp4",
            title: '羊乳饼夹火腿+煎带鱼',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5%2F%E3%80%90%E7%82%AE%E5%A7%90+AMV%E3%80%91%E6%88%91%E6%B0%B8%E8%BF%9C%E9%83%BD%E4%BC%9A%E5%AE%88%E6%8A%A4%E5%9C%A8%E4%BD%A0%E7%9A%84%E8%BA%AB%E8%BE%B9%EF%BC%81%2F1-%E6%AD%A3%E7%89%87-480P+%E6%B8%85%E6%99%B0-AVC.Cover.jpg',
            url: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media/%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5/%E3%80%90%E7%82%AE%E5%A7%90%20AMV%E3%80%91%E6%88%91%E6%B0%B8%E8%BF%9C%E9%83%BD%E4%BC%9A%E5%AE%88%E6%8A%A4%E5%9C%A8%E4%BD%A0%E7%9A%84%E8%BA%AB%E8%BE%B9%EF%BC%81/1-%E6%AD%A3%E7%89%87-480P%20%E6%B8%85%E6%99%B0-AVC.mp4",
            title: '【炮姐 AMV】我永远都会守护在你的身边！',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5%2F%5B+%5D%2F3-INCOMING+++X+%E7%BB%AB%E5%B0%8F%E8%B7%AF%E2%80%9C%E7%AD%96%E5%88%92%E8%80%85%E2%80%9D+%5BEdit+AMV%5D-480P+%E6%B8%85%E6%99%B0-AVC.Cover.jpg",
            url: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5%2F%5B+%5D%2F3-INCOMING+++X+%E7%BB%AB%E5%B0%8F%E8%B7%AF%E2%80%9C%E7%AD%96%E5%88%92%E8%80%85%E2%80%9D+%5BEdit+AMV%5D-480P+%E6%B8%85%E6%99%B0-AVC.mp4",
            title: '3-INCOMING   X 绫小路“策划者” [Edit AMV]',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%94%B5%E5%BD%B1%E7%89%87%E6%AE%B5%2F%E5%A4%A9%E8%8A%B1%E6%9D%BF%E7%BA%A7%E5%88%AB%E7%9A%84%E5%9B%BD%E4%BA%A7%E5%96%9C%E5%89%A7%E7%94%B5%E5%BD%B1%EF%BC%8C%E4%B8%8A%E6%98%A0%E5%B7%B2%E7%BB%8F15%E5%B9%B4%EF%BC%8C%E4%BD%86%E4%BE%9D%E6%97%A7%E7%BB%8F%E5%85%B8%2F1-%E5%A4%A9%E8%8A%B1%E6%9D%BF%E7%BA%A7%E5%88%AB%E7%9A%84%E5%9B%BD%E4%BA%A7%E5%96%9C%E5%89%A7%E7%94%B5%E5%BD%B1%EF%BC%8C%E4%B8%8A%E6%98%A0%E5%B7%B2%E7%BB%8F15%E5%B9%B4%EF%BC%8C%E4%BD%86%E4%BE%9D%E6%97%A7%E7%BB%8F%E5%85%B8-480P+%E6%B8%85%E6%99%B0-AVC.jpg',
            url: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%94%B5%E5%BD%B1%E7%89%87%E6%AE%B5%2F%E5%A4%A9%E8%8A%B1%E6%9D%BF%E7%BA%A7%E5%88%AB%E7%9A%84%E5%9B%BD%E4%BA%A7%E5%96%9C%E5%89%A7%E7%94%B5%E5%BD%B1%EF%BC%8C%E4%B8%8A%E6%98%A0%E5%B7%B2%E7%BB%8F15%E5%B9%B4%EF%BC%8C%E4%BD%86%E4%BE%9D%E6%97%A7%E7%BB%8F%E5%85%B8%2F1-%E5%A4%A9%E8%8A%B1%E6%9D%BF%E7%BA%A7%E5%88%AB%E7%9A%84%E5%9B%BD%E4%BA%A7%E5%96%9C%E5%89%A7%E7%94%B5%E5%BD%B1%EF%BC%8C%E4%B8%8A%E6%98%A0%E5%B7%B2%E7%BB%8F15%E5%B9%B4%EF%BC%8C%E4%BD%86%E4%BE%9D%E6%97%A7%E7%BB%8F%E5%85%B8-480P+%E6%B8%85%E6%99%B0-AVC.mp4',
            title: '天花板级别的国产喜剧电影，上映已经15年，但依旧经典',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%94%B5%E5%BD%B1%E7%89%87%E6%AE%B5%2F%E6%9C%AC%E4%BB%A5%E4%B8%BA%E6%98%AF%E7%83%82%E7%89%87%EF%BC%8C%E4%B8%8A%E6%98%A0%E7%AC%AC1%E5%A4%A9%E5%B0%B1%E6%8B%BF5%E4%B8%AA%E5%86%A0%E5%86%9B%EF%BC%8C%E5%A4%A7%E9%B9%8F%E5%AF%BC%E6%BC%94%E7%94%9F%E6%B6%AF%E6%9C%80%E5%A5%BD%E7%9A%84%E7%94%B5%E5%BD%B1%EF%BC%81%E3%80%8A%E4%BF%9D%E4%BD%A0%E5%B9%B3%E5%AE%89%E3%80%8B%2F23-%E9%95%87%E9%95%BF%E6%88%90%E4%B8%BA%E5%BD%93%E5%9C%B0%E2%80%9C%E5%9C%9F%E7%9A%87%E5%B8%9D%E2%80%9D%EF%BC%8C%E4%BB%85%E5%87%A0%E7%99%BE%E4%BA%BA%E7%9C%8B%E8%BF%87%E7%9A%84%E5%AE%9D%E8%97%8F%E7%94%B5%E5%BD%B1%EF%BC%8C%E8%B1%86%E7%93%A38.8%E3%80%8A%E6%A1%83%E6%BA%90%E9%95%87%E3%80%8B-480P+%E6%B8%85%E6%99%B0-AVC.Cover.jpg",
            url: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%94%B5%E5%BD%B1%E7%89%87%E6%AE%B5%2F%E6%9C%AC%E4%BB%A5%E4%B8%BA%E6%98%AF%E7%83%82%E7%89%87%EF%BC%8C%E4%B8%8A%E6%98%A0%E7%AC%AC1%E5%A4%A9%E5%B0%B1%E6%8B%BF5%E4%B8%AA%E5%86%A0%E5%86%9B%EF%BC%8C%E5%A4%A7%E9%B9%8F%E5%AF%BC%E6%BC%94%E7%94%9F%E6%B6%AF%E6%9C%80%E5%A5%BD%E7%9A%84%E7%94%B5%E5%BD%B1%EF%BC%81%E3%80%8A%E4%BF%9D%E4%BD%A0%E5%B9%B3%E5%AE%89%E3%80%8B%2F23-%E9%95%87%E9%95%BF%E6%88%90%E4%B8%BA%E5%BD%93%E5%9C%B0%E2%80%9C%E5%9C%9F%E7%9A%87%E5%B8%9D%E2%80%9D%EF%BC%8C%E4%BB%85%E5%87%A0%E7%99%BE%E4%BA%BA%E7%9C%8B%E8%BF%87%E7%9A%84%E5%AE%9D%E8%97%8F%E7%94%B5%E5%BD%B1%EF%BC%8C%E8%B1%86%E7%93%A38.8%E3%80%8A%E6%A1%83%E6%BA%90%E9%95%87%E3%80%8B-480P+%E6%B8%85%E6%99%B0-AVC.mp4",
            title: '本以为是烂片，上映第1天就拿5个冠军，大鹏导演生涯最好的电影！《保你平安》',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%A7%91%E6%8A%80%2F%E3%80%90%E7%A1%AC%E6%A0%B8%E7%A7%91%E6%99%AE%E3%80%91%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E8%AE%A4%E8%AF%86%E6%98%BE%E5%8D%A1%2F1-%E3%80%90%E7%A1%AC%E6%A0%B8%E7%A7%91%E6%99%AE%E3%80%91%E6%89%8B%E6%9C%BA%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E5%81%9A%E5%A4%9A%E6%91%84%EF%BC%8C%E6%91%84%E5%83%8F%E5%A4%B4%E8%B6%8A%E5%A4%9A%E6%8B%8D%E7%85%A7%E8%B6%8A%E5%A5%BD%E5%90%97%EF%BC%9F-360P+%E6%B5%81%E7%95%85-AVC.Cover.jpg',
            url: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%A7%91%E6%8A%80%2F%E3%80%90%E7%A1%AC%E6%A0%B8%E7%A7%91%E6%99%AE%E3%80%91%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E8%AE%A4%E8%AF%86%E6%98%BE%E5%8D%A1%2F1-%E3%80%90%E7%A1%AC%E6%A0%B8%E7%A7%91%E6%99%AE%E3%80%91%E6%89%8B%E6%9C%BA%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E5%81%9A%E5%A4%9A%E6%91%84%EF%BC%8C%E6%91%84%E5%83%8F%E5%A4%B4%E8%B6%8A%E5%A4%9A%E6%8B%8D%E7%85%A7%E8%B6%8A%E5%A5%BD%E5%90%97%EF%BC%9F-360P+%E6%B5%81%E7%95%85-AVC.mp4',
            title: '手机为什么要做多摄，摄像头越多拍照越好吗？',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5%2F%5B+%5D%2F8-Arcade+++%E5%A8%9C%E5%A8%9C%E6%98%8E+X+%E7%82%BC%E7%8B%B1%E5%A4%A7%E5%93%A5+%5BEdit+AMV%5D-480P+%E6%B8%85%E6%99%B0-AVC.Cover.jpg',
            url: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5%2F%5B+%5D%2F2-Yeat+-+Jus+Better+++%E7%BB%AB%E5%B0%8F%E8%B7%AF%E6%B8%85%E9%9A%86+%5BEdit+AMV%5D-480P+%E6%B8%85%E6%99%B0-AVC.mp4',
            title: '娜娜明 X 炼狱大哥 [Edit AMV]',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%BE%8E%E9%A3%9F%2F%E3%80%90%E4%B8%AD%E5%9B%BD%E3%80%91%E3%80%90%E7%BA%AA%E5%BD%95%E7%89%87%E3%80%91%E4%B8%AD%E5%9B%BD%E5%B0%8F%E5%90%83%E7%B3%BB%E5%88%97+Chinese+Snack+Series%2F6-%E9%99%95%E8%A5%BF%E5%B0%8F%E5%90%83%EF%BC%88%E4%B8%8A%EF%BC%89-480P+%E6%B8%85%E6%99%B0-AVC.jpg',
            url: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%BE%8E%E9%A3%9F%2F%E3%80%90%E4%B8%AD%E5%9B%BD%E3%80%91%E3%80%90%E7%BA%AA%E5%BD%95%E7%89%87%E3%80%91%E4%B8%AD%E5%9B%BD%E5%B0%8F%E5%90%83%E7%B3%BB%E5%88%97+Chinese+Snack+Series%2F6-%E9%99%95%E8%A5%BF%E5%B0%8F%E5%90%83%EF%BC%88%E4%B8%8A%EF%BC%89-480P+%E6%B8%85%E6%99%B0-AVC.mp4',
            title: '【中国】【纪录片】中国小吃系列 Chinese Snack Series/6-陕西小吃',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5%2F%E4%B8%AD%E5%9B%BD%E7%BB%8F%E5%85%B8%E5%8A%A8%E7%94%BB%EF%BC%88%E5%90%88%E9%9B%86%EF%BC%89%2F10-%E5%B0%8F%E7%8C%AB%E9%92%93%E9%B1%BC-480P+%E6%B8%85%E6%99%B0-AVC.Cover.png',
            url: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5%2F%E4%B8%AD%E5%9B%BD%E7%BB%8F%E5%85%B8%E5%8A%A8%E7%94%BB%EF%BC%88%E5%90%88%E9%9B%86%EF%BC%89%2F10-%E5%B0%8F%E7%8C%AB%E9%92%93%E9%B1%BC-480P+%E6%B8%85%E6%99%B0-AVC.mp4',
            title: '小猫钓鱼',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%A7%91%E6%8A%80%2F%E3%80%90%E4%B8%AD%E6%96%87%E5%AE%8C%E6%95%B4%E7%89%88%E3%80%91Apple+Vision+Pro+%E5%AE%98%E6%96%B9%E4%BB%8B%E7%BB%8D%E5%BD%B1%E7%89%87%EF%BC%81%2F1-%E3%80%90%E4%B8%AD%E6%96%87%E5%AE%8C%E6%95%B4%E7%89%88%E3%80%91Apple+Vision+Pro+%E5%AE%98%E6%96%B9%E4%BB%8B%E7%BB%8D%E5%BD%B1%E7%89%87%EF%BC%81-480P+%E6%B8%85%E6%99%B0-AVC.Cover.jpg',
            url: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%A7%91%E6%8A%80%2F%E3%80%90%E4%B8%AD%E6%96%87%E5%AE%8C%E6%95%B4%E7%89%88%E3%80%91Apple+Vision+Pro+%E5%AE%98%E6%96%B9%E4%BB%8B%E7%BB%8D%E5%BD%B1%E7%89%87%EF%BC%81%2F1-%E3%80%90%E4%B8%AD%E6%96%87%E5%AE%8C%E6%95%B4%E7%89%88%E3%80%91Apple+Vision+Pro+%E5%AE%98%E6%96%B9%E4%BB%8B%E7%BB%8D%E5%BD%B1%E7%89%87%EF%BC%81-480P+%E6%B8%85%E6%99%B0-AVC.mp4',
            title: 'Apple Vision Pro 官方介绍影片！',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%BE%8E%E9%A3%9F%2F%E4%B8%8A%E7%8F%AD%E5%B8%A6%E9%A5%AD%E7%AC%AC203%E5%A4%A9%EF%BC%9A%E9%A6%99%E7%85%8E%E8%84%86%E7%9A%AE%E8%B1%86%E8%85%90%EF%BC%8C%E5%B7%A8%E5%B7%A8%E5%B7%A8%E5%A5%BD%E5%90%83%EF%BC%8C%E5%98%8E%E5%98%8E%E9%A6%99%EF%BC%81%2F1-%E4%B8%8A%E7%8F%AD%E5%B8%A6%E9%A5%AD%E7%AC%AC203%E5%A4%A9%EF%BC%9A%E9%A6%99%E7%85%8E%E8%84%86%E7%9A%AE%E8%B1%86%E8%85%90%EF%BC%8C%E5%B7%A8%E5%B7%A8%E5%B7%A8%E5%A5%BD%E5%90%83%EF%BC%8C%E5%98%8E%E5%98%8E%E9%A6%99%EF%BC%81-480P+%E6%B8%85%E6%99%B0-AVC.jpg',
            url: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%BE%8E%E9%A3%9F%2F%E4%B8%8A%E7%8F%AD%E5%B8%A6%E9%A5%AD%E7%AC%AC203%E5%A4%A9%EF%BC%9A%E9%A6%99%E7%85%8E%E8%84%86%E7%9A%AE%E8%B1%86%E8%85%90%EF%BC%8C%E5%B7%A8%E5%B7%A8%E5%B7%A8%E5%A5%BD%E5%90%83%EF%BC%8C%E5%98%8E%E5%98%8E%E9%A6%99%EF%BC%81%2F1-%E4%B8%8A%E7%8F%AD%E5%B8%A6%E9%A5%AD%E7%AC%AC203%E5%A4%A9%EF%BC%9A%E9%A6%99%E7%85%8E%E8%84%86%E7%9A%AE%E8%B1%86%E8%85%90%EF%BC%8C%E5%B7%A8%E5%B7%A8%E5%B7%A8%E5%A5%BD%E5%90%83%EF%BC%8C%E5%98%8E%E5%98%8E%E9%A6%99%EF%BC%81-480P+%E6%B8%85%E6%99%B0-AVC.mp4',
            title: '上班带饭第203天：香煎脆皮豆腐，巨巨巨好吃，嘎嘎香！',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%BE%8E%E9%A3%9F%2F%E7%A5%96%E4%BC%A0%E8%A5%BF%E7%BA%A2%E6%9F%BF%E7%88%86%E8%9B%8B%EF%BC%8C%E5%88%B0%E6%88%91%E7%88%B8%E8%BF%99%E5%B7%AE%E7%82%B9%E5%A4%B1%E4%BC%A0%E4%BA%86%2F1-%E7%A5%96%E4%BC%A0%E8%A5%BF%E7%BA%A2%E6%9F%BF%E7%88%86%E8%9B%8B%EF%BC%8C%E5%88%B0%E6%88%91%E7%88%B8%E8%BF%99%E5%B7%AE%E7%82%B9%E5%A4%B1%E4%BC%A0%E4%BA%86-480P+%E6%B8%85%E6%99%B0-AVC.jpg",
            url: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%BE%8E%E9%A3%9F%2F%E7%A5%96%E4%BC%A0%E8%A5%BF%E7%BA%A2%E6%9F%BF%E7%88%86%E8%9B%8B%EF%BC%8C%E5%88%B0%E6%88%91%E7%88%B8%E8%BF%99%E5%B7%AE%E7%82%B9%E5%A4%B1%E4%BC%A0%E4%BA%86%2F1-%E7%A5%96%E4%BC%A0%E8%A5%BF%E7%BA%A2%E6%9F%BF%E7%88%86%E8%9B%8B%EF%BC%8C%E5%88%B0%E6%88%91%E7%88%B8%E8%BF%99%E5%B7%AE%E7%82%B9%E5%A4%B1%E4%BC%A0%E4%BA%86-480P+%E6%B8%85%E6%99%B0-AVC.mp4",
            title: '祖传西红柿爆蛋，到我爸这差点失传了',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5%2F%5B+%5D%2F5--+++++%E5%8A%A8%E6%BC%AB%E6%B7%B7%E5%89%AA+%5BEdit+AMV%5D-480P+%E6%B8%85%E6%99%B0-AVC.Cover.jpg",
            url: "https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E5%8A%A8%E6%BC%AB%E7%89%87%E6%AE%B5%2F%5B+%5D%2F5--+++++%E5%8A%A8%E6%BC%AB%E6%B7%B7%E5%89%AA+%5BEdit+AMV%5D-480P+%E6%B8%85%E6%99%B0-AVC.mp4",
            title: '动漫混剪 [Edit AMV]',
            creationId: '',
            userId: '',
        },
        {
            thumbnail: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%9F%A5%E8%AF%86%2F%E9%89%B4%E5%AE%9A%E5%92%AC%E4%BC%A4%E7%B2%89%E4%B8%9D%E7%9A%84%E6%AF%92%E8%9B%87%282%29%E8%80%81%E4%BA%BA%E8%87%AA%E8%BF%B0%E8%A2%AB%E4%BA%94%E6%AD%A5%E8%9B%87%E5%92%AC%E4%BC%A4%EF%BC%81%E4%BD%86%E5%85%B6%E5%AE%9E%E5%B9%B6%E4%B8%8D%E6%98%AF%EF%BC%9F%E5%BA%94%E8%AF%A5%E7%94%A8%E4%BB%80%E4%B9%88%E8%A1%80%E6%B8%85%EF%BC%9F%2F3-%E9%89%B4%E5%AE%9A%E5%92%AC%E4%BC%A4%E7%B2%89%E4%B8%9D%E7%9A%84%E6%AF%92%E8%9B%87%283%29%E4%BA%B2%E6%88%9A%E8%A2%AB%E4%BA%94%E6%AD%A5%E8%9B%87%E5%92%AC%E4%BC%A4%EF%BC%813%E5%A4%A9%E8%8A%B1%E4%BA%8620000%EF%BC%9F%E5%AE%9E%E5%9C%A8%E6%98%AF%E5%A4%AA%E6%83%A8%E4%BA%86%EF%BC%81-480P+%E6%B8%85%E6%99%B0-AVC.Cover.jpg',
            url: 'https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%9F%A5%E8%AF%86%2F%E9%89%B4%E5%AE%9A%E5%92%AC%E4%BC%A4%E7%B2%89%E4%B8%9D%E7%9A%84%E6%AF%92%E8%9B%87%282%29%E8%80%81%E4%BA%BA%E8%87%AA%E8%BF%B0%E8%A2%AB%E4%BA%94%E6%AD%A5%E8%9B%87%E5%92%AC%E4%BC%A4%EF%BC%81%E4%BD%86%E5%85%B6%E5%AE%9E%E5%B9%B6%E4%B8%8D%E6%98%AF%EF%BC%9F%E5%BA%94%E8%AF%A5%E7%94%A8%E4%BB%80%E4%B9%88%E8%A1%80%E6%B8%85%EF%BC%9F%2F2-%E9%89%B4%E5%AE%9A%E5%92%AC%E4%BC%A4%E7%B2%89%E4%B8%9D%E7%9A%84%E6%AF%92%E8%9B%87%282%29%E8%80%81%E4%BA%BA%E8%87%AA%E8%BF%B0%E8%A2%AB%E4%BA%94%E6%AD%A5%E8%9B%87%E5%92%AC%E4%BC%A4%EF%BC%81%E4%BD%86%E5%85%B6%E5%AE%9E%E5%B9%B6%E4%B8%8D%E6%98%AF%EF%BC%9F%E5%BA%94%E8%AF%A5%E7%94%A8%E4%BB%80%E4%B9%88%E8%A1%80%E6%B8%85%EF%BC%9F-480P+%E6%B8%85%E6%99%B0-AVC.mp4',
            title: '老人自述被五步蛇咬伤！但其实并不是？应该用什么血清？',
            creationId: '',
            userId: '',
        },
    ];

    const handlerField = useCallback((key, value) => setSpaceCreations((prev) => ({
        ...prev,
        [key]: value
    })), [])

    const fetchCreationInfo = useCallback(async (userId, type) => {
        const response = await fetch(`http://localhost:8080/api/creation/space/${userId}/1/${type}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.log(response.error)
            return null
        }

        const result = await response.json()
        return result
    }, [])

    useEffect(() => {
        const type = spaceCreations.type
        console.log(type)

        const exeCute = async () => {
            console.log("getIP")
            const ip = await getAddress()
            console.log(ip)

            const result = await fetchCreationInfo(userId, type)
            setCreations(result)
        }
        exeCute()
    }, [userId, spaceCreations.type, fetchCreationInfo])

    useEffect(() => {
        console.log(space)
    }, [space])

    return (
        <div className="person-page">
            <div className="creations-block">
                <div className="title-box">
                    <h2 className="title">视频</h2>
                    <button className="type" onClick={() => handlerField("type", "PUBLISHED_TIME")}>最新发布</button>
                    <button className="type" onClick={() => handlerField("type", "VIEWS")}>最多播放</button>
                    <button className="type" onClick={() => handlerField("type", "COLLECTIONS")}>最多收藏</button>
                </div>
                <div className="creation-list">
                    <VideoList videos={vvideos} />
                </div>
            </div>
            <div className="person-information">
                <h3>个人资料</h3>
                <div className="uid"><strong>UID:</strong> {userId}</div>
                {userBday && <div className="bday"><strong>生日:</strong> {(new Date(userBday)).toISOString().split("T")[0]}</div>}
                <div className="gender"><strong>性别:</strong> {genderText}</div>
                {userUpdatedAt && <div className="updatedAt"><strong>更新时间:</strong> {(new Date(userUpdatedAt)).toISOString().split("T")[0]}</div>}
            </div>
        </div>
    );
}