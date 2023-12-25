import React from "react";
import Title from "../Title";
import Link from "next/link";

export default function ClassCard({
  id,
  course_name,
  course_thumbnail,
  progress: { progress, totalDays },
}) {
  return (
    <Link href={`/classes/${id}`}>
      <div className="rounded-lg bg-white shadow-lg">
        <div className="shadow-lg">
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${course_thumbnail}`}
            alt=""
            className="rounded-lg"
          />
        </div>
        <div className="p-4">
          <h2 className="text-sm font-bold m-0">Course name: {course_name}</h2>
          <p className="text-xs font-bold m-0 text-gray-400">
            Duration: {totalDays} days
          </p>
          <div className="rounded h-4 w-full overflow-hidden bg-gray-300 mt-4">
            <div
              style={{ width: `${progress}%` }}
              className={`h-full bg-primary transition-all`}
            ></div>
          </div>
          <span className="text-xs font-bold">{progress}%</span>
        </div>
      </div>
    </Link>
  );
}
