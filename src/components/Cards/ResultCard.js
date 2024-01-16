import getFileName from "@/utils/filename";
import Image from "next/image";
import React, { useState } from "react";
import { FaRegFilePdf, FaRegUserCircle } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Modal from "../Modal";
import RewardForm from "../Forms/Reward";
import { endpoints } from "@/utils/endpoints";

export default function ResultCard({
  image,
  studentName,
  file,
  setDocs,
  setOpenDocViewer,
  studentId,
  completed,
  type,
}) {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [displayFallbackImg, setDisplayFallbackImg] = useState(false);
  const [isModal, setIsModal] = useState(false);

  let fallbackSrc = `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/public/images/blank-profile-picture.webp`;

  return (
    <div className="bg-white p-3 rounded-md shadow-md grid grid-cols-3 relative">
      <div className="flex items-center justify-center flex-col col-span-1">
        <Image
          src={
            displayFallbackImg
              ? fallbackSrc
              : `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${image}`
          }
          width={80}
          height={80}
          objectFit="cover"
          objectPosition="center"
          className="rounded-xl shadow-md"
          alt={studentName}
          onError={(e) => {
            setDisplayFallbackImg(true);
          }}
        />
      </div>

      <div className="col-span-2 space-y-2">
        <h2 className="font-semibold">
          Name: <span className="font-medium">{studentName}</span>
        </h2>
        {file && (
          <div className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-md p-1.5 inline-block border border-dashed border-primary cursor-pointer">
            {/* <span>View file</span> */}
            {type === "project" ? (
              <a
                href={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${file}`}
                download
              >
                <FaRegFilePdf size={25} className="text-primary inline-block" />
              </a>
            ) : (
              <FaRegFilePdf
                size={25}
                className="text-primary inline-block"
                onClick={() => {
                  const docs = [
                    {
                      uri: `${process.env.NEXT_PUBLIC_API_URL}${
                        endpoints.files.getFiles
                      }?file_path=${getFileName(file)}`,
                      filename: getFileName(file),
                    },
                  ];
                  setDocs(docs);
                  setOpenDocViewer(true);
                }}
              />
            )}
          </div>
        )}
      </div>

      {completed && (
        <button
          className={`absolute top-2 right-2 hover:bg-primary hover:text-white p-2 rounded-full ${
            isDropdownActive ? "bg-primary text-white" : ""
          }`}
          onClick={() => setIsDropdownActive(!isDropdownActive)}
        >
          <HiOutlineDotsVertical size={20} />
        </button>
      )}

      <ul
        className={`${
          isDropdownActive ? "block" : "hidden"
        } shadow-lg rounded-lg bg-white absolute top-10 right-10 p-3 z-10 space-y-2`}
      >
        <li
          onClick={() => {
            setIsModal(true);
            setIsDropdownActive(false);
          }}
          className="text-xs font-bold bg-primary bg-opacity-20 hover:bg-opacity-100 hover:text-white transition-all p-2 rounded-md cursor-pointer"
        >
          Give reward points
        </li>
      </ul>

      <Modal isOpen={isModal} onClose={() => setIsModal(false)}>
        <RewardForm studentId={studentId} setIsModal={setIsModal} />
      </Modal>
    </div>
  );
}
