import React, { useState } from "react";
import Title from "../../components/Title";
import { endpoints } from "../../utils/endpoints";
import http from "../../utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "../../components/Spinner";
import HomeWorkCard from "../../components/Cards/HomeWorkCard";
import CreateHomeWork from "../../components/Forms/CreateHomeWork";
import Modal from "../../components/Modal";
import { AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
import toast from "react-hot-toast";

const fetchHomeworks = () => {
  return http().get(endpoints.homeworks.getAll);
};

const createItem = async (newItem) => {
  await http().post(endpoints.homeworks.getAll, newItem);
};

const deleteItem = async (itemId) => {
  await http().delete(`${endpoints.homeworks.getAll}/${itemId}`);
};

const updateItem = async (itemId, updatedItem) => {
  await http().put(`${endpoints.homeworks.getAll}/${itemId}`, updatedItem);
};

export default function Homework() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState(null);
  const [type, setType] = useState(null);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: ["homeworks"],
    queryFn: fetchHomeworks,
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation(createItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeworks"] });
      toast.success("Homework created successfully.");
    },
    onError: () => {
      toast.error("Failed to create Homework.");
    },
  });

  const handleCreate = (newItem) => {
    createMutation.mutate(newItem);
  };

  const deleteMutation = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeworks"] });
      toast.success("Homework deleted.");
    },
    onError: () => {
      toast.error("Failed to delete Homework.");
    },
  });

  const handleDelete = (itemId) => {
    deleteMutation.mutate(itemId);
  };

  const updateMutation = useMutation(
    (updatedItem) => updateItem(productId, updatedItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["homeworks"] });
        toast.success("Homework updated successfully.");
      },
      onError: () => {
        toast.error("Failed to update Homework.");
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

  return (
    <div className="space-y-6">
      <Title text="Homework" />

      <div className="grid grid-cols-2 gap-6">
        <Link
          href="/homework/create"
          className="bg-white p-4 rounded-2xl space-y-4 flex justify-center items-center cursor-pointer"
          onClick={() => {
            setType("add");
          }}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <AiOutlinePlus className="text-6xl bg-primary p-2 text-white rounded-full" />
            <p>Add New HomeWork</p>
          </div>
        </Link>

        {data.map((homework, i) => (
          <HomeWorkCard
            key={i}
            data={homework.homework}
            courseName={homework.course_name}
            title={homework.homework[0].day_wise[0].heading}
            description={homework.homework[0].description}
            weeks={homework.duration}
            days={homework.days}
            handleDelete={handleDelete}
            id={homework.id}
            openModal={openModal}
            setType={setType}
            setProductId={setProductId}
            isDisabled={homework.is_disabled}
          />
        ))}
      </div>
    </div>
  );
}
