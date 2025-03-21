/* eslint-disable @next/next/no-img-element */
'use client';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Lunbos = ({ lunbos }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
    };

    return (
        <Slider {...settings}>
            {lunbos?.map((lunbo, i) => (
                <div key={i}>
                    <img
                        src={lunbo.src}
                        alt={`Slide ${i}`}
                        style={{ height: '360px', width: '30vw', objectFit: 'cover', objectPosition: 'center' }}  // 使图片填充容器
                    />
                </div>
            ))}
        </Slider>
    );
};

export default Lunbos;
