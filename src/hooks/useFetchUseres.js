import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

const fetchUsers = async () => {
  const data = await http().get(endpoints.users);
  return data;
};

export function useFetchUsers() {
  return useQuery(["fetchUsers"], () => fetchUsers());
}
