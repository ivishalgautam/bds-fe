import React, { useState } from "react";
import Title from "../Title";
import { FiMoreVertical } from "react-icons/fi";
import { MdModeEditOutline } from "react-icons/md";
import { BsFillEyeFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import http from "@/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/utils/endpoints";
import toast from "react-hot-toast";

export default function LevelCard({ level, id, minRewardPoint, name }) {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();

  const deleteItem = async (itemId) => {
    await http().delete(`${endpoints.levels.getAll}/${itemId}`);
  };

  const deleteMutation = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["levels"] });
      toast.success("level deleted.");
    },
    onError: () => {
      toast.error("Failed to delete level");
    },
  });

  const handleDelete = (itemId) => {
    deleteMutation.mutate(itemId);
  };

  return (
    <div
      className="bg-white p-8 font-mulish space-y-3 rounded-xl"
      onMouseLeave={() => setShow(false)}
    >
      <div className="flex justify-between border-gray-300 border-b border-dashed pb-4">
        <Title text={`Level: ${level}`} />
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
                  onClick={() => router.push(`/levels/edit/${id}`)}
                >
                  <MdModeEditOutline />
                  Edit
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                  onClick={() => router.push(`/levels/${id}`)}
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
      <div>Minimum reward point: {minRewardPoint}</div>
    </div>
  );
}
