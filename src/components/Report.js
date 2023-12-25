import React, { useContext } from "react";
import Student from "../assets/student.svg";
import Courses from "../assets/courses.svg";
import Franchisee from "../assets/franchisee.svg";
import Image from "next/image";
import { MainContext } from "@/store/context";

export default function Report({ last_30_days_data }) {
  const { user } = useContext(MainContext);
  const data = [
    {
      title: last_30_days_data?.total_student || 0,
      description: "Students joined in Last 30 days",
      image: Student,
    },
    {
      title: last_30_days_data?.total_course || 0,
      description: "Courses purchased",
      image: Courses,
    },
    {
      title: last_30_days_data?.total_sub_franchisee || 0,
      description: "Franchisee Added",
      image: Franchisee,
    },
  ];
  const filteredReport =
    user?.role === "sub_franchisee"
      ? data.filter((item) => item.description !== "Franchisee Added")
      : data;

  return (
    <div className="grid grid-cols-3 gap-8">
      {filteredReport?.map((item, i) => (
        <div className="bg-white p-2 rounded-full flex items-center" key={i}>
          <Image src={item.image} alt="" />
          <div>
            <h3 className="text-2xl font-bold text-primary">{item.title}</h3>
            <p className="text-sm text-[#002277]">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
