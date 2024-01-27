import TeacherCard from "@/components/Cards/TeacherCard";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import Pagination from "@/components/ui/table/Pagination";
import usePagination from "@/hooks/usePagination";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { isObject } from "@/utils/object";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlinePlus } from "react-icons/ai";

const fetchStudents = () => {
  return http().get(endpoints.students.getAll);
};

function Students() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [type, setType] = useState(null);

  const { isLoading, isError, data } = useQuery({
    queryKey: ["fetchStudents"],
    queryFn: fetchStudents,
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
  } = usePagination({ data: data, perPage: 3 });

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
      <Title text="All Students" />
      <Link
        href="/students/create"
        className="bg-white p-4 rounded-xl space-y-4 flex justify-center items-center cursor-pointer"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <AiOutlinePlus className="text-6xl bg-primary p-2 text-white rounded-full" />
          <p className="font-bold font-mulish text-lg">Create Student</p>
        </div>
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
        {resultsToShow
          ?.slice(startIndex, endIndex)
          .map(
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
              student_courses,
              student_batches,
              student_reward_points,
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
                setSelectedTeacher={setSelectedTeacher}
                setType={setType}
                handleDelete={handleDelete}
                userRole="students"
                type="sub_franchisee"
                profession={profession}
                course_name={course_name}
                role={role}
                courseId={course_id}
                student_courses={student_courses}
                student_batches={student_batches}
                student_reward_points={student_reward_points}
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
    </div>
  );
}

export default Students;
