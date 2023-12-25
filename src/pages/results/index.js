import Spinner from "@/components/Spinner";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";

const fetchResults = async () => {
  return await http().get(endpoints.results.getAll);
};

const Result = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["fetchResults"],
    queryFn: fetchResults,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.map((result) => (
        <div className="bg-white p-6 shadow-lg rounded-lg space-y-8">
          {/* image */}
          <div className="">
            <div className="w-full relative">
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${result.student_image}`}
                width={100}
                height={100}
                objectFit="cover"
                alt={result.student_name}
                className="mx-auto top-0 left-0 rounded-full border border-primary "
              />
            </div>
            <h3 className="text-xl font-bold text-center mt-2 capitalize">
              {result.student_name}
            </h3>
          </div>

          {/* result content */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-primary text-white p-3 rounded-md text-sm">
              <div className="font-bold bg-white p-1 rounded-sm text-primary inline-block text-xs shadow-md">
                Course name:
              </div>
              <div>{result.course_name}</div>
            </div>
            <div className="bg-primary text-white p-3 rounded-md text-sm">
              <div className="font-bold bg-white p-1 rounded-sm text-primary inline-block text-xs shadow-md">
                Batch name:
              </div>
              <div>{result.batch_name}</div>
            </div>
            <div className="bg-primary text-white p-3 rounded-md text-sm">
              <div className="font-bold bg-white p-1 rounded-sm text-primary inline-block text-xs shadow-md">
                Total questions:
              </div>
              <div>{result.total_questions}</div>
            </div>
            <div className="bg-primary text-white p-3 rounded-md text-sm">
              <div className="font-bold bg-white p-1 rounded-sm text-primary inline-block text-xs shadow-md">
                Attempted questions:
              </div>
              <div>{result.attemted_questions}</div>
            </div>
            <div className="bg-primary text-white p-3 rounded-md text-sm">
              <div className="font-bold bg-white p-1 rounded-sm text-primary inline-block text-xs shadow-md">
                Total points:
              </div>
              <div>{result.total_points}</div>
            </div>
            <div className="bg-primary text-white p-3 rounded-md text-sm">
              <div className="font-bold bg-white p-1 rounded-sm text-primary inline-block text-xs shadow-md">
                Student points:
              </div>
              <div>{result.your_points}</div>
            </div>
            <div className="bg-primary text-white p-3 rounded-md text-sm">
              <div className="font-bold bg-white p-1 rounded-sm text-primary inline-block text-xs shadow-md">
                Wrong answers:
              </div>
              <div>{result.wrong_answers}</div>
            </div>
            <div className="bg-primary text-white p-3 rounded-md text-sm">
              <div className="font-bold bg-white p-1 rounded-sm text-primary inline-block text-xs shadow-md">
                Date:
              </div>
              <div>{new Date(result.created_at).toDateString()}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Result;
