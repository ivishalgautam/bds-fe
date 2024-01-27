import React, { useState } from "react";
import Title from "../components/Title";
import Spinner from "../components/Spinner";
import http from "../utils/http";
import { endpoints } from "../utils/endpoints";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useFetchCoursesNames } from "@/hooks/useFetchCoursesName";
import { AiOutlinePlus } from "react-icons/ai";
import AssignCourseForm from "@/components/Forms/AssignCourses";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { isObject } from "@/utils/object";
import AssignCourseTable from "@/components/ui/table/AssignCourse";

const fetchAssignCourses = () => {
  return http().get(endpoints.assign_courses);
};

const deleteItem = async (itemId) => {
  await http().delete(`${endpoints.assign_courses}/${itemId}`);
};

const createItem = async (newItem) => {
  await http().post(endpoints.assign_courses, newItem);
};

const updateItem = async (itemId, updatedItem) => {
  await http().put(`${endpoints.assign_courses}/${itemId}`, updatedItem);
};

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coursesAssignId, setCoursesAssignId] = useState(null);
  const [type, setType] = useState(null);

  const { data: courses } = useFetchCoursesNames();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["assign-courses"],
    queryFn: fetchAssignCourses,
  });
  // console.log({ data });

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
      queryClient.invalidateQueries({ queryKey: ["assign-courses"] });
      toast.success("Course unassigned successfully.");
    },
    onError: () => {
      toast.error("Failed to unassigned course.");
    },
  });

  const handleDelete = (itemId) => {
    deleteMutation.mutate(itemId);
  };

  const createMutation = useMutation(createItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assign-courses"] });
      toast.success("Course assigned successfully.");
    },
    onError: (error) => {
      console.log({ error });
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error("Failed to assign course");
      }
    },
  });

  const handleCreate = (newItem) => {
    createMutation.mutate(newItem);
  };

  const updateMutation = useMutation(
    (updatedItem) => updateItem(coursesAssignId, updatedItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["assign-courses"] });
        toast.success("Course assign updated successfully.");
      },
      onError: () => {
        // console.log({ update: e });
        toast.error("Failed to update course assign.");
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
      <Title text="Assign Course" />
      <div className="flex flex-col items-center space-y-2">
        <div
          className="flex flex-col items-center justify-center"
          onClick={() => {
            setType("add");
            openModal();
          }}
        >
          <AiOutlinePlus className="text-6xl bg-primary p-2 text-white rounded-full" />
          <p>Assign Courses</p>
        </div>
      </div>

      <div className="relative shadow-md sm:rounded-lg">
        <AssignCourseTable
          data={data}
          setType={setType}
          openModal={openModal}
          setCoursesAssignId={setCoursesAssignId}
          handleDelete={handleDelete}
        />
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AssignCourseForm
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          closeModal={closeModal}
          courses={courses}
          coursesAssignId={coursesAssignId}
          type={type}
        />
      </Modal>
    </div>
  );
}
