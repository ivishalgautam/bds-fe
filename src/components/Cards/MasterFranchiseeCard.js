import React, { useState } from "react";
import Title from "../Title";
import { FiMoreVertical } from "react-icons/fi";
import { MdModeEditOutline } from "react-icons/md";
import { BsFillEyeFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { endpoints } from "../../utils/endpoints";
import http from "../../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function MasterFranchiseeCard({
  title,
  subFranchisies,
  totalStudents,
  openModal,
  id,
}) {
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();

  const deleteItem = async (itemId) => {
    await http().delete(`${endpoints.franchisee.getAll}/${itemId}`);
  };

  const deleteMutation = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["franchisee"] });
      toast.success("Master Franchisee deleted.");
    },
    onError: () => {
      toast.error("Failed to delete Master Franchisee");
    },
  });

  const handleDelete = (itemId) => {
    deleteMutation.mutate(itemId);
  };

  const router = useRouter();

  return (
    <div
      className="bg-white p-8 font-mulish space-y-3 rounded-xl"
      onMouseLeave={() => setShow(false)}
    >
      <div className="flex justify-between border-gray-300 border-b border-dashed pb-4">
        <Title text={title} />
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
                  onClick={() => router.push(`/master-franchisee/edit/${id}`)}
                >
                  <MdModeEditOutline />
                  Edit
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                  onClick={() => router.push(`/master-franchisee/${id}`)}
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
      <div className="flex justify-between">
        <p className="text-md font-bold">Franchisies</p>
        <p>{subFranchisies} Franchisee</p>
      </div>
      <div className="flex justify-between">
        <p className="text-md font-bold">Total Students</p>
        <p>{totalStudents} Students</p>
      </div>
    </div>
  );
}
