import React, { useContext, useEffect, useState } from "react";
import Title from "../../components/Title";
import Course from "../../components/Cards/Course";
import http from "../../utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "../../components/Spinner";
import { endpoints } from "../../utils/endpoints";
import { AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
import MFCourse from "@/components/Cards/MFCourse";
import { MainContext } from "@/store/context";
import axios from "axios";
import useLocalStorage from "@/utils/useLocalStorage";
import toast from "react-hot-toast";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/ui/table/Pagination";
import { isObject } from "@/utils/object";

const fetchCourses = () => {
  return http().get(endpoints.courses.getAll);
};

const fetchUnassignedCourses = () => {
  return http().get(`${endpoints.courses.getAll}/find/unassigned-course`);
};

const submitQuery = (data) => {
  return http().post(`${endpoints.courses.getAll}/enquiry`, data);
};

export default function Courses() {
  const queryClient = useQueryClient();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [token] = useLocalStorage("token");
  const { user } = useContext(MainContext);
  const { isLoading, isError, data } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
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

  const { data: unAssignedCourses } = useQuery({
    queryKey: ["unassigned-courses"],
    queryFn: fetchUnassignedCourses,
  });

  const submitQueryMutation = useMutation(submitQuery, {
    onSuccess: () => {
      toast.success("We sent the query");
    },
  });

  async function handleSubmitQuery(course_id) {
    try {
      const resp = await axios.post(
        `${baseUrl}${endpoints.courses.getAll}/enquiry`,
        { course_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (resp.statusText === "OK") {
        toast.success(resp.data.message);
        queryClient.invalidateQueries("unassigned-courses");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  }

  const handleDelete = async (itemId) => {
    try {
      const resp = await http().delete(`${endpoints.courses.getAll}/${itemId}`);
      setResultsToShow((prev) => prev.filter((item) => item.id !== itemId));
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
      <Title text="All purchased Courses" />

      <div className="grid grid-cols-4 gap-8 pb-24">
        {user?.role === "admin" && (
          <Link
            href="/courses/create"
            className="bg-white p-4 rounded-xl space-y-4 flex justify-center items-center cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <AiOutlinePlus className="text-6xl bg-primary p-2 text-white rounded-full" />
              <p>Add New Course</p>
            </div>
          </Link>
        )}

        {resultsToShow?.length > 0 ? (
          resultsToShow
            ?.slice(startIndex, endIndex)
            ?.map((item) => (
              <React.Fragment key={item.id}>
                {user?.role === "admin" ? (
                  <Course
                    id={item.id}
                    title={item.course_name}
                    description={item.course_description}
                    thumbnail={item.course_thumbnail}
                    duration={item.duration}
                    quiz={item.total_quizs}
                    projects={item.total_project}
                    user={user}
                    handleDelete={handleDelete}
                  />
                ) : (
                  <MFCourse
                    id={item.id}
                    title={item.course_name}
                    description={item.course_description}
                    thumbnail={item.course_thumbnail}
                    duration={item.duration}
                    quiz={item.quiz}
                    projects={item.projects}
                  />
                )}
              </React.Fragment>
            ))
        ) : (
          <p>No course assigned</p>
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

      {/* more courses */}
      {user?.role !== "admin" && unAssignedCourses?.length > 0 && (
        <>
          <Title text="More Courses" />
          <div className="grid grid-cols-4 gap-8 pb-24">
            {unAssignedCourses?.map((item) => (
              <MFCourse
                key={item.id}
                id={item.id}
                title={item.course_name}
                description={item.course_description}
                thumbnail={item.course_thumbnail}
                duration={item.duration}
                quiz={item.quiz}
                projects={item.projects}
                type="unassigned"
                handleSubmitQuery={handleSubmitQuery}
                is_queried={item.is_queried}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
