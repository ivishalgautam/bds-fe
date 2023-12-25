import { useQuery } from "@tanstack/react-query";

const { endpoints } = require("@/utils/endpoints");
const { default: http } = require("@/utils/http");

const fetchInvites = async () => {
  const data = await http().get(`${endpoints.groups.getAll}/invite`);
  return data;
};

export function useFetchInvites(shouldFetch) {
  const { data, isLoading, isError, error } = useQuery(
    ["fetchInvites"],
    () => fetchInvites(),
    {
      enabled: shouldFetch,
    }
  );

  return shouldFetch
    ? { data, isLoading, isError, error }
    : { data: null, isLoading: false };
}
