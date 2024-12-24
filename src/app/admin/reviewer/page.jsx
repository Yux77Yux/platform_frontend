'use client'

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import './page.scss'
import Link from 'next/link';

const Page = () => {
    const [info, setInfo] = useState({
        status: 'PENDING', //'PENDING', 'APPROVED', 'REJECTED'
    });

    const setValue = useCallback((key, value) => setInfo((prev) => ({ ...prev, [key]: value })), [setInfo]);
    const getValue = useCallback((key) => info[key], [info]);

    useEffect(() => { getValue("status") }, [getValue]);

    return (
        <div className='review-video'>
            <div className="status">
                <button onClick={() => setValue("status", "PENDING")} className={`set-status ${getValue("status") === "PENDING" && "active"}`}>未审核</button>
                <button onClick={() => setValue("status", "APPROVED")} className={`set-status ${getValue("status") === "APPROVED" && "active"}`}>已过审</button>
                <button onClick={() => setValue("status", "REJECTED")} className={`set-status ${getValue("status") === "REJECTED" && "active"}`}>未过审</button>
            </div>

            <div className="content" style={{boxShadow:'none', borderBottom: '1px solid rgb(111,111,111)' }}>
                <div className="content-id">审核信息 ID</div>
                <div className="content-cover">封面</div>
                <div className="content-title">标题</div>
                <div className="content-user">用户</div>
                <div className="content-created">时间</div>
                <div className="content-status">状态</div>
                <div className="content-addition"> 6 </div>
            </div>
            <div className="content">
                <div className="content-id">16744354987</div>
                <div className="content-cover"><Image src="https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%94%B5%E5%BD%B1%E7%89%87%E6%AE%B5%2F%E3%80%90%E9%98%BF%E6%96%97%E3%80%91%E6%9C%80%E5%90%8E5%E5%88%86%E9%92%9F%E5%B0%81%E7%A5%9E%EF%BC%81%E5%8D%8E%E8%AF%AD%E6%82%AC%E7%96%91%E5%B7%85%E5%B3%B0%E4%B9%8B%E4%BD%9C%EF%BC%81%E6%B7%B1%E5%BA%A6%E8%A7%A3%E8%AF%BB%E6%9D%9C%E7%90%AA%E5%B3%B0%E6%9C%80%E7%83%A7%E8%84%91%E7%9A%84%E7%94%B5%E5%BD%B1%E3%80%8A%E7%A5%9E%E6%8E%A2%E3%80%8B%2F1-%E3%80%90%E9%98%BF%E6%96%97%E3%80%91%E6%9C%80%E5%90%8E5%E5%88%86%E9%92%9F%E5%B0%81%E7%A5%9E%EF%BC%81%E5%8D%8E%E8%AF%AD%E6%82%AC%E7%96%91%E5%B7%85%E5%B3%B0%E4%B9%8B%E4%BD%9C%EF%BC%81%E6%B7%B1%E5%BA%A6%E8%A7%A3%E8%AF%BB%E6%9D%9C%E7%90%AA%E5%B3%B0%E6%9C%80%E7%83%A7%E8%84%91%E7%9A%84%E7%94%B5%E5%BD%B1%E3%80%8A%E7%A5%9E%E6%8E%A2%E3%80%8B-360P+%E6%B5%81%E7%95%85-AVC.Cover.jpg" alt='' width={300} height={160} objectFit='container' /></div>
                <div className="content-title">【阿斗】最后5分钟封神！华语悬疑巅峰之作！深度解读杜琪峰最烧脑的电影《神探》</div>
                <div className="content-user">阿斗</div>
                <div className="content-created">2024-12-20 11:11:12</div>
                <div className="content-status">待审核</div>
                <Link href="/creation" className="content-addition"> 详情 </Link>
            </div>
            <div className="content">
                <div className="content-id">134731256985</div>
                <div className="content-cover"><Image src="https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%94%B5%E5%BD%B1%E7%89%87%E6%AE%B5%2F%E5%A4%A9%E8%8A%B1%E6%9D%BF%E7%BA%A7%E5%88%AB%E7%9A%84%E5%9B%BD%E4%BA%A7%E5%96%9C%E5%89%A7%E7%94%B5%E5%BD%B1%EF%BC%8C%E4%B8%8A%E6%98%A0%E5%B7%B2%E7%BB%8F15%E5%B9%B4%EF%BC%8C%E4%BD%86%E4%BE%9D%E6%97%A7%E7%BB%8F%E5%85%B8%2F1-%E5%A4%A9%E8%8A%B1%E6%9D%BF%E7%BA%A7%E5%88%AB%E7%9A%84%E5%9B%BD%E4%BA%A7%E5%96%9C%E5%89%A7%E7%94%B5%E5%BD%B1%EF%BC%8C%E4%B8%8A%E6%98%A0%E5%B7%B2%E7%BB%8F15%E5%B9%B4%EF%BC%8C%E4%BD%86%E4%BE%9D%E6%97%A7%E7%BB%8F%E5%85%B8-480P+%E6%B8%85%E6%99%B0-AVC.jpg" alt='' width={300} height={160} objectFit='container' /></div>
                <div className="content-title">天花板级别的国产喜剧电影，上映已经15年，但依旧经典/1-天花板级别的国产喜剧电影，上映已经15年，但依旧经典</div>
                <div className="content-user">国产喜剧电影</div>
                <div className="content-created">2024-12-20 11:15:08</div>
                <div className="content-status">待审核</div>
                <Link href="/creation" className="content-addition"> 详情 </Link>
            </div>
            <div className="content">
                <div className="content-id">653463354789</div>
                <div className="content-cover"><Image src="https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%A7%91%E6%8A%80%2F%E3%80%90%E7%A1%AC%E6%A0%B8%E7%A7%91%E6%99%AE%E3%80%91%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E8%AE%A4%E8%AF%86%E6%98%BE%E5%8D%A1%2F29-%E3%80%90%E7%A1%AC%E6%A0%B8%E7%A7%91%E6%99%AE%E3%80%91ALIENWARE+x17%E5%9B%9B%E9%A3%8E%E6%89%87%E7%AC%94%E8%AE%B0%E6%9C%AC%E6%95%A3%E7%83%AD%E6%A8%A1%E7%BB%84%E6%B7%B1%E5%BA%A6%E8%A7%A3%E6%9E%90-360P+%E6%B5%81%E7%95%85-AVC.Cover.jpg" alt='' width={300} height={160} objectFit='container' /></div>
                <div className="content-title">【硬核科普】从零开始认识显卡/29-【硬核科普】ALIENWARE x17四风扇笔记本散热模组深度解析</div>
                <div className="content-user">认识显卡</div>
                <div className="content-created">2024-12-20 12:18:12</div>
                <div className="content-status">待审核</div>
                <Link href="/creation" className="content-addition"> 详情 </Link>
            </div>
            <div className="content">
                <div className="content-id">156894515689</div>
                <div className="content-cover"><Image src="https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%A7%91%E6%8A%80%2F%E6%9C%80%E8%B4%B5%E7%9A%84%E7%BA%A2%E7%B1%B3%EF%BC%8C%E6%83%B3%E5%B9%B2%E7%BF%BB%E5%B0%8F%E7%B1%B3%EF%BC%9F%EF%BC%9F%EF%BC%9F%E7%BA%A2%E7%B1%B3K80+Pro%E5%85%A8%E9%9D%A2%E6%B5%8B%E8%AF%95%E3%80%90%E7%A9%B7%E7%8E%A9%E7%BB%84%E3%80%91%2F13-%E7%BA%A2%E7%B1%B3K70+Ultra%E8%87%B3%E5%B0%8A%E7%89%88%E5%85%A8%E9%9D%A2%E8%AF%84%E6%B5%8B-480P+%E6%B8%85%E6%99%B0-AVC.Cover.jpg" alt='' width={300} height={160} objectFit='container' /></div>
                <div className="content-title">最贵的红米，想干翻小米？？？红米K80 Pro全面测试【穷玩组】</div>
                <div className="content-user">穷玩组</div>
                <div className="content-created">2024-12-20 12:19:52</div>
                <div className="content-status">待审核</div>
                <Link href="/creation" className="content-addition"> 详情 </Link>
            </div>
            <div className="content">
                <div className="content-id">256891256532</div>
                <div className="content-cover"><Image src="https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%A7%91%E6%8A%80%2F%E3%80%90%E7%A1%AC%E6%A0%B8%E7%A7%91%E6%99%AE%E3%80%91%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E8%AE%A4%E8%AF%86%E6%98%BE%E5%8D%A1%2F29-%E3%80%90%E7%A1%AC%E6%A0%B8%E7%A7%91%E6%99%AE%E3%80%91ALIENWARE+x17%E5%9B%9B%E9%A3%8E%E6%89%87%E7%AC%94%E8%AE%B0%E6%9C%AC%E6%95%A3%E7%83%AD%E6%A8%A1%E7%BB%84%E6%B7%B1%E5%BA%A6%E8%A7%A3%E6%9E%90-360P+%E6%B5%81%E7%95%85-AVC.Cover.jpg" alt='' width={300} height={160} objectFit='container' /></div>
                <div className="content-title">【硬核科普】从零开始认识显卡/29-【硬核科普】ALIENWARE x17四风扇笔记本散热模组深度解析</div>
                <div className="content-user">认识显卡</div>
                <div className="content-created">2024-12-20 12:18:12</div>
                <div className="content-status">待审核</div>
                <Link href="/creation" className="content-addition"> 详情 </Link>
            </div>
            <div className="content">
                <div className="content-id">129856454223</div>
                <div className="content-cover"><Image src="https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%A7%91%E6%8A%80%2F%E3%80%90%E7%A1%AC%E6%A0%B8%E7%A7%91%E6%99%AE%E3%80%91%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E8%AE%A4%E8%AF%86%E6%98%BE%E5%8D%A1%2F29-%E3%80%90%E7%A1%AC%E6%A0%B8%E7%A7%91%E6%99%AE%E3%80%91ALIENWARE+x17%E5%9B%9B%E9%A3%8E%E6%89%87%E7%AC%94%E8%AE%B0%E6%9C%AC%E6%95%A3%E7%83%AD%E6%A8%A1%E7%BB%84%E6%B7%B1%E5%BA%A6%E8%A7%A3%E6%9E%90-360P+%E6%B5%81%E7%95%85-AVC.Cover.jpg" alt='' width={300} height={160} objectFit='container' /></div>
                <div className="content-title">【硬核科普】从零开始认识显卡/29-【硬核科普】ALIENWARE x17四风扇笔记本散热模组深度解析</div>
                <div className="content-user">认识显卡</div>
                <div className="content-created">2024-12-20 12:18:12</div>
                <div className="content-status">待审核</div>
                <Link href="/creation" className="content-addition"> 详情 </Link>
            </div>
        </div >
    );
}

export default Page;