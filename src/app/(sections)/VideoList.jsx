'use client';

import "./VideoList.scss"
import Image from 'next/image';
import Link from "next/link";
import React, { useRef, useState } from 'react';

const VideoCard = ({ video }) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

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
              borderRadius: '10px',
            }}
          />
        ) : (
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '10px',
            }}
            muted
            preload="auto"
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
        href="/creation"
        className="videoAuthor"
        target="_blank"
      >
        UP: &nbsp;&nbsp;{video.author}
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
