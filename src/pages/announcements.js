import React, { useContext, useState } from "react";
import Title from "../components/Title";
import http from "../utils/http";
import { endpoints } from "../utils/endpoints";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "../components/Spinner";
import moment from "moment";
import Accordion from "../components/Accordion";
import { AiOutlinePlus } from "react-icons/ai";
import CreateAnnouncement from "../components/Forms/CreateAnnouncement";
import Modal from "../components/Modal";
import Avatar from "../assets/avatar.svg";
import Image from "next/image";
import { MainContext } from "@/store/context";
import { toast } from "react-hot-toast";
import { FiMoreVertical } from "react-icons/fi";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";

const fetchAnnouncements = () => {
  return http().get(endpoints.announcements.getAll);
};

const createAnnouncement = async (newItem) => {
  await http().post(endpoints.announcements.getAll, newItem);
};

export default function Announcements() {
  const { user } = useContext(MainContext);
  const [type, setType] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [show, setShow] = useState(false);
  const { isLoading, isError, data } = useQuery({
    queryKey: ["announcements"],
    queryFn: fetchAnnouncements,
  });

  console.log({ data });

  const queryClient = useQueryClient();

  const createMutation = useMutation(createAnnouncement, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Announcement created successfully.");
    },
    onError: () => {
      toast.error(" Failed to create Announcement.");
    },
  });

  const handleCreateAnnouncement = (newItem) => {
    createMutation.mutate(newItem);
  };

  const deleteItem = async (itemId) => {
    await http().delete(`${endpoints.announcements.getAll}/${itemId}`);
  };

  const deleteMutation = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Announcement deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete Announcement");
    },
  });

  const updateItem = async (itemId, updatedItem) => {
    await http().put(
      `${endpoints.announcements.getAll}/${itemId}`,
      updatedItem
    );
  };

  const updateMutation = useMutation(
    (updatedItem) => updateItem(selected, updatedItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
        toast.success("Announcement updated successfully.");
      },
      onError: () => {
        toast.error("Failed to update Announcement.");
      },
    }
  );

  const handleUpdate = (updatedItem) => {
    updateMutation.mutate(updatedItem);
  };

  if (isLoading)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  if (isError) return <h2>Error</h2>;

  const userProfile = (firstName, lastName, username) => {
    let displayName;

    if (firstName && lastName) {
      displayName = `${firstName} ${lastName}`;
    } else if (firstName) {
      displayName = firstName;
    } else if (lastName) {
      displayName = lastName;
    } else {
      displayName = username;
    }

    return (
      <>
        <p className="text-base font-bold font-mulish">{displayName}</p>
      </>
    );
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (itemId) => {
    deleteMutation.mutate(itemId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-12">
        <div className="w-2/3 space-y-6">
          <Title text="Announcements" />

          {data.slice(0, 1).map((item) => (
            <div
              className="bg-white p-6 rounded-xl space-y-2"
              key={item.id}
              onMouseLeave={() => setShow(false)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {item.image_url ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${item.image_url}`}
                      alt=""
                      className="h-16 w-16  object-cover rounded-full"
                    />
                  ) : (
                    <Image
                      src={Avatar}
                      alt=""
                      className="h-16 w-16  object-cover rounded-full"
                    />
                  )}
                  {/* <div className="w-16 h-16 rounded-full bg-gray-300" /> */}
                  <div>
                    <p className="font-bold">
                      {item.username === user?.username
                        ? "YOU"
                        : userProfile(
                            item.first_name,
                            item.last_name,
                            item.username
                          )}
                    </p>
                    {item.profession && (
                      <p className="text-gray-600 text-sm">{item.profession}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <p className="text-primary font-bold">
                    {moment(item.date).format("DD, MMMM YYYY")}
                  </p>
                  {item.username === user?.username && (
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
                                openModal();
                                setType("edit");
                                setSelected(item.id);
                              }}
                            >
                              <MdModeEditOutline />
                              Edit
                            </li>

                            <li
                              className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                              onClick={() => handleDelete(item.id)}
                            >
                              <FaTrashAlt />
                              Delete
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  {/* <p
                    onClick={() => {
                      setSelected(item.id);
                      openModal();
                    }}
                  >
                    edit
                  </p>
                  <p onClick={() => handleDelete(item.id)}>delete</p> */}
                </div>
              </div>
              <h3 className="text-lg font-bold font-mulish">{item.headline}</h3>
              <div className="border-l-2 border-primary">
                <p className="ml-3">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        {user?.role !== "student" && (
          <div className="w-1/3 space-y-6">
            <Title text="Create" />
            <div
              className="bg-white p-4 rounded-xl flex items-center justify-between cursor-pointer"
              onClick={() => {
                setType("add");
                openModal();
              }}
            >
              <p className="text-[#3F526D]">Create Announcement </p>

              <AiOutlinePlus className="text-3xl bg-primary text-white rounded-full font-bold p-1" />
            </div>
          </div>
        )}
      </div>
      <Title text="Recent Announcements" />
      <Accordion
        items={data.slice(1)}
        user={user}
        setType={setType}
        handleDelete={handleDelete}
        openModal={openModal}
        setSelected={setSelected}
      />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateAnnouncement
          handleCreateAnnouncement={handleCreateAnnouncement}
          closeModal={closeModal}
          selected={selected}
          type={type}
          handleUpdate={handleUpdate}
        />
      </Modal>
    </div>
  );
}
