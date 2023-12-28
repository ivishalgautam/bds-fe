import React from "react";
import Title from "../Title";
import Link from "next/link";
import { IoChatboxEllipsesOutline, IoEyeOutline } from "react-icons/io5";
import { useRouter } from "next/router";

export default function ClassCard({
  id,
  course_name,
  course_thumbnail,
  progress: { progress, totalDays },
  group_id,
}) {
  const router = useRouter();
  const handleNavigate = (url) => {
    router.push(url);
  };
  return (
    <div className="rounded-lg bg-white shadow-lg">
      <Link href={`/classes/${id}`}>
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
      </Link>
      <div className="p-4 pt-0 grid grid-cols-2 gap-4">
        <button onClick={() => handleNavigate(`/classes/${id}`)}>
          <div className="flex items-center justify-center gap-1.5 bg-primary text-white py-1.5 px-4 rounded-md">
            <IoEyeOutline size={25} />
            <span>View</span>
          </div>
        </button>
        {group_id && group_id !== null && (
          <button onClick={() => handleNavigate(`/classes/chat/${group_id}`)}>
            <div className="flex items-center justify-center gap-1.5 bg-primary text-white py-1.5 px-4 rounded-md">
              <IoChatboxEllipsesOutline size={25} />
              <span>Chat</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
