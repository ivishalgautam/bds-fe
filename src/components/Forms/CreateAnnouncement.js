import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Title from "../Title";
import http from "@/utils/http";
import UploadImg from "../../assets/upload.svg";
import { endpoints } from "@/utils/endpoints";
import Image from "next/image";
import Spinner from "../Spinner";
import useLocalStorage from "@/utils/useLocalStorage";
import axios from "axios";

const CreateAnnouncement = ({
  handleCreateAnnouncement,
  closeModal,
  selected,
  type,
  handleUpdate,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [featured, setFeatured] = useState(null);
  const [featuredErr, setFeaturedErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [token] = useLocalStorage("token");

  const onSubmit = (data) => {
    // if (!featured) {
    //   setFeaturedErr("This Field is required");
    //   return;
    // }
    let payload
    if(featured) {
        payload = { ...data, image_url: featured }
    } else{
      payload = { ...data };
    }
    if (type === "edit") {
      handleUpdate(payload);
    } else {
      handleCreateAnnouncement(payload);
    }
    reset();
    closeModal();
  };

  const handleFileChange = async (event) => {
    setLoading(true);
    try {
      const selectedFile = event.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await axios.post(
        `${baseUrl}${endpoints.files.upload}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Set the Authorization header with the token
          },
        }
      );
      setFeatured(response.data.path[0]);
      setFeaturedErr("");
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  //prefilled data
  useEffect(() => {
    const fetchInfo = async () => {
      const data = await http().get(
        `${endpoints.announcements.getAll}/${selected}`
      );
      setValue("headline", data.headline);
      setValue("description", data.description);
      setFeatured(data.image_url || "");
    };

    if (selected && type === "edit") {
      fetchInfo();
    }
  }, [selected]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Title
        text={type == "edit" ? "Edit Announcement" : "Create Announcement"}
      />
      <div>
        {/* <label htmlFor="headline">Headline</label> */}
        <input
          type="text"
          id="headline"
          placeholder="Headline"
          className="w-full px-4 py-3 rounded-md outline-none border border-gray-300"
          {...register("headline", { required: true })}
        />
        {errors.headline && (
          <span className="text-red-600">This field is required</span>
        )}
      </div>

      <div>
        {/* <label htmlFor="description">Description</label> */}
        <textarea
          id="description"
          placeholder="Description"
          className="w-full px-4 py-3 rounded-md outline-none border border-gray-300"
          {...register("description", { required: true })}
        />
        {errors.description && (
          <span className="text-red-600">This field is required</span>
        )}
      </div>

      <div class="flex flex-col items-center">
        <label for="file-upload" class="relative cursor-pointer">
          {loading ? (
            <Spinner />
          ) : featured ? (
            <>
              <div class="w-full rounded-md flex items-center justify-center">
                <img
                  src={featured}
                  alt="upload icon"
                  className="w-80 mb-4 aspect-video object-cover rounded-md"
                />
              </div>
              <input
                id="file-upload"
                type="file"
                disabled={type === "view"}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf, .jpeg, .jpg, .png"
              />
            </>
          ) : (
            <>
              <div class="w-full rounded-md flex items-center justify-center">
                <Image
                  src={UploadImg}
                  alt="upload icon"
                  className="w-full object-cover rounded-md"
                />
              </div>
              <input
                id="file-upload"
                type="file"
                disabled={type === "view"}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf, .jpeg, .jpg, .png"
              />
            </>
          )}
        </label>
        {type !== "view" && <p>Upload Announcement Image</p>}
        {featuredErr && <span className="text-red-600">{featuredErr}</span>}
      </div>

      <button
        type="submit"
        className="bg-primary px-6 py-2 text-white rounded-full"
      >
        {type === "edit" ? "Update" : "Submit"}
      </button>
    </form>
  );
};

export default CreateAnnouncement;
