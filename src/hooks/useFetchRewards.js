import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

import { useQuery } from "@tanstack/react-query";

async function fetchRewards() {
  return await http().get(endpoints.rewards.getAll);
}

export function useFetchRewards(shouldFetch) {
  const { data, isLoading, isError, error } = useQuery(
    ["rewards"],
    () => fetchRewards(),
    { enabled: shouldFetch }
  );

  return shouldFetch
    ? {
        data: data?.length === 0 ? [{ reward_points: 0 }] : data,
        isLoading,
        isError,
        error,
      }
    : { data: null, isLoading: false };
}
