import React, { useState } from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import moment from "moment";
import Image from "next/image";
import Avatar from "../../assets/avatar.svg";
import { FiMoreVertical } from "react-icons/fi";
import { MdModeEditOutline } from "react-icons/md";
import { BsFillEyeFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "react-hot-toast";

function TicketCard({
  description,
  date,
  heading,
  openModal,
  setSelectedId,
  id,
  imageUrl,
  username,
  profession,
  user,
  answer,
  openCreateModal,
  setType,
}) {
  const [show, setShow] = useState(false);

  const queryClient = useQueryClient();

  const deleteItem = async (itemId) => {
    await http().delete(`${endpoints.ticket.getAll}/${itemId}`);
  };

  const deleteMutation = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
      toast.success("Ticket deleted");
    },
    onError: () => {
      toast.error("Failed to delete Ticket");
    },
  });

  const handleDelete = (itemId) => {
    deleteMutation.mutate(itemId);
  };

  return (
    <div
      className="bg-white p-8 rounded-xl space-y-4 relative font-mulish"
      onMouseLeave={() => setShow(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {imageUrl ? (
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${imageUrl}`}
              alt="user_image"
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <Image src={Avatar} alt="" className="w-12 h-12 rounded-full" />
          )}

          <div>
            <p>{username}</p>
            {profession && (
              <p className="-mt-1 text-gray-500 text-sm">{profession}</p>
            )}
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <AiOutlineCalendar />
          <p>{moment(date).format("D MMMM YYYY")}</p>
        </div>
        {user?.role !== "admin" && (
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
                    // onClick={() => router.push(`/master-franchisee/edit/${id}`)}
                    onClick={() => {
                      openCreateModal();
                      setSelectedId(id);
                      setType("edit");
                    }}
                  >
                    <MdModeEditOutline />
                    Edit
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
      <h3 className="text-2xl">Q. {heading}</h3>
      <p>{description}</p>
      {answer && <p>Answer: {answer}</p>}
      {user?.role === "admin" ? (
        <div className="flex justify-center">
          <button
            type="button"
            className="bg-primary px-6 py-2 rounded-md text-white absolute -bottom-4"
            disabled={answer ? true : false}
            onClick={() => {
              openModal();
              setSelectedId(id);
            }}
          >
            {answer ? "Answered" : "Answer It"}
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            type="button"
            disabled={!answer}
            className={`bg-primary px-6 py-2 rounded-md text-white absolute -bottom-4 ${
              !answer && "cursor-not-allowed"
            }`}
            onClick={() => {
              openModal();
              setSelectedId(id);
            }}
          >
            {answer ? "View Answer" : "Not Answered yet"}
          </button>
        </div>
      )}
    </div>
  );
}

export default TicketCard;
