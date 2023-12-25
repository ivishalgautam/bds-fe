import React, { useState } from "react";
import Teacher from "../../assets/teacher.svg";
import Graduation from "../../assets/graduation.svg";
import Skills from "../../assets/skills.svg";
import Image from "next/image";
import Title from "../Title";
import { MdModeEditOutline } from "react-icons/md";
import { BsFillEyeFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { useRouter } from "next/router";
import Link from "next/link";
import { LuWallet } from "react-icons/lu";

function TeacherCard({
  username,
  image_url,
  batches,
  openModal,
  id,
  setSelectedTeacher,
  setType,
  handleDelete,
  profession,
  course_name,
  userRole,
  type,
  role,
  courseId,
  student_courses,
  student_batches,
  student_reward_points,
  teacher_courses,
  teacher_total_batches,
}) {
  const [show, setShow] = useState(false);
  const router = useRouter();

  return (
    <div className="bg-white p-3 rounded-xl">
      <div className="flex gap-5 relative">
        {image_url ? (
          <img
            src={image_url}
            alt=""
            className="w-20 h-24 rounded-lg overflow-hidden"
          />
        ) : (
          <Image
            src={Teacher}
            alt=""
            className="w-36 aspect-square rounded-md overflow-hidden"
          />
        )}
        <div className="space-y-2">
          <Title text={username} />
          {profession && (
            <div className="flex gap-1 items-center">
              <Image src={Graduation} alt="profession" className="w-5" />
              <p> {profession}</p>
            </div>
          )}
          {role && (
            <div className="flex gap-1 items-center">
              <Image src={Skills} alt="skills" className="w-5" />
              <p> {role}</p>
            </div>
          )}
        </div>

        <div className="absolute top-0 right-0">
          <FiMoreVertical
            onClick={() => setShow(true)}
            className="cursor-pointer ml-auto"
          />
          {show && (
            <div
              className="mt-2 bg-white rounded-lg shadow-md"
              onMouseLeave={() => setShow(false)}
            >
              <ul className="py-2 max-w-max">
                <li
                  className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                  onClick={() => router.push(`/${userRole}/edit/${id}`)}
                >
                  <MdModeEditOutline />
                  Edit
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                  onClick={() => router.push(`/${userRole}/${id}`)}
                >
                  <BsFillEyeFill />
                  View
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                  onClick={() => handleDelete(id)}
                >
                  <FaTrashAlt />
                  Delete
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <p className="font-semibold text-base">Batches</p>
        <span> : </span>
        {type === "sub_franchisee" && (
          <p className="text-base">
            {userRole === "students" ? student_batches : teacher_total_batches}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <p className="font-semibold text-base">Courses</p>
        <span> : </span>
        {type === "sub_franchisee" && (
          <p className="text-base">
            {userRole === "students" ? student_courses : teacher_courses}
          </p>
        )}
      </div>
      {type === "sub_franchisee" && userRole === "students" && (
        <div className="flex gap-2">
          <p className="font-semibold text-base">Reward points</p>
          <span> : </span>
          <div className="rounded-full p-1 bg-yellow-200 text-white flex items-center justify-center cursor-pointer gap-2">
            <div className="p-1 bg-yellow-500 rounded-full">
              <LuWallet size={15} className="text-black" />
            </div>
            <span className="text-yellow-500 text-sm font-extrabold">
              {student_reward_points}
            </span>
            <span className="text-black leading-3 text-[10px] font-semibold mr-2">
              Reward <br /> points
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherCard;
