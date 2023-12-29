import Title from "@/components/Title";
import React, { useState } from "react";
// import UploadRecordingImg from "../../assets/upload-recording.svg";
import Image from "next/image";
import { useFetchCoursesNames } from "@/hooks/useFetchCoursesName";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { useFetchBatchesNames } from "@/hooks/useFetchBatchesName";
import useLocalStorage from "@/utils/useLocalStorage";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { endpoints } from "@/utils/endpoints";
import UploadImg from "../../../assets/upload.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useRef } from "react";

const createRecordings = async (newItem) => {
  await http().post(endpoints.recordings.getAll, newItem);
};

function UploadRecording() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm();
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data: courseOptions } = useFetchCoursesNames();
  const { data: batchesData } = useFetchBatchesNames();
  const menuPortalTargetRef = useRef(null);

  const queryClient = useQueryClient();
  const router = useRouter();

  const createMutation = useMutation(createRecordings, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recordings"] });
      toast.success("Recording uploaded successfully.");
      router.push("/recordings");
    },
    onError: () => {
      toast.error("Failed to upload Recording.");
      router.push("/recordings");
    },
  });

  const handleCreate = (newItem) => {
    createMutation.mutate(newItem);
  };

  const batchOptions = batchesData?.map(({ id, batch_name }) => ({
    label: batch_name,
    value: id,
  }));

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [token] = useLocalStorage("token");

  const handleFileChange = async (event) => {
    setLoading(true);
    try {
      const selectedFile = event.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await axios.post(
        `${baseUrl}${endpoints.files.getFiles}/video`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Set the Authorization header with the token
          },
        }
      );

      console.log(response.data);
      setFeatured(response.data.path[0]);
      // setFeaturedErr("");

      console.log("Upload successful:", response.data.path[0]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    if (!featured) return;

    const paylaod = {
      heading: data.heading,
      description: data.description,
      video_url: featured,
      batch_id: data.batch_id.value,
    };
    console.log(paylaod);

    try {
      handleCreate(paylaod);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Title text="Add Recording" />
      {/* <Image src={UploadRecordingImg} alt="" /> */}

      <div class="flex flex-col items-center">
        <label for="file-upload" className="w-full relative cursor-pointer">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Spinner />
            </div>
          ) : featured ? (
            <>
              <div class="w-full rounded-md flex items-center justify-center">
                <video src={`${process.env.AWS_PATH}/${featured}`} controls />
              </div>
              <input
                id="file-upload"
                type="file"
                // disabled={type === "view"}
                onChange={handleFileChange}
                className="hidden"
                accept=".mp4"
              />
            </>
          ) : (
            <>
              <div class="w-full h-96 rounded-md flex flex-col items-center justify-center border-4 border-dashed border-primary">
                <Image src={UploadImg} alt="upload icon" className="" />
                <p className="text-2xl text-primary font-bold">Upload Video</p>
              </div>
              <input
                id="file-upload"
                type="file"
                // disabled={type === "view"}
                onChange={handleFileChange}
                className="hidden"
                accept=".mp4"
              />
            </>
          )}
        </label>
        {/* {type !== "view" && <p>Upload Cover Photo</p>}
        {featuredErr && <span className="text-red-600">{featuredErr}</span>} */}
      </div>
      <div className="grid grid-cols-2 gap-8">
        {/* <div className="space-y-2">
          <label htmlFor="courseId" className="font-bold">
            Course
          </label>
          <Controller
            control={control}
            name="course_id"
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                options={courseOptions}
                placeholder="Course Name"
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={menuPortalTargetRef.current}
                menuPosition="absolute"
                //   isDisabled={type === "view"}
                //   onInputChange={handleCourseChange}
                className="w-full border outline-none rounded-md font-mulish text-xl font-semibold"
              />
            )}
          />
          {errors.course_id && (
            <span className="text-red-600">This field is required</span>
          )}
        </div> */}
        <div className="space-y-2">
          <label htmlFor="batchId" className="font-bold">
            Course
          </label>
          <Controller
            control={control}
            name="batch_id"
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                options={batchOptions}
                placeholder="Batch"
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={menuPortalTargetRef.current}
                menuPosition="absolute"
                //   isDisabled={type === "view"}
                //   onInputChange={handleCourseChange}
                className="w-full border outline-none rounded-md font-mulish text-xl font-semibold"
              />
            )}
          />
          {errors.course_id && (
            <span className="text-red-600">This field is required</span>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="heading" className="font-bold">
            Video Heading
          </label>
          <input
            {...register("heading", { required: true })}
            placeholder="Video Heading"
            className="w-full px-4 h-[42px] outline-none rounded-md border border-gray-300 font-mulish text-xl font-semibold"
          />
          {errors.heading?.type === "required" && (
            <p role="alert" className="text-red-600">
              Video Heading is required
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="uploadingDate" className="font-bold">
            Uploading Date
          </label>
          <input
            type="date"
            {...register("uploadingDate", { required: true })}
            placeholder="Schedule Uploading Date"
            className="w-full px-4 h-[42px] outline-none rounded-md border border-gray-300 font-mulish text-xl font-semibold"
          />
          {errors.uploadingDate?.type === "required" && (
            <p role="alert" className="text-red-600">
              Schedule Uploading Date is required
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="font-bold">
          Description
        </label>
        <textarea
          {...register("description", { required: true })}
          placeholder="Description"
          className="w-full p-4 outline-none rounded-md border border-gray-300 font-mulish text-xl font-semibold"
        />
        {errors.description?.type === "required" && (
          <p role="alert" className="text-red-600">
            Description is required
          </p>
        )}
      </div>
      <div className="flex justify-center">
        <button className="bg-primary px-12 py-2 rounded-full text-white">
          Post Video Recording
        </button>
      </div>
    </form>
  );
}

export default UploadRecording;
