import { truncate } from "@/utils/utils";
import React, { useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

export default function MeetingCard({ meeting, handleDelete }) {
  const [state, setState] = useState({
    value: "",
    copied: false,
  });

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="capitalize text-xl font-semibold">
          {meeting.batch_name}
        </h2>
        <button onClick={() => handleDelete(meeting.id)}>
          <MdDeleteOutline className="text-rose-500" size={30} />
        </button>
      </div>
      <div className="flex items-center justify-start gap-2">
        <span>Start Url: {truncate(meeting.start_url, 20)}</span>
        <a href={meeting.start_url} className="text-sm " target="_blank">
          <FiExternalLink className="text-primary" size={20} />
        </a>
      </div>

      <div>Start time: {new Date(meeting.start_time).toUTCString()}</div>
    </div>
  );
}
