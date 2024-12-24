// 'use client'
import './page.scss'
import { Modal } from "@/src/client-components/modal/modal.component";

const Detail = () => {
    return (
        <Modal>
            <div className="detail-slot">
                <div className="detail-left">
                    <div className="detail-player">
                        <video className="player-element" autoPlay={false} controls>
                            <source src="https://platform-user.oss-cn-guangzhou.aliyuncs.com/Media%2F%E7%94%B5%E5%BD%B1%E7%89%87%E6%AE%B5%2F%E3%80%90%E9%98%BF%E6%96%97%E3%80%91%E6%9C%80%E5%90%8E5%E5%88%86%E9%92%9F%E5%B0%81%E7%A5%9E%EF%BC%81%E5%8D%8E%E8%AF%AD%E6%82%AC%E7%96%91%E5%B7%85%E5%B3%B0%E4%B9%8B%E4%BD%9C%EF%BC%81%E6%B7%B1%E5%BA%A6%E8%A7%A3%E8%AF%BB%E6%9D%9C%E7%90%AA%E5%B3%B0%E6%9C%80%E7%83%A7%E8%84%91%E7%9A%84%E7%94%B5%E5%BD%B1%E3%80%8A%E7%A5%9E%E6%8E%A2%E3%80%8B%2F1-%E3%80%90%E9%98%BF%E6%96%97%E3%80%91%E6%9C%80%E5%90%8E5%E5%88%86%E9%92%9F%E5%B0%81%E7%A5%9E%EF%BC%81%E5%8D%8E%E8%AF%AD%E6%82%AC%E7%96%91%E5%B7%85%E5%B3%B0%E4%B9%8B%E4%BD%9C%EF%BC%81%E6%B7%B1%E5%BA%A6%E8%A7%A3%E8%AF%BB%E6%9D%9C%E7%90%AA%E5%B3%B0%E6%9C%80%E7%83%A7%E8%84%91%E7%9A%84%E7%94%B5%E5%BD%B1%E3%80%8A%E7%A5%9E%E6%8E%A2%E3%80%8B-360P+%E6%B5%81%E7%95%85-AVC.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    <div className="buttons">
                        <button className="btn">通过审核</button>
                        <button className="btn">不予过审</button>
                        <button className="btn">永久删除</button>
                    </div>
                </div>
                <div className="detail-right">
                    <div className="title">
                        <span className='label'>标题</span>
                        <span className='content'>【阿斗】最后5分钟封神！华语悬疑巅峰之作！深度解读杜琪峰最烧脑的电影《神探》</span>
                    </div>
                    <div className="category">
                        <span className='label'>分区</span>
                        <span className='content'>电影片段</span>
                    </div>
                    <div className="bio">
                        <span className='label'>简介</span>
                        <span className='bio-content'>深度解读杜琪峰最烧脑的电影</span>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default Detail;