"use client";

import { useState } from "react";
import { FreeMode, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import styles from "./Gallery.module.css";

export default function Gallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const safeImages = images.filter(Boolean);

  if (!safeImages.length) {
    return (
      <div
        className={styles.mainImage}
        role="img"
        aria-label={`${name} image unavailable`}
      >
        <span className={styles.empty}>Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <Swiper
        modules={[Thumbs]}
        spaceBetween={12}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        className={styles.main}
      >
        {safeImages.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`}>
            <div className={styles.mainImage}>
              <img
                src={image}
                alt={`${name} photo ${index + 1}`}
                className={styles.image}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {safeImages.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[FreeMode, Thumbs]}
          freeMode
          spaceBetween={24}
          slidesPerView={4}
          watchSlidesProgress
          className={styles.thumbs}
        >
          {safeImages.map((image, index) => (
            <SwiperSlide key={`${image}-thumb-${index}`}>
              <div className={styles.thumb}>
                <img src={image} alt="" className={styles.thumbImage} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
