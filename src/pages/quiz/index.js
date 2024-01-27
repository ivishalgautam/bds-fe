import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AiOutlinePlus } from "react-icons/ai";
import Title from "@/components/Title";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import Spinner from "@/components/Spinner";
import QuizCard from "@/components/Cards/QuizCard";
import Link from "next/link";
import toast from "react-hot-toast";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/ui/table/Pagination";

const fetchQuiz = () => {
  return http().get(endpoints.quiz.getAll);
};

const deleteItem = async (itemId) => {
  await http().delete(`${endpoints.quiz.getAll}/${itemId}`);
};

export default function Quiz() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["quiz"],
    queryFn: fetchQuiz,
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
  } = usePagination({ data: data, perPage: 8 });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz"] });
      toast.success("Quiz deleted.");
    },
    onError: () => {
      toast.error("Failed to delete Quiz.");
    },
  });

  const handleDelete = (itemId) => {
    deleteMutation.mutate(itemId);
  };

  if (isLoading)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );

  if (isError) return <h2>{error?.message}</h2>;

  return (
    <div className="space-y-6">
      <Title text="Quiz" />
      <div className="grid grid-cols-3 gap-4">
        <Link
          href="/quiz/create"
          className="bg-white p-4 rounded-xl space-y-4 flex justify-center items-center cursor-pointer"
        >
          <div className="bg-white p-4 rounded-2xl space-y-4 flex justify-center items-center cursor-pointer">
            <div className="flex flex-col items-center justify-center space-y-2">
              <AiOutlinePlus className="text-5xl bg-primary p-2 text-white rounded-full" />
              <p>Add New Quiz</p>
            </div>
          </div>
        </Link>

        {resultsToShow?.slice(startIndex, endIndex)?.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} handleDelete={handleDelete} />
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
