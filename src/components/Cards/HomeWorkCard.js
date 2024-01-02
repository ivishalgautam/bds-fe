import React, { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import Title from "../../components/Title";
import { MdModeEditOutline } from "react-icons/md";
import { BsFillEyeFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/router";

export default function HomeWorkCard({
  title,
  description,
  weeks,
  days,
  handleDelete,
  id,
  setType,
  setProductId,
  courseName,
  data,
  isDisabled,
}) {
  const [show, setShow] = useState(false);

  const router = useRouter();

  const totalDays = data.reduce((count, week) => {
    return count + week.day_wise.length;
  }, 0);

  return (
    <div className="bg-white p-4 rounded-2xl">
      <div
        className="space-y-4 flex items-start justify-between "
        onMouseLeave={() => setShow(false)}
      >
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Title text={title.toUpperCase()} />
          </div>
          <div className="flex mt-2 gap-2">
            <div>
              <p>Courses</p>
              <p>Week</p>
              <p>Day</p>
            </div>
            <div>
              <p>: &nbsp;{courseName}</p>
              <p>
                : &nbsp;
                {weeks ? `${weeks} ${weeks > 1 ? "Weeks" : "Week"}` : "---"}
              </p>
              <p>
                : &nbsp;
                {totalDays
                  ? `${totalDays} ${totalDays > 1 ? "Days" : "Day"}`
                  : "---"}
              </p>
            </div>
          </div>
          <p className="line-clamp-2">{description}</p>
        </div>
        <div className="relative">
          <FiMoreVertical
            onClick={() => setShow(true)}
            className="cursor-pointer"
          />
          {show && (
            <div
              className="absolute top-4 right-0 mt-2 bg-white rounded-lg shadow-md"
              onMouseLeave={() => setShow(false)}
            >
              <ul className="py-2 max-w-max">
                <li
                  className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                  onClick={() => {
                    setType("edit");
                    setProductId(id);
                    router.push(`/homework/edit/${id}`);
                  }}
                >
                  <MdModeEditOutline />
                  Edit
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                  onClick={() => {
                    // openModal();
                    setType("view");
                    setProductId(id);
                    router.push(`/homework/${id}`);
                  }}
                >
                  <BsFillEyeFill />
                  View
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                  onClick={() => handleDelete(id)}
                >
                  <FaTrashAlt />
                  Delete
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* <div className="flex items-center justify-end">
        <label className="switch">
          <input
            type="checkbox"
            checked={isDisabled}
            // onChange={(e) => {
            //   updateStudent({
            //     id: row.id,
            //     data: { is_disabled: e.target.checked },
            //   });
            // }}
          />
          <span className="slider"></span>
        </label>
      </div> */}
    </div>
  );
}
