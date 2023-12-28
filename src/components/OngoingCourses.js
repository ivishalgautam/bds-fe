import React from "react";
import CoursesAccordion from "./CoursesAccordion";
import ClassCard from "./Cards/Class";
import { calculateProgress } from "@/utils/calculateProgress";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { IoChatboxEllipsesOutline, IoEyeOutline } from "react-icons/io5";
import { useRouter } from "next/router";

const fetchBatches = () => {
  return http().get(endpoints.batch.getAll);
};

function OngoingCourses() {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["fetchBatches"],
    queryFn: fetchBatches,
  });

  const router = useRouter();

  const handleNavigate = (url) => {
    router.push(url);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold font-primary">Ongoing Classes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data
          ?.slice(0, 6)
          ?.map(
            ({
              course_name,
              course_thumbnail,
              course_syllabus,
              id,
              group_id,
            }) => {
              return (
                <div className="rounded-lg bg-white shadow-lg">
                  <Link href={`/classes/${id}`} key={id}>
                    <div className="shadow-lg">
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${course_thumbnail}`}
                        alt=""
                        className="rounded-lg w-full h-32 object-cover object-center"
                      />
                    </div>

                    <div className="p-4">
                      <h2 className="text-sm font-bold m-0">
                        Course name: {course_name}
                      </h2>
                      <p className="text-xs font-bold m-0 text-gray-400">
                        Duration: {calculateProgress(course_syllabus).totalDays}{" "}
                        days
                      </p>
                      <div className="rounded h-4 w-full overflow-hidden bg-gray-300 mt-4">
                        <div
                          style={{
                            width: `${
                              calculateProgress(course_syllabus).progress
                            }%`,
                          }}
                          className={`h-full bg-primary transition-all`}
                        ></div>
                      </div>
                      <span className="text-xs font-bold">
                        {calculateProgress(course_syllabus).progress}%
                      </span>
                    </div>
                  </Link>
                  <div className="p-4 pt-0 grid grid-cols-2 gap-4 text-xs font-bold">
                    <button onClick={() => handleNavigate(`/classes/${id}`)}>
                      <div className="flex items-center justify-center gap-1.5 bg-primary text-white py-1.5 px-4 rounded-md">
                        <IoEyeOutline size={20} />
                        <span>View</span>
                      </div>
                    </button>
                    {group_id && group_id !== null && (
                      <button
                        onClick={() =>
                          handleNavigate(`/classes/chat/${group_id}`)
                        }
                      >
                        <div className="flex items-center justify-center gap-1.5 bg-primary text-white py-1.5 px-4 rounded-md">
                          <IoChatboxEllipsesOutline size={20} />
                          <span>Chat</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              );
            }
          )}
      </div>
      {/* <CoursesAccordion /> */}
    </div>
  );
}

export default OngoingCourses;
