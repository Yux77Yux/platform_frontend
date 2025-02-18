'use client';

import "./VideoList.scss"
import Image from 'next/image';
import Link from "next/link";
import React, { useCallback, useRef, useState } from 'react';

const VideoCard = ({ video }) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const openCreation = useCallback(() => window.open(`/creation`, "_blank"), [])

  const handleMouseEnter = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play(); // 使用 await 确保播放过程不会被中断
      } catch (error) {
        console.log("Error playing video:", error);
      }
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // 重置为第一帧
    }
  };

  return (
    <div className="VideoCard">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="videoThumbnailWrapper"
      >
        {!isHovered ? (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            style={{
              objectFit: 'cover',
            }}
          />
        ) : (
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              cursor: "pointer",
            }}
            muted
            preload="auto"
            onClick={openCreation}
          >
            <source src={video.url} type="video/mp4" />
          </video>
        )}
      </div>
      <Link
        className="videoTitle"
        href="/creation"
        target="_blank"
      >
        {video.title}
      </Link>
      <Link
        href={video.authorId ? `/space/${video.authorId}` : ""}
        className="videoAuthor"
        target="_blank"
      >
        {video.author && <span className="name">UP: &nbsp;&nbsp;{video.author}</span>}
        <span className="timeAt">12-12</span>
      </Link>
    </div>
  );
};

const VideoList = ({ videos }) => {
  return (
    <div className="VideoList">
      {videos.map((video, index) => (
        <VideoCard key={index} video={video} />
      ))}
    </div>
  );
};

export default VideoList;
