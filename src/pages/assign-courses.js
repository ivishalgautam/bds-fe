import React, { useState } from "react";
import Title from "../components/Title";
import Spinner from "../components/Spinner";
import http from "../utils/http";
import { endpoints } from "../utils/endpoints";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useFetchCoursesNames } from "@/hooks/useFetchCoursesName";
import { AiOutlinePlus } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { BsFillEyeFill } from "react-icons/bs";
import AssignCourseForm from "@/components/Forms/AssignCourses";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { isObject } from "@/utils/object";

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
  const [show, setShow] = useState(false);

  const { data: courses } = useFetchCoursesNames();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["assign-courses"],
    queryFn: fetchAssignCourses,
  });
  // console.log({ data });
  const toggleDropdown = (id) => {
    setShow((prevState) => ({
      [id]: !prevState[id],
    }));
  };

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

      <div
        className="relative shadow-md sm:rounded-lg"
        onMouseLeave={() => setShow(false)}
      >
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Course Name
              </th>
              <th scope="col" className="px-6 py-3">
                User Name
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((assign_courses, index) => (
              <tr
                className="bg-white dark:border-gray-700"
                key={`${index}${assign_courses.id}`}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap"
                >
                  {assign_courses.course_name}
                </th>
                <td className="px-6 py-4 text-gray-700">
                  {assign_courses.username}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {assign_courses.role}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {assign_courses.status}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  <div className="relative">
                    <FiMoreVertical
                      onClick={() => toggleDropdown(assign_courses.id)}
                      className="cursor-pointer"
                    />
                    {show[assign_courses.id] && (
                      <div className="absolute top-4 right-0 mt-2 bg-white rounded-lg shadow-md">
                        <ul className="py-2 max-w-max">
                          <li
                            className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                            onClick={() => {
                              setCoursesAssignId(assign_courses.id);
                              openModal();
                              setType("edit");
                            }}
                          >
                            <MdModeEditOutline />
                            Edit
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                            onClick={() => {
                              setCoursesAssignId(assign_courses.id);
                              openModal();
                              setType("view");
                            }}
                          >
                            <BsFillEyeFill />
                            View
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                            onClick={() => handleDelete(assign_courses.id)}
                          >
                            <FaTrashAlt />
                            Delete
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
