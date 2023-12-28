import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { BsFillEyeFill } from "react-icons/bs";
import { FaLightbulb, FaTrashAlt } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { MdModeEditOutline } from "react-icons/md";
import { endpoints } from "../../utils/endpoints";
import http from "../../utils/http";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function Course({
  title,
  description,
  duration,
  quiz,
  projects,
  thumbnail,
  id,
  user,
}) {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();

  const deleteItem = async (itemId) => {
    await http().delete(`${endpoints.courses.getAll}/${itemId}`);
  };

  const deleteMutation = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course deleted.");
    },
    onError: () => {
      toast.error("Failed to delete Course.");
    },
  });

  const handleDelete = (itemId) => {
    deleteMutation.mutate(itemId);
  };

  return (
    <div className="bg-white rounded-xl" onMouseLeave={() => setShow(false)}>
      <img
        src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${thumbnail}`}
        alt=""
        className="h-48 w-full object-cover rounded-t-xl"
      />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[#252832] font-bold text-lg">{title}</h3>
          {user?.role === "admin" && (
            <div className="relative">
              <FiMoreVertical
                onClick={() => setShow(true)}
                className="cursor-pointer"
              />
              {show && (
                <div
                  className="absolute top-4 right-0 mt-2 bg-white rounded-lg shadow-md"
                  onMouseLeave={() => setShow(false)}
                >
                  <ul className="py-2 max-w-max">
                    <li
                      className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                      onClick={() => {
                        router.push(`/courses/edit/${id}`);
                      }}
                    >
                      <MdModeEditOutline />
                      Edit
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                      onClick={() => {
                        router.push(`/courses/${id}`);
                      }}
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
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-[#999999]">
          <p>Duration: {duration} Weeks</p>
          <p className="flex items-center gap-1">
            <FaLightbulb className="text-primary" />
            {projects} Project
          </p>
          <p className="flex items-center gap-1">
            <AiFillQuestionCircle className="text-primary" /> {quiz} Quiz
          </p>
        </div>
        <p className="text-[#11505D] text-sm">{description}</p>
      </div>
    </div>
  );
}
