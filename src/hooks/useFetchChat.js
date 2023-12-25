import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

const fetchChat = async () => {
  const data = await http().get(endpoints.chat);
  return data;
};

export function useFetchChat() {
  return useQuery(["fetchChat"], () => fetchChat());
}
