import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

export default function MeetingCard({ meeting, handleDelete }) {
  const [state, setState] = useState({
    value: "",
    copied: false,
  });
  function trim(str, length) {
    return str.length > length ? `${str.substring(0, length)}...` : str;
  }

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
        <span>Start Url: {trim(meeting.start_url, 20)}</span>
        <a href={meeting.start_url} className="text-sm " target="_blank">
          <FiExternalLink className="text-primary" size={20} />
        </a>
      </div>
      {/* <div className="flex items-center justify-start gap-2">
        <span>Join Url: {trim(meeting.join_url, 20)}</span>
        <CopyToClipboard
          text={meeting.join_url}
          onCopy={() => {
            setState((prev) => ({ ...prev, copied: true }));
            toast.success("Copied");
          }}
        >
          <button className="text-sm">
            <FaRegCopy className="text-primary" size={20} />
          </button>
        </CopyToClipboard>
      </div> */}
      <div>Start time: {new Date(meeting.start_time).toUTCString()}</div>
    </div>
  );
}
