import React, { useState } from "react";
import Title from "../Title";
import { FiMoreVertical } from "react-icons/fi";
import { MdModeEditOutline } from "react-icons/md";
import { BsFillEyeFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";

function BatchCard({
  handleDelete,
  openModal,
  batch,
  selectedBatch,
  setSelectedBatch,
  setType,
}) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="bg-white p-8 rounded-xl space-y-4"
      onMouseLeave={() => setShow(false)}
    >
      <div className="flex justify-between items-center">
        <Title text={batch.batch_name} />
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
                    openModal();
                    setType("edit");
                    setSelectedBatch(batch.id);
                  }}
                >
                  <MdModeEditOutline />
                  Edit
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                  onClick={() => {
                    openModal();
                    setType("view");
                    setSelectedBatch(batch.id);
                  }}
                >
                  <BsFillEyeFill />
                  View
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                  onClick={() => handleDelete(batch.id)}
                >
                  <FaTrashAlt />
                  Delete
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <div>
          <p className="font-bold">Teacher :</p>

          <p className="font-bold">Students :</p>

          <p className="font-bold">Courses :</p>
        </div>
        <div>
          <p>
            {batch.teacher_first_name != null && batch.teacher_last_name != null
              ? batch.teacher_first_name + " " + batch.teacher_last_name
              : batch.teacher_username
              ? batch.teacher_username
              : "___"}
          </p>
          <p>
            {batch.students_id.length === 0
              ? "___"
              : `${batch.students_id.length} ${
                  batch.students_id.length === 1 ? "Student" : "Students"
                }`}
          </p>
          <p>{batch.course_name}</p>
        </div>
      </div>
    </div>
  );
}

export default BatchCard;
