import { MainContext } from "@/store/context";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { isObject } from "@/utils/object";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";
import { GoProjectRoadmap } from "react-icons/go";
import {
  MdHomeWork,
  MdOutlineDriveFolderUpload,
  MdOutlineQuiz,
} from "react-icons/md";
import { PiFilePptDuotone } from "react-icons/pi";
import { TbFileCheck } from "react-icons/tb";

const deleteMyHomework = async ({ id }) => {
  await http().delete(`${endpoints.homeworks.myHomeworks}/${id}`);
};

const deleteMyProject = async ({ id }) => {
  await http().delete(`${endpoints.projects.myProjects}/${id}`);
};

const CourseAccordion = ({
  data,
  homeworks,
  myHomeworks,
  projects,
  myProjects,
  quizs,
  batchId,
  handleWeekComplete,
  type,
  openDoc,
}) => {
  const { user } = useContext(MainContext);
  const [openIndex, setOpenIndex] = useState(null);
  const queryClient = useQueryClient();
  const handleToggleAccordion = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  function getQuiz(weeks) {
    return quizs?.filter((quiz) => quiz.weeks === weeks);
  }

  const isHomework = (week, day) => {
    const data = homeworks[0]?.homework
      ?.filter((h) => h.weeks === week)[0]
      .day_wise.filter((homework) => homework.days === day);

    return data;
  };

  const isPpt = (index, day) => {
    return homeworks[0].homework[index].day_wise.filter(
      (homework) => homework.days === day
    );
  };

  const getMyHomework = (week, day) => {
    return myHomeworks
      ?.filter((mh) => week === mh.week)
      .filter((d) => d.day === day);
  };
  const isProject = (week) => {
    return projects?.filter((p) => week == p.weeks);
  };

  const getMyProject = (week) => {
    return myProjects?.filter((mp) => week === mp.week)[0];
  };

  const homeworkDelete = useMutation(deleteMyHomework, {
    onSuccess: () => {
      toast.success("Homework deleted");
      queryClient.invalidateQueries("fetchMyHomeworks");
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const projectDelete = useMutation(deleteMyProject, {
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries("fetchMyProjects");
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  return (
    <div className="space-y-4">
      {data?.map((item, index) => (
        <div key={index} className="border rounded-md">
          <button
            className="flex justify-between items-center w-full px-4 py-2"
            onClick={() => handleToggleAccordion(index)}
          >
            <p className="font-bold font-mulish text-lg">Week {item.weeks}</p>
            {type === "class" && (
              <div className="ml-auto flex items-center justify-center mx-8 gap-6">
                {/* for project completion */}
                {user?.role !== "student" ? null : isProject(item.weeks)
                    ?.length === 0 ? null : getMyProject(item.weeks) ? (
                  <div className="relative">
                    <AiFillCloseCircle
                      className="absolute -top-2 -right-2 text-rose-500 z-50 cursor-pointer"
                      onClick={() =>
                        projectDelete.mutate({
                          id: getMyProject(item.weeks)?.id,
                        })
                      }
                    />
                    <div
                      download
                      onClick={() => openDoc(getMyProject(item.weeks)?.file)}
                      href={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${
                        getMyProject(item.weeks)?.file
                      }`}
                      target="_blank"
                      className={`flex items-center justify-center flex-col`}
                    >
                      <TbFileCheck size={25} className="text-primary" />
                      <p className="font-semibold text-xs text-center">
                        Project <br /> uploaded
                      </p>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={`/projects/upload/${homeworks?.[0]?.course_id}/${batchId}/${item.weeks}`}
                    className={`flex items-center justify-center flex-col`}
                  >
                    <MdOutlineDriveFolderUpload
                      size={25}
                      className="text-primary"
                    />
                    <p className="font-semibold text-xs text-center">
                      Upload <br /> project
                    </p>
                  </Link>
                )}

                {/* project link */}
                {isProject(item.weeks)?.length > 0 && (
                  <div
                    className={`text-xs font-semibold `}
                    onClick={() =>
                      openDoc(isProject(item.weeks)?.[0].project_file)
                    }
                  >
                    <GoProjectRoadmap
                      size={25}
                      className="text-primary mx-auto"
                    />
                    Project
                  </div>
                )}

                {/* quiz link */}
                {getQuiz(item.weeks)?.length > 0 &&
                  item.day_wise.every((i) => i.is_completed) && (
                    <Link
                      href={
                        user?.role !== "student"
                          ? "#"
                          : `/batches/quiz/${batchId}?w=${item.weeks}`
                      }
                      className={`text-xs font-semibold`}
                    >
                      <MdOutlineQuiz size={25} className="text-primary" />
                      Quiz
                    </Link>
                  )}
              </div>
            )}

            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                openIndex !== index ? "transform rotate-180" : ""
              }`}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.0001 9.62155L4.06077 17.5609L1.93945 15.4396L12.0001 5.37891L22.0608 15.4396L19.9395 17.5609L12.0001 9.62155Z"
                fill="#9A9AB0"
              />
            </svg>
          </button>
          {openIndex === index && (
            <div className="p-4">
              {item.day_wise.map((day, idx) => (
                <div key={idx} className="mb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{day.heading}</h3>
                    <div className="ml-auto mr-10 flex items-center justify-center gap-4">
                      {homeworks !== undefined &&
                        Array.isArray(homeworks) &&
                        homeworks.length !== 0 &&
                        type === "class" && (
                          <>
                            {user?.role !== "student" ? null : isHomework(
                                item.weeks,
                                day.days
                              ).length === 0 ? null : getMyHomework(
                                item.weeks,
                                day.days
                              ).length > 0 ? (
                              user?.role === "student" ? (
                                <div className="relative">
                                  <AiFillCloseCircle
                                    className="absolute -top-2 -right-2 text-rose-500 z-50 cursor-pointer"
                                    onClick={() =>
                                      homeworkDelete.mutate({
                                        id: getMyHomework(
                                          item.weeks,
                                          day.days
                                        )?.[0]?.id,
                                      })
                                    }
                                  />
                                  <div
                                    className={`flex items-center justify-center flex-col cursor-pointer`}
                                    onClick={() =>
                                      openDoc(
                                        getMyHomework(item.weeks, day.days)?.[0]
                                          ?.file
                                      )
                                    }
                                  >
                                    <TbFileCheck
                                      size={25}
                                      className="text-primary"
                                    />
                                    <p className="font-semibold text-xs text-center">
                                      Homework <br /> uploaded
                                    </p>
                                  </div>
                                </div>
                              ) : null
                            ) : (
                              <Link
                                href={`/homework/upload/${homeworks[0].course_id}/${batchId}/${item.weeks}/${day.days}`}
                                className={`flex items-center justify-center flex-col`}
                              >
                                <MdOutlineDriveFolderUpload
                                  size={25}
                                  className="text-primary"
                                />
                                <p className="font-semibold text-xs text-center">
                                  Upload <br /> homework
                                </p>
                              </Link>
                            )}
                            {user?.role === "teacher" ? (
                              <div
                                onClick={() =>
                                  openDoc(
                                    isHomework(item.weeks, day.days)?.[0]?.file
                                  )
                                }
                                target="_blank"
                                className={`flex items-center justify-center flex-col cursor-pointer ${
                                  isHomework(item.weeks, day.days)?.[0]?.file
                                    ? ""
                                    : "hidden"
                                }`}
                              >
                                <MdHomeWork
                                  size={25}
                                  className="text-primary"
                                />
                                <p className="font-semibold text-xs">
                                  Homework
                                </p>
                              </div>
                            ) : (
                              user.role === "student" &&
                              day.is_completed && (
                                <div
                                  onClick={() =>
                                    openDoc(
                                      isHomework(item.weeks, day.days)?.[0]
                                        ?.file
                                    )
                                  }
                                  target="_blank"
                                  className={`flex items-center justify-center flex-col cursor-pointer ${
                                    isHomework(item.weeks, day.days)?.[0]?.file
                                      ? ""
                                      : "hidden"
                                  }`}
                                >
                                  <MdHomeWork
                                    size={25}
                                    className="text-primary"
                                  />
                                  <p className="font-semibold text-xs">
                                    Homework
                                  </p>
                                </div>
                              )
                            )}
                            <Link
                              href={`/presentation?pptUrl=${
                                isPpt(index, day.days)?.[0]?.ppt_file
                              }`}
                              className={`flex items-center justify-center flex-col cursor-pointer ${
                                !isPpt(index, day.days)?.[0]?.ppt_file
                                  ? "hidden"
                                  : ""
                              }`}
                            >
                              <PiFilePptDuotone
                                size={25}
                                className="text-primary"
                              />
                              <p className="font-semibold text-xs">PPT</p>
                            </Link>
                          </>
                        )}
                      {user?.role === "teacher" && (
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={day.is_completed}
                            onChange={(e) => {
                              handleWeekComplete(
                                batchId,
                                item.weeks,
                                e.target.checked,
                                day.days
                              );
                            }}
                          />
                          <span className="slider"></span>
                        </label>
                      )}
                    </div>
                    <span className="text-gray-500">Day {day.days}</span>
                  </div>
                  <p className="text-gray-700">{day.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseAccordion;
