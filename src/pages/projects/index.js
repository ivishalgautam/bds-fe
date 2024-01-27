import React, { useState } from "react";
import { endpoints } from "../../utils/endpoints";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CreateProject from "../../components/Forms/CreateProjects";
import Spinner from "../../components/Spinner";
import Modal from "../../components/Modal";
import { AiOutlinePlus } from "react-icons/ai";
import ProjectCard from "../../components/Cards/ProjectCard";
import toast from "react-hot-toast";
import http from "@/utils/http";
import Title from "@/components/Title";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/ui/table/Pagination";

const fetchProject = () => {
  return http().get(endpoints.projects.getAll);
};

const createProject = async (newItem) => {
  await http().post(endpoints.projects.getAll, newItem);
};

const updateItem = async (itemId, updatedItem) => {
  await http().put(`${endpoints.projects.getAll}/${itemId}`, updatedItem);
};

const deleteItem = async (itemId) => {
  await http().delete(`${endpoints.projects.getAll}/${itemId}`);
};

export default function Project() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [type, setType] = useState(null);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["project"],
    queryFn: fetchProject,
  });

  const {
    params,
    pathname,
    router,
    totalPages,
    resultsToShow,
    setResultsToShow,
    startIndex,
    endIndex,
  } = usePagination({ data: data, perPage: 8 });

  const queryClient = useQueryClient();

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const createMutation = useMutation(createProject, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
      toast.success("Project created successfully.");
    },
    onError: () => {
      toast.error("Failed to create Project.");
    },
  });

  const handleCreate = (newItem) => {
    createMutation.mutate(newItem);
  };

  const updateMutation = useMutation(
    (updatedItem) => updateItem(selectedCourse, updatedItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["project"] });
        toast.success("Project updated successfully.");
      },
      onError: () => {
        toast.error("Failed to update Project.");
      },
    }
  );

  const handleUpdate = (updatedItem) => {
    updateMutation.mutate(updatedItem);
  };

  const deleteMutation = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
      toast.success("Project deleted.");
    },
    onError: () => {
      toast.error("Failed to delete Project.");
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

  if (isError) return <h2>{error?.message}</h2>;

  return (
    <div className="space-y-6">
      <Title text="Project" />
      <div className="grid grid-cols-3 gap-4">
        <div
          className="bg-white p-4 rounded-2xl space-y-4 flex justify-center items-center cursor-pointer"
          onClick={() => {
            setType("add");
            openModal();
          }}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <AiOutlinePlus className="text-5xl bg-primary p-2 text-white rounded-full" />
            <p>Add New Project</p>
          </div>
        </div>
        {resultsToShow?.slice(startIndex, endIndex)?.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            setType={setType}
            openModal={openModal}
            setSelectedCourse={setSelectedCourse}
            handleDelete={handleDelete}
          />
        ))}
      </div>

      {totalPages > 0 && (
        <Pagination
          params={params}
          router={router}
          pathname={pathname}
          resultsToShow={resultsToShow}
          endIndex={endIndex}
          totalPages={totalPages}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateProject
          handleCreate={handleCreate}
          selectedCourse={selectedCourse}
          type={type}
          handleUpdate={handleUpdate}
          closeModal={closeModal}
          ProjectId={selectedCourse}
        />
      </Modal>
    </div>
  );
}
