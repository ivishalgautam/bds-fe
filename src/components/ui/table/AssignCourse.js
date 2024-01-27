import { capitalize } from "@/utils/utils";
import React, { useEffect, useState } from "react";
import { BsFillEyeFill } from "react-icons/bs";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import Table from "./Table";
import { IoEyeOutline } from "react-icons/io5";

export default function AssignCourseTable({
  data: assignCourses,
  setType,
  openModal,
  setCoursesAssignId,
  handleDelete,
}) {
  const [data, setData] = useState([]);
  function handleSearch(e) {
    const inputValue = e.target.value.toLowerCase();
    const filtered = assignCourses?.filter(
      (item) =>
        item.status.toLowerCase().includes(inputValue) ||
        item.username.toLowerCase().includes(inputValue) ||
        item.role.toLowerCase().includes(inputValue) ||
        item.course_name.toLowerCase().includes(inputValue)
    );
    setData(filtered);
  }

  useEffect(() => {
    setData(assignCourses);
  }, [assignCourses]);

  const columns = [
    {
      name: "Course name",
      selector: (row, key) => capitalize(row.course_name),
    },
    {
      name: "Username",
      selector: (row) => row.username,
    },
    {
      name: "Role",
      selector: (row) => row.role,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
    {
      name: "Actions",
      selector: (row) => (
        <div className="space-x-2">
          <button
            onClick={() => {
              setCoursesAssignId(row.id);
              openModal();
              setType("edit");
            }}
            className="bg-primary group p-2 rounded hover:brightness-90 transition-all border space-x-2"
          >
            <FaPen size={20} className="text-white" />
          </button>
          <button
            onClick={() => {
              setCoursesAssignId(row.id);
              openModal();
              setType("view");
            }}
            className="bg-primary group p-2 rounded hover:brightness-90 transition-all border space-x-2"
          >
            <IoEyeOutline size={20} className="text-white" />
          </button>
          <button
            className="bg-primary group p-2 rounded hover:brightness-90 transition-all border space-x-2"
            onClick={() => handleDelete(row.id)}
          >
            <MdDeleteOutline size={20} className="text-white" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex justify-between">
        <div>
          <div className="relative">
            <input
              type="text"
              onChange={(e) => handleSearch(e)}
              placeholder="Search"
              name="search"
              className="rounded shadow px-3 py-2 outline-primary"
            />
          </div>
        </div>
      </div>
      <div className="rounded-lg overflow-hidden">
        <Table data={data} columns={columns} />;
      </div>
    </>
  );
}
