import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const fetchCourses = () => {
  return http().get(endpoints.courses.getAll);
};

const fetchBatches = () => {
  return http().get(endpoints.batch.getAll);
};

export default function ProfileCard({ user }) {
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const { isLoading: batchesLoading, data: batches } = useQuery({
    queryKey: ["fetchBatches"],
    queryFn: fetchBatches,
  });

  console.log({ courses, batches });

  return (
    <div className="p-4">
      <div>
        <img
          src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${user?.image_url}`}
          alt={user?.first_name}
          className="w-40 h-40 mx-auto object-cover object-center rounded-full"
        />
        <div className="text-center text-xl font-bold capitalize mt-2">
          {user?.first_name} {user?.last_name}
        </div>
        <div className="text-center text-gray-300">@{user?.username}</div>
        <p className="text-center mt-4">
          {batchesLoading || coursesLoading ? (
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-6 animate-pulse bg-primary h-3.5 rounded-md brightness-90"></div>
              <div className="col-span-2 animate-pulse bg-primary h-3.5 rounded-md brightness-90"></div>
              <div className="col-span-4 animate-pulse bg-primary h-3.5 rounded-md brightness-90"></div>
            </div>
          ) : (
            `You currently have ${courses?.length} courses and ${batches?.length} batches.`
          )}
        </p>
      </div>
    </div>
  );
}
