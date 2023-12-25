// useFetchCoursesNames.js

import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

const fetchStudents = async () => {
  const data = await http().get(endpoints.students.getAll);
  return data;
};

export function useFetchStudents() {
  return useQuery(["fetchStudents"], () => fetchStudents());
}
