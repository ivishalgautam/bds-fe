// usefetchBatchesNames.js

import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

const fetchBatches = async () => {
  const data = await http().get(endpoints.batch.getAll);
  console.log({ data });
  return data;
};

export function useFetchBatchesNames() {
  return useQuery(["fetchBatchesNames"], () => fetchBatches());
}
