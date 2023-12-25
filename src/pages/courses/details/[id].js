import Spinner from "@/components/Spinner";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import CourseAccordion from "@/components/CourseAccordion";

function CourseDetails() {
  const router = useRouter();
  const { id } = router.query;

  const fetchCourse = () => {
    return http().get(`${endpoints.courses.getAll}/${id}`);
  };
  const { isLoading, isError, data } = useQuery({
    queryKey: ["course"],
    queryFn: fetchCourse,
    enabled: !!id,
  });

  const fetchHomeworks = () => {
    return http().get(`${endpoints.homeworks.getAll}`);
  };

  const { data: homeworks } = useQuery({
    queryKey: ["homework"],
    queryFn: fetchHomeworks,
  });
  const filteredHomeWorks = homeworks?.filter(
    (homework) => homework.course_id === id
  );

  if (isLoading)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );

  if (isError) return <h2>Error</h2>;

  const learnings = [
    "Create mobile app designs from scratch",
    "Create mockups using Figma",
    "Understand the differences between designing for iOS and Android",
    "Start a new career as a UI/UX designer",
    "Create wireframe designs for e-Commerce Project",
  ];
  const requirements = [
    "No pre-knowledge required - we'll teach you everything you need to know",
    "A PC or Mac is required",
    "No software is required in advance of the course (all software used in the course is free or has a demo version)",
  ];
  const summaryPoints = [
    "5 hours on demand video",
    "15 articles",
    "4 downloadalbe resources",
    "Full lifetime access",
    "Access on mobile and tv",
  ];

  return (
    <div className="font-mulish">
      <div className="flex justify-between items-start gap-6">
        <div className="aspect-square p-4 bg-white rounded-md space-y-6">
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${data.course_thumbnail}`}
            className="bg-gray-100 w-full h-60 rounded-md"
          />
          <h1 className="text-2xl font-bold">{data.course_name}</h1>
          {/* <div>
            <div className="flex gap-4">
              <p>4.7 (687 Reviews)</p>
              <p>1250 students</p>
            </div>
            <p>Created by Jack Harper</p>
            <div className="flex gap-4">
              <p>Last update 12/2020</p>
              <p>English</p>
              <p>English (Auto), French (Auto), 5 more</p>
            </div>
          </div> */}
        </div>
        {/* <div className="w-2/5 p-4 bg-white rounded-md space-y-4">
          <div className="flex items-center gap-4 ">
            <p className="text-[#42BDA1] text-3xl">₹{data.regular_price}</p>
            <p className="line-through ">₹{data.discount_price}</p>
          </div>
          <hr className="my-4" />
          <p>This course includes:</p>
          <ul className="space-y-2">
            {summaryPoints.map((item, i) => (
              <li key={i} className="flex gap-2 items-baseline">
                <Image src={Check} alt="" /> {item}
              </li>
            ))}
          </ul>
          <button className="bg-primary text-white w-full py-3 rounded-md">
            Add to Cart
          </button>
        </div> */}
      </div>
      <div className="bg-white p-4 mt-6 rounded-md space-y-6">
        {/* <div className="space-y-4">
          <h1 className="text-2xl font-bold">What you’ll learn</h1>
          <ul className="grid grid-cols-2 gap-3">
            {learnings.map((learning, i) => (
              <li key={i} className="flex gap-2 items-baseline">
                <Image src={Check} alt="" /> {learning}
              </li>
            ))}
          </ul>
        </div> */}
        {/* <div className="space-y-4">
          <h1 className="text-2xl font-bold">Requirement</h1>
          <ul className="space-y-4">
            {requirements.map((requirement, i) => (
              <li key={i} className="flex gap-2 items-center">
                <Image src={Dot} alt="" />
                {requirement}
              </li>
            ))}
          </ul>
        </div> */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Description</h1>
          <p>{data.course_description}</p>
        </div>
        <h1 className="text-2xl font-bold">Course Content</h1>
        <CourseAccordion
          data={data.course_syllabus}
          homeworks={filteredHomeWorks}
          type="course"
        />
      </div>
    </div>
  );
}

export default CourseDetails;
