import BatchCard from "@/components/Cards/BatchCard";
import CreateBatch from "@/components/Forms/CreateBatch";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import { useFetchCoursesNames } from "@/hooks/useFetchCoursesName";
import { useFetchStudents } from "@/hooks/useFetchStudents";
import { useFetchTeachers } from "@/hooks/useFetchTeachers";
import { MainContext } from "@/store/context";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlinePlus } from "react-icons/ai";

const fetchBatches = () => {
  return http().get(endpoints.batch.getAll);
};

const createBatch = async (newItem) => {
  await http().post(endpoints.batch.getAll, newItem);
};

const updateItem = async (itemId, updatedItem) => {
  await http().put(`${endpoints.batch.getAll}/${itemId}`, updatedItem);
};

const deleteItem = async (itemId) => {
  await http().delete(`${endpoints.batch.getAll}/${itemId}`);
};

function Batches() {
  const { user } = useContext(MainContext);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [type, setType] = useState(null);
  const { isLoading, isError, data } = useQuery({
    queryKey: ["batches"],
    queryFn: fetchBatches,
  });

  // console.log({ data });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: students } = useFetchStudents();
  const { data: teachers } = useFetchTeachers(user?.role);
  const { data: courses } = useFetchCoursesNames();

  const formatedTeachers = teachers?.map(({ id: value, username: label }) => ({
    value,
    label,
  }));

  const formatedStudents = students?.map(({ id: value, username: label }) => {
    return { value, label };
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation(createBatch, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      toast.success("Batch created successfully.");
    },
    onError: () => {
      toast.error("Failed to create Batch.");
    },
  });

  const handleCreateBatch = (newItem) => {
    createMutation.mutate(newItem);
  };

  const updateMutation = useMutation(
    (updatedItem) => updateItem(selectedBatch, updatedItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["batches"] });
        toast.success("Batch updated successfully.");
      },
      onError: () => {
        toast.error("Failed to update Batch.");
      },
    }
  );

  const handleUpdateBatch = (updatedItem) => {
    updateMutation.mutate(updatedItem);
  };

  const deleteMutation = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      toast.success("Batch deleted.");
    },
    onError: () => {
      toast.error("Failed to delete.");
    },
  });

  const handleDelete = (itemId) => {
    deleteMutation.mutate(itemId);
  };

  if (isLoading)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );

  if (isError) {
    return <h1>Error</h1>;
  }

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Title text="All Batches" />
      <div className="grid grid-cols-2 gap-8">
        <div
          className="bg-white p-4 rounded-2xl space-y-4 flex justify-center items-center cursor-pointer"
          onClick={() => {
            setType("add");
            openModal();
          }}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <AiOutlinePlus className="text-5xl bg-primary p-2 text-white rounded-full" />
            <p className="font-bold font-mulish text-lg">Create Batch</p>
          </div>
        </div>

        {data.map((batch) => (
          <BatchCard
            key={batch.id}
            openModal={openModal}
            batch={batch}
            selectedBatch={selectedBatch}
            setSelectedBatch={setSelectedBatch}
            setType={setType}
            handleDelete={handleDelete}
          />
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateBatch
          students={formatedStudents}
          teachers={formatedTeachers}
          courses={courses}
          handleCreateBatch={handleCreateBatch}
          closeModal={closeModal}
          type={type}
          selectedBatch={selectedBatch}
          handleUpdateBatch={handleUpdateBatch}
        />
      </Modal>
    </div>
  );
}

export default Batches;
