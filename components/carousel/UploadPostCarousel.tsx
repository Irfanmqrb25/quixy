"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade } from "swiper/modules";
import "swiper/css/effect-fade";

import { Button } from "../ui/button";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadPostCarouselProps {
  images: string[];
}

const UploadPostCarousel: React.FC<UploadPostCarouselProps> = ({ images }) => {
  const swiperRef = useRef<any>(null);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);

  const checkSlidePosition = useCallback(() => {
    if (swiperRef.current) {
      const currentIndex = swiperRef.current.swiper.activeIndex;
      setIsFirstSlide(currentIndex === 0);
      setIsLastSlide(currentIndex === images.length - 1);
    }
  }, [images]);

  const goPrev = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.swiper.slidePrev();
    checkSlidePosition();
  }, [checkSlidePosition]);

  const goNext = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.swiper.slideNext();
    checkSlidePosition();
  }, [checkSlidePosition]);

  return (
    <div className="relative">
      <Swiper
        ref={swiperRef}
        centeredSlides={true}
        navigation={true}
        loop={false}
        modules={[Navigation, EffectFade]}
        effect="fade"
        className="mySwiper w-full h-[360px] rounded-sm"
      >
        {images.map((url, index) => (
          <SwiperSlide key={index}>
            <Image src={url} alt="" fill objectFit="cover" />
          </SwiperSlide>
        ))}
      </Swiper>
      {images.length > 1 && (
        <div
          className={cn(
            "absolute flex justify-between w-full top-0 z-50 items-center my-auto h-full pl-2 pr-2",
            isFirstSlide ? "justify-end" : ""
          )}
        >
          <Button
            type="button"
            size="icon"
            onClick={goPrev}
            className={cn(
              "bg-black/80 hover:bg-black/70 rounded-full text-white",
              isFirstSlide ? "hidden" : ""
            )}
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            size="icon"
            onClick={goNext}
            className={cn(
              "bg-black/80 hover:bg-black/70 rounded-full text-white",
              isLastSlide ? "hidden" : ""
            )}
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadPostCarousel;
