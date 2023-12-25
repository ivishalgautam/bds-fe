import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { isObject } from "@/utils/object";
import useLocalStorage from "@/utils/useLocalStorage";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast from "react-hot-toast";

const postHomework = async (data) => {
  return await http().post(endpoints.homeworks.uploadHomework, data);
};

export default function UploadHomework() {
  const [fileName, setFileName] = useState("Click to upload homework");
  const [file, setFile] = useState(null);
  const router = useRouter();
  const { courseId, batchId, week, day } = router.query;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [token] = useLocalStorage("token");

  const handleFileUpload = async (event) => {
    try {
      const selectedFile = event.target.files[0];
      if (!selectedFile) {
        return toast.error("No file selected!");
      }

      if (event.target.files.length > 0) {
        setFileName(event.target.files[0].name);
      } else {
        setFileName("Click to upload image");
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const { data } = await axios.post(
        `${baseUrl}${endpoints.files.upload}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Set the Authorization header with the token
          },
        }
      );

      setFile(data.path[0]);

      console.log(data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const mutation = useMutation(postHomework, {
    onSuccess: () => {
      toast.success("File uploaded successfully");
    },
    onError: (err) => {
      if (isObject(err)) {
        toast.error(err.message);
      } else {
        toast.error("Error file uploading");
      }
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      return toast.error("Please select your homework!");
    }

    mutation.mutate({
      course_id: courseId,
      batch_id: batchId,
      week: week,
      day: day,
      file: file,
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label className="relative flex flex-col items-center gap-4 cursor-pointer h-200 w-300 border-2 border-dashed border-gray-300 bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center">
            <svg
              className="h-16 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill=""
              viewBox="0 0 24 24"
            >
              <path
                fill=""
                d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 10 11 9.55228 11 9V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                clipRule="evenodd"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="flex items-center justify-center">
            <span className="font-normal text-gray-700">{fileName}</span>
          </div>
          <input
            type="file"
            id="file"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>

        <button className="w-full px-6 py-3 bg-primary rounded-full text-white mt-4">
          Submit
        </button>
      </form>
    </div>
  );
}
