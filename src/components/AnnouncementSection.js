import Link from "next/link";
import React from "react";

export default function AnnouncementSection(data) {
  return (
    <div className="bg-primary p-4 text-white font-mulish rounded-lg">
      <div className="flex items-center my-4">
        <div className="w-1 h-8 bg-white mr-2"></div>
        <h2 className="text-lg font-mulish font-bold">Recent Announcement</h2>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-bold">
            {data.data[0]?.headline || "No Announcements"}
          </h2>
          <p className="text-sm font-semibold">{data.data[0]?.description}</p>
        </div>
        <Link href="/announcements">
          <button className="bg-white text-black px-6 py-2 rounded-md text-sm font-bold">
            Read More
          </button>
        </Link>
      </div>
    </div>
  );
}
