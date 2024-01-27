import React from "react";
import Title from "../../components/Title";
import MasterFranchiseeCard from "../../components/Cards/MasterFranchiseeCard";
import http from "../../utils/http";
import { endpoints } from "../../utils/endpoints";
import Spinner from "../../components/Spinner";
import { AiOutlinePlus } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/ui/table/Pagination";

const fetchFranchisees = () => {
  return http().get(endpoints.franchisee.getAll);
};

export default function MasterFranchisee() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["franchisee"],
    queryFn: fetchFranchisees,
  });

  const {
    params,
    pathname,
    router,
    totalPages,
    resultsToShow,
    setResultsToShow,
    startIndex,
    endIndex,
  } = usePagination({ data: data, perPage: 5 });

  if (isLoading)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  if (isError) return <h2>{error?.message}</h2>;

  return (
    <div className="space-y-6">
      <Title text="All Master Franchisee" />

      <div className="grid grid-cols-2 gap-6">
        <Link
          href="/master-franchisee/create"
          className="bg-white p-8 space-y-3 rounded-xl cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <AiOutlinePlus className="text-6xl bg-primary p-2 text-white rounded-full" />
            <p>Add New Franchisee</p>
          </div>
        </Link>
        {resultsToShow?.slice(startIndex, endIndex)?.map((item) => (
          <MasterFranchiseeCard
            key={item.id}
            title={item.franchisee_name}
            subFranchisies={item.total_subfranchisee}
            totalStudents={item.total_students}
            id={item.id}
          />
        ))}
      </div>

      {totalPages > 0 && (
        <Pagination
          params={params}
          router={router}
          pathname={pathname}
          resultsToShow={resultsToShow}
          endIndex={endIndex}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
