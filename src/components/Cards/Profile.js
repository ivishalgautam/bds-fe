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

export default function ProfileCard({ user, progress, minPoint, maxPoint }) {
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const { isLoading: batchesLoading, data: batches } = useQuery({
    queryKey: ["fetchBatches"],
    queryFn: fetchBatches,
  });

  return (
    <div className="p-4 pb-8 relative">
      <img
        src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${user?.image_url}`}
        alt={user?.first_name}
        className="w-32 h-32 mx-auto object-cover object-center rounded-full"
      />

      <div className="text-center text-xl font-bold capitalize mt-2">
        {user?.first_name} {user?.last_name}
      </div>

      <div className="text-center text-gray-300">@{user?.username}</div>
      <div className="text-center mt-2">
        {batchesLoading || coursesLoading ? (
          <Loading />
        ) : (
          <>
            <p>{`Purchased courses: ${courses?.length}`}</p>
            <p>{`Ongoing courses: ${batches?.length}`}</p>
          </>
        )}
      </div>

      {/* progress */}
      <div className="rounded h-4 w-full bg-indigo-500 mt-4 relative z-0">
        <div
          style={{ width: `${progress}%` }}
          className={`h-full bg-white text-black transition-all relative rounded`}
        >
          <span
            className={`absolute text-[10px] left-full ml-1 font-bold text-white`}
          >
            {Math.round(progress)}%
          </span>
        </div>
        <span className="absolute top-full left-0 text-white font-bold text-xs">
          {minPoint} points
        </span>
        <span className="absolute top-full right-0 text-white font-bold text-xs">
          {maxPoint} points
        </span>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="space-y-2">
      <div className="col-span-6 animate-pulse bg-primary h-3.5 rounded-md brightness-90 w-1/2 mx-auto"></div>
      <div className="col-span-2 animate-pulse bg-primary h-3.5 rounded-md brightness-90 w-1/3 mx-auto"></div>
    </div>
  );
}
