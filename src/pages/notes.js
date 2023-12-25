import CreateNote from "@/components/Forms/CreateNote";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlinePlus } from "react-icons/ai";
import { BsFillEyeFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { MdModeEditOutline } from "react-icons/md";

const fetchNotes = () => {
  return http().get(endpoints.notes.getAll);
};

const deleteItem = async (itemId) => {
  await http().delete(`${endpoints.notes.getAll}/${itemId}`);
};

const createItem = async (newItem) => {
  await http().post(endpoints.notes.getAll, newItem);
};

const updateItem = async (itemId, updatedItem) => {
  await http().put(`${endpoints.notes.getAll}/${itemId}`, updatedItem);
};

const Notes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [action, setAction] = useState(null);
  const [show, setShow] = useState(false);

  const toggleDropdown = (id) => {
    setShow((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const queryClient = useQueryClient();

  const deleteMutation = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted.");
    },
    onError: () => {
      toast.error("Failed to delete Note.");
    },
  });

  const handleDelete = (itemId) => {
    deleteMutation.mutate(itemId);
  };

  const createMutation = useMutation(createItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created successfully.");
    },
    onError: () => {
      toast.error("Failed to create Note.");
    },
  });

  const handleCreate = (newItem) => {
    createMutation.mutate(newItem);
  };

  const updateMutation = useMutation(
    (updatedItem) => updateItem(selected, updatedItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notes"] });
        toast.success("Note updated successfully.");
      },
      onError: () => {
        toast.error("Failed to update Note.");
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

  if (isError) return <h2>{error?.message}</h2>;

  return (
    <div className="space-y-6">
      <Title text="All Notes" />
      <div className="grid grid-cols-2 gap-8">
        <div
          className="bg-white p-4 rounded-xl space-y-4 flex justify-center items-center cursor-pointer"
          onClick={() => {
            setAction("add");
            openModal();
          }}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <AiOutlinePlus className="text-6xl bg-primary p-2 text-white rounded-full" />
            <h3 className="font-bold">Add New Note</h3>
          </div>
        </div>
        {data.map((item) => (
          <div
            className="bg-white p-8 rounded-xl"
            onMouseLeave={() => setShow(false)}
          >
            <div className="flex justify-between">
              <h3 className="font-bold">{item.title}</h3>
              <div className="relative">
                <FiMoreVertical
                  onClick={() => toggleDropdown(item.id)}
                  className="cursor-pointer"
                />
                {show[item.id] && (
                  <div className="absolute top-4 right-0 mt-2 bg-white rounded-lg shadow-md">
                    <ul className="py-2 max-w-max">
                      <li
                        className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                        onClick={() => {
                          openModal();
                          setAction("edit");
                          setSelected(item.id);
                        }}
                      >
                        <MdModeEditOutline />
                        Edit
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                        onClick={() => {
                          openModal();
                          setAction("view");
                          setSelected(item.id);
                        }}
                      >
                        <BsFillEyeFill />
                        View
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
            </div>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateNote
          handleCreate={handleCreate}
          closeModal={closeModal}
          selected={selected}
          action={action}
          handleUpdate={handleUpdate}
          type="notes"
        />
      </Modal>
    </div>
  );
};

export default Notes;
