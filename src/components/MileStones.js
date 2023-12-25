import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import MileStone from "../assets/milestone.png";
import Image from "next/image";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useFetchRewards } from "@/hooks/useFetchRewards";

const fetchLevels = async () => {
  return await http().get(endpoints.levels.getAll);
};

export default function MileStones({ user }) {
  const { data: rewards, isLoading: rewardLoading } = useFetchRewards(
    user?.role === "student"
  );

  const { data } = useQuery({
    queryKey: ["levels"],
    queryFn: fetchLevels,
  });

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
    <div className="relative flex items-center gap-4 w-full">
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
        {data?.map((slide, key) => (
          <SwiperSlide key={key}>
            <div
              style={{ backgroundColor: slide.color }}
              className={`w-full rounded-3xl ${
                rewards?.[0].reward_points >= slide.min_reward_point
                  ? "grayscale-0"
                  : "grayscale"
              }`}
            >
              <Image src={MileStone} width={"100%"} alt="img" />
              <div className="p-4">
                <h3 className="text-white text-3xl font-extrabold text-center">
                  Level {slide.level}
                </h3>
                <p className="text-center text-white">
                  You need {slide.min_reward_point - rewards?.[0].reward_points}{" "}
                  more points to achieve this level
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
