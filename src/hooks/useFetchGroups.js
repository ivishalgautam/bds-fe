import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

const { endpoints } = require("@/utils/endpoints");

const fetchGroups = async () => {
  const data = await http().get(endpoints.groups.getAll);
  return data;
};

export function useFetchGroups() {
  return useQuery(["fetchGroups"], () => fetchGroups());
}
