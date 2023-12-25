import { useQuery } from "@tanstack/react-query";

const { endpoints } = require("@/utils/endpoints");
const { default: http } = require("@/utils/http");

async function fetchBatch(id, week) {
  const data = await http().get(`${endpoints.batch.getAll}/${id}`);
  return data;
}

export function useFetchQuiz(id) {
  const { data } = useQuery({
    queryKey: ["fetchBatchQuiz"],
    queryFn: () => fetchBatch(id),
    enabled: !!id,
  });

  return id ? { data } : { data: null };
}
