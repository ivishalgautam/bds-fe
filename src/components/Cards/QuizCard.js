import React, { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import Title from "../../components/Title";
import { MdModeEditOutline } from "react-icons/md";
import { BsFillEyeFill } from "react-icons/bs";
import { useRouter } from "next/router";

export default function QuizCard({ quiz, handleDelete }) {
  const [show, setShow] = useState(false);

  const router = useRouter();
  return (
    <div
      className="bg-white p-4 rounded-2xl space-y-4 flex items-start justify-between h-30"
      onMouseLeave={() => setShow(false)}
      key={quiz.id}
    >
      <div className="space-y-2 w-full">
        <div className="flex justify-between items-center">
          <Title text={quiz.quiz_name} />
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
                      router.push(`/quiz/edit/${quiz.id}`);
                    }}
                  >
                    <MdModeEditOutline />
                    Edit
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                    onClick={() => {
                      router.push(`/quiz/${quiz.id}`);
                    }}
                  >
                    <BsFillEyeFill />
                    View
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                    onClick={() => handleDelete(quiz.id)}
                  >
                    <FaTrashAlt />
                    Delete
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex mt-2 gap-2">
          <div>
            <p>Questions</p>
            <p>Course</p>
            <p>Week</p>
          </div>
          <div>
            <p>: &nbsp;{quiz.questions.length}</p>
            <p>: &nbsp;{quiz.course_name}</p>
            <p>
              : &nbsp;{quiz.weeks} {quiz.weeks > 1 ? "Weeks" : "Week"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
