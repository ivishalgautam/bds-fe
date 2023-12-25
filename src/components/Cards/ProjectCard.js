import React, { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import Title from "../../components/Title";
import { MdModeEditOutline } from "react-icons/md";
import { BsFillEyeFill } from "react-icons/bs";
import { AiOutlineFileDone } from "react-icons/ai";
// import http from "../../utils/http";
// import { endpoints } from "../../utils/endpoints";

export default function ProjectCard({
  project,
  setSelectedCourse,
  setType,
  openModal,
  handleDelete,
}) {
  const [show, setShow] = useState(false);
  // To do: Show file
  // const [dataURI, setDataURI] = useState(null);
  // const handleViewFile = async (file) => {
  //   const documentFile = await http().get(
  //     endpoints.files.getFiles +
  //       "?file_path=documents/1690024637451_holiday.pdf"
  //   );
  //   const dataURI = `data:application/pdf;base64${btoa(
  //     String.fromCharCode(...new Uint8Array(documentFile))
  //   )}`;
  //   const newWindow = window.open();
  //   newWindow.document.write(
  //     `<iframe src="${dataURI}" style="width: 100%; height: 100vh;"></iframe>`
  //   );
  //   console.log(dataURI);
  // };
  return (
    <div
      className="bg-white p-4 rounded-2xl space-y-4 flex items-start justify-between h-30"
      onMouseLeave={() => setShow(false)}
      key={project.id}
    >
      <div className="space-y-2 w-full">
        <div className="flex justify-between items-center">
          <Title text={project.project_name} />
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
                      setSelectedCourse(project.id);
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
                      setSelectedCourse(project.id);
                    }}
                  >
                    <BsFillEyeFill />
                    View
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                    onClick={() => handleDelete(project.id)}
                  >
                    <FaTrashAlt />
                    Delete
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex mt-2 gap-2 overflow-hidden">
          <div>
            <p>Course</p>
            <p>Week</p>
            <p>File</p>
          </div>
          <div>
            <p>: &nbsp;{project?.course_name || ""}</p>
            <p>
              : &nbsp;{project.weeks} {project.weeks > 1 ? "Weeks" : "Week"}
            </p>
            <div className="flex gap-2">
              : &nbsp;
              <div className="relative">
                <AiOutlineFileDone
                  size={30}
                  className="mr-2"
                  // onClick={() => handleViewFile(project.project_file)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
