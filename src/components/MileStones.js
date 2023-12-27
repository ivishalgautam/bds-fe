import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import MileStone from "../assets/milestone1.png";
import Image from "next/image";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useFetchRewards } from "@/hooks/useFetchRewards";
import { FaLock } from "react-icons/fa";

export default function MileStones({ rewards, levels }) {
  const slides = [
    {
      title: "You Write Your First Code",
      image: MileStone,
      description: "20. Object-oriented Programming on Dart",
    },
    {
      title: "You Write Your First Code",
      image: MileStone,
      description: "20. Object-oriented Programming on Dart",
    },
    {
      title: "You Write Your First Code",
      image: MileStone,
      description: "20. Object-oriented Programming on Dart",
    },
    {
      title: "You Write Your First Code",
      image: MileStone,
      description: "20. Object-oriented Programming on Dart",
    },
    {
      title: "You Write Your First Code",
      image: MileStone,
      description: "20. Object-oriented Programming on Dart",
    },
    {
      title: "You Write Your First Code",
      image: MileStone,
      description: "20. Object-oriented Programming on Dart",
    },
    {
      title: "You Write Your First Code",
      image: MileStone,
      description: "20. Object-oriented Programming on Dart",
    },
    {
      title: "You Write Your First Code",
      image: MileStone,
      description: "20. Object-oriented Programming on Dart",
    },
    {
      title: "You Write Your First Code",
      image: MileStone,
      description: "20. Object-oriented Programming on Dart",
    },
  ];
  const swiperRef = useRef(null);

  const handleSlide = (direction) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      if (direction === "prev") {
        swiper.slidePrev();
      } else if (direction === "next") {
        swiper.slideNext();
      }
    }
  };
  return (
    <div className="relative flex items-center gap-4 w-full overflow-hidden">
      <div className="border-2 border-dashed border-primary absolute mx-auto w-[95%] ml-6" />
      <button onClick={() => handleSlide("prev")}>
        <BsChevronCompactLeft className="text-4xl" />
      </button>
      <Swiper
        ref={swiperRef}
        slidesPerView={3}
        spaceBetween={30}
        className="mySwiper"
      >
        {levels?.map((slide, key) => (
          <SwiperSlide key={key}>
            <div
              // style={{ backgroundColor: slide?.color }}
              className={`w-full rounded-3xl relative shadow my-2`}
            >
              {rewards?.[0]?.reward_points < slide?.min_reward_point && (
                <div className="absolute -top-2 -right-2 z-10 bg-white p-3 shadow rounded-2xl">
                  <FaLock size={20} />
                </div>
              )}
              <div
                className="h-32 overflow-hidden relative rounded-md"
                style={{ background: slide.color }}
              >
                <Image
                  src={MileStone}
                  width={"100%"}
                  height={"100%"}
                  alt="img"
                  className="absolute z-0"
                />
                <h3
                  style={{ color: slide.color }}
                  className="brightness-75 text-6xl font-extrabold text-center absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  {slide?.level}
                </h3>
              </div>
              <div className="p-4 text-black bg-white">
                <p className="text-center text-xs">
                  {rewards?.[0]?.reward_points >= slide?.min_reward_point
                    ? "Level achieved"
                    : `You need
                  ${slide?.min_reward_point - rewards?.[0]?.reward_points} more
                  points to achieve this level`}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button onClick={() => handleSlide("next")}>
        <BsChevronCompactRight className="text-4xl" />
      </button>
    </div>
  );
}
