import { useState } from "react";
import TeacherCard from "@/components/Cards/TeacherCard";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AiOutlinePlus } from "react-icons/ai";
import toast from "react-hot-toast";
import Link from "next/link";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/ui/table/Pagination";

const fetchTeachers = () => {
  return http().get(endpoints.teachers.getAll);
};

const createTeacher = async (newItem) => {
  await http().post(endpoints.createUser, newItem);
};

function Teachers() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [type, setType] = useState(null);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const { isLoading, isError, data } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
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
  } = usePagination({ data: data, perPage: 1 });

  const queryClient = useQueryClient();

  const createMutation = useMutation(createTeacher, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher created successfully.");
    },
    onError: () => {
      toast.error("Failed to create Teacher.");
    },
  });

  const handleDelete = async (itemId) => {
    try {
      const resp = await http().delete(`${endpoints.createUser}/${itemId}`);
      setResultsToShow((prev) =>
        prev.filter((item) => item.user_id !== itemId)
      );
    } catch (error) {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error("error deleting student");
      }
    }
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
      <Title text="All Teachers" />
      <Link
        href="/teachers/create"
        className="bg-white p-4 rounded-xl space-y-4 flex justify-center items-center cursor-pointer"
        onClick={() => {
          setType("add");
          openModal();
        }}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <AiOutlinePlus className="text-6xl bg-primary p-2 text-white rounded-full" />
          <p className="font-bold font-mulish text-lg">Create Teacher</p>
        </div>
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
        {resultsToShow
          ?.slice(startIndex, endIndex)
          ?.map(
            ({
              id,
              username,
              first_name,
              last_name,
              image_url,
              batches,
              user_id,
              profession,
              course_name,
              role,
              course_id,
              teacher_courses,
              teacher_total_batches,
            }) => (
              <TeacherCard
                key={id}
                id={user_id}
                username={username}
                first_name={first_name}
                last_name={last_name}
                image_url={
                  process.env.NEXT_PUBLIC_IMAGE_DOMAIN + "/" + image_url
                }
                batches={batches}
                openModal={openModal}
                setSelectedTeacher={setSelectedTeacher}
                setType={setType}
                handleDelete={handleDelete}
                profession={profession}
                course_name={course_name}
                userRole="teachers"
                type="sub_franchisee"
                role={role}
                courseId={course_id}
                teacher_courses={teacher_courses}
                teacher_total_batches={teacher_total_batches}
              />
            )
          )}
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
      {/* <Modal isOpen={isOpen} onClose={closeModal}>
        <CreateTeacher
          handleCreate={handleCreate}
          type={type}
          handleUpdate={handleUpdate}
          closeModal={closeModal}
          userRole="teacher"
          selectedTeacher={selectedTeacher}
        />
      </Modal> */}
    </div>
  );
}

export default Teachers;
