// useFetchCoursesNames.js

import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

const fetchLeads = async () => {
  return await http().get(endpoints.leads.getAll);
};

export function useFetchLeads() {
  return useQuery(["fetchLeads"], () => fetchLeads());
}
