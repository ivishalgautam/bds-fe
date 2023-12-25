import moment from "moment";
import Image from "next/image";
import React, { useState } from "react";
import Avatar from "../assets/avatar.svg";
import { FiMoreVertical } from "react-icons/fi";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";

const Accordion = ({
  items,
  user,
  handleDelete,
  setType,
  openModal,
  setSelected,
}) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [show, setShow] = useState(false);

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const userProfile = (firstName, lastName, username) => {
    let displayName;

    if (firstName && lastName) {
      displayName = `${firstName} ${lastName}`;
    } else if (firstName) {
      displayName = firstName;
    } else if (lastName) {
      displayName = lastName;
    } else {
      displayName = username;
    }

    return (
      <>
        <p className="text-base font-bold font-mulish">{displayName}</p>
      </>
    );
  };

  return (
    <div className="rounded space-y-6">
      {items.map((item, index) => (
        <div key={index} className="bg-white rounded-xl">
          <button
            className="flex justify-between items-center w-full px-4 py-2"
            onClick={() => handleClick(index)}
          >
            <p className="font-bold font-mulish text-lg">{item.headline}</p>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                activeIndex === index ? "transform rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {activeIndex === index && (
            <div className="p-4">
              <div className="rounded-xl space-y-4" key={item.id}>
                <div className="flex justify-between">
                  <div className="border-l-2 border-primary">
                    <p className="ml-3">{item.description}</p>
                  </div>
                  {item.username === user?.username && (
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
                                setSelected(item.id);
                              }}
                            >
                              <MdModeEditOutline />
                              Edit
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-gray-100 flex gap-4 items-center cursor-pointer"
                              onClick={() => handleDelete(item.id)}
                            >
                              <FaTrashAlt />
                              Delete
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* <p>Edit</p>
                <p onClick={() => handleDelete(item.id)}>Delete</p> */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt=""
                        className="h-16 w-16  object-cover rounded-full"
                      />
                    ) : (
                      <Image
                        src={Avatar}
                        alt=""
                        className="h-16 w-16  object-cover rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-bold">
                        {item.username === user?.username
                          ? "YOU"
                          : userProfile(
                              item.first_name,
                              item.last_name,
                              item.username
                            )}
                      </p>
                      {item.profession && (
                        <p className="text-gray-600 text-sm">
                          {item.profession}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-primary font-bold">
                    {moment(item.date).format("DD, MMMM YYYY")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
