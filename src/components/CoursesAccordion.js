import React, { useState } from "react";
import Avatar from "../assets/avatar.svg";
import Image from "next/image";

function CoursesAccordion({ user }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const items = [
    {
      headline: "Hello",
      lessons: "20/40 Lessons",
      description: "20. Object-oriented Programming on Dart",
      milestones: [
        {
          day: "DAY 1",
          title: "Basics Of Flutter & How To Install It",
          status: "complete",
        },
        {
          day: "DAY 1",
          title: "Basics Of Flutter & How To Install It",
          status: "complete",
        },
      ],
    },
    {
      headline: "Hello",
      lessons: "20/40 Lessons",
      description: "20. Object-oriented Programming on Dart",
      milestones: [
        {
          day: "DAY 1",
          title: "Basics Of Flutter & How To Install It",
          status: "complete",
        },
        {
          day: "DAY 1",
          title: "Basics Of Flutter & How To Install It",
          status: "complete",
        },
      ],
    },
  ];
  return (
    <div className="rounded space-y-6">
      {items.map((item, index) => (
        <div key={index} className="bg-white rounded-xl p-4">
          <div
            className="flex justify-between items-center w-full cursor-pointer"
            onClick={() => handleClick(index)}
          >
            <div className="flex gap-4">
              <Image
                src={Avatar}
                alt=""
                className="h-16 w-16  object-cover rounded-full block"
              />
              <div className="text-left">
                <p className="font-bold font-mulish text-sm">{item.lessons}</p>
                <p className="font-bold font-mulish text-md">{item.headline}</p>
                <p className="font-bold font-mulish text-md">
                  {item.description}
                </p>
              </div>
            </div>
            <button className="text-white px-6 py-2 bg-[#42BDA1] rounded-xl">
              Completed
            </button>
          </div>
          {activeIndex === index && (
            <div classNlame="p-4">
              {item.milestones.map((milestone) => (
                <div className="flex justify-between bg-[#F7F7FC] p-4 rounded-full mt-4">
                  <h1 className="w-[15%]">
                    <span className="px-6 bg-primary py-2 text-white rounded-lg">
                      {milestone.day}
                    </span>
                  </h1>
                  <h1 className="w-[60%] text-lg font-mulish font-bold">
                    {milestone.title}
                  </h1>
                  <h1 className=" bg-[#E8E8E8] text-center rounded-full px-4 py-1">
                    {milestone.status}
                  </h1>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CoursesAccordion;
