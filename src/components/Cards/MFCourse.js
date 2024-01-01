import React from "react";
import CourseImg from "../../assets/course.svg";
import Image from "next/image";
import Link from "next/link";

export default function MFCourse({
  title,
  description,
  duration,
  thumbnail,
  id,
  type,
  handleSubmitQuery,
  is_queried,
}) {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {thumbnail ? (
        <img
          src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${thumbnail}`}
          className="w-full object-cover aspect-video"
        />
      ) : (
        <Image src={CourseImg} />
      )}
      <div className="p-4 space-y-2">
        <div>
          <p className="">{title}</p>
          <p className="text-xs text-[#252832]">Duration: {duration} Weeks</p>
        </div>
        <p className="text-[#11505D] text-sm">{description}</p>
        {type === "unassigned" ? (
          !is_queried ? (
            <button
              type="button"
              className="bg-primary inline-block font-primary text-white p-2 rounded-md"
              onClick={() => handleSubmitQuery(id)}
            >
              Enquire Now
            </button>
          ) : (
            <button
              type="button"
              className="bg-primary inline-block font-primary text-white p-2 rounded-md"
            >
              Enquiry sent
            </button>
          )
        ) : (
          <Link
            href={`/courses/details/${id}`}
            className="bg-primary inline-block font-primary text-white p-2 rounded-md"
          >
            View Course
          </Link>
        )}
      </div>
    </div>
  );
}
