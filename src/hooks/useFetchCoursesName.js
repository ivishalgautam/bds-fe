// useFetchCoursesNames.js

import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

const fetchCourses = async () => {
  const res = await http().get(endpoints.courses.getAll);
  const data = await res.map(({ id, course_name, course_syllabus }) => {
    return { value: id, label: course_name, course_syllabus };
  });
  return data;
};

export function useFetchCoursesNames() {
  return useQuery(["fetchCoursesNames"], () => fetchCourses());
}
