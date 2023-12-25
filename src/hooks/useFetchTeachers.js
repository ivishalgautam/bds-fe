// useFetchCoursesNames.js

import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

const fetchTeachers = async () => {
  const res = await http().get(endpoints.teachers.getAll);
  //   const data = await res.map(({ user_id: value, username: label }) => {
  //     return { value, label };
  //   });

  return res;
};

export function useFetchTeachers(role) {
  return useQuery(["fetchTeachers"], () => fetchTeachers(), {
    enabled: role === "sub_franchisee",
  });
}
