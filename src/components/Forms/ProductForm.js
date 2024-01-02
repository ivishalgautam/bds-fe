import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Title from "../Title";
import http from "../../utils/http";
import { endpoints } from "../../utils/endpoints";
import UploadImg from "../../assets/upload.svg";
import axios from "axios";
import useLocalStorage from "@/utils/useLocalStorage";
import Image from "next/image";
import { AiFillCloseCircle } from "react-icons/ai";

const ProductForm = ({
  handleCreate,
  closeModal,
  productId,
  type,
  handleUpdate,
}) => {
  const [featured, setFeatured] = useState(null);
  const [featuredErr, setFeaturedErr] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const [token] = useLocalStorage("token");

  const handleFileChange = async (event) => {
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
    }
  };

  const removeImage = (index) => {
    const updatedImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updatedImages);
  };

  const handelGalleryImages = async (event) => {
    try {
      const selectedFiles = Array.from(event.target.files);

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("file", file);
      });

      const response = await axios.post(
        `${baseUrl}${endpoints.files.upload}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGalleryImages((prevImages) => [...prevImages, ...response.data.path]);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const onSubmit = (data) => {
    if (!featured) {
      setFeaturedErr("Featured cover photo is required");
      return false;
    }
    const payload = {
      ...data,
      thumbnail: featured,
      product_gallery: galleryImages,
    };
    if (type === "add") {
      handleCreate(payload);
    } else {
      handleUpdate(payload);
    }
    reset();
    closeModal();
  };

  useEffect(() => {
    // Fetch data from API and populate the form with prefilled values

    const fetchData = async () => {
      try {
        const data = await http().get(
          `${endpoints.products.getAll}/${productId}`
        );

        setValue("title", data.title);
        setValue("product_type", data.product_type);
        setValue("category", data.category);
        setValue("tags", data.tags);
        setValue("regular_price", data.regular_price);
        setValue("discount_price", data.discount_price);
        setValue("short_description", data.short_description);
        setFeatured(data.thumbnail);
        setGalleryImages(data.product_gallery);
      } catch (error) {
        console.error(error);
      }
    };
    if (type === "edit" || type === "view") {
      fetchData();
    }
  }, []);

  return (
    <div className="space-y-4">
      <Title
        text={
          type === "add"
            ? "Create Product"
            : type === "view"
            ? "Product Details"
            : "Edit Product"
        }
      />
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
        <div className="w-2/3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              {type === "view" && <label className="font-bold">Title</label>}
              <input
                type="text"
                disabled={type === "view"}
                className="px-4 py-3 outline-none rounded-md w-full border border-gray-100"
                placeholder="Title"
                {...register("title", {
                  required: "Title is required",
                })}
              />
              {errors.title && (
                <span className="text-red-600">{errors.title.message}</span>
              )}
            </div>
            <div className="space-y-2">
              {type === "view" && (
                <label className="font-bold">Product Type</label>
              )}
              <input
                type="text"
                placeholder="Product Type"
                disabled={type === "view"}
                className="px-4 py-3 outline-none rounded-md w-full border border-gray-100"
                {...register("product_type", {
                  required: "Product Type is required",
                })}
              />
              {errors.product_type && (
                <span className="text-red-600">
                  {errors.product_type.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              {type === "view" && <label className="font-bold">Category</label>}
              <input
                type="text"
                disabled={type === "view"}
                className="px-4 py-3 outline-none rounded-md w-full border border-gray-100"
                placeholder="Category"
                {...register("category", {
                  required: "Category is required",
                })}
              />
              {errors.category && (
                <span className="text-red-600">{errors.category.message}</span>
              )}
            </div>
            <div className="space-y-2">
              {type === "view" && <label className="font-bold">Tags</label>}
              <input
                type="text"
                placeholder="Tags"
                disabled={type === "view"}
                className="px-4 py-3 outline-none rounded-md w-full border border-gray-100"
                {...register("tags", {
                  required: "Tags is required",
                })}
              />
              {errors.tags && (
                <span className="text-red-600">{errors.tags.message}</span>
              )}
            </div>
            <div className="space-y-2">
              {type === "view" && (
                <label className="font-bold">Regular Price</label>
              )}
              <input
                type="number"
                placeholder="Regular Price"
                disabled={type === "view"}
                className="px-4 py-3 outline-none rounded-md w-full border border-gray-100"
                {...register("regular_price", {
                  required: "Regular Price is required",
                  min: {
                    value: 0,
                    message: "Regular Price should be a positive number",
                  },
                })}
              />
              {errors.regular_price && (
                <span className="text-red-600">
                  {errors.regular_price.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              {type === "view" && (
                <label className="font-bold">Discount Price</label>
              )}
              <input
                type="number"
                disabled={type === "view"}
                placeholder="Discount Price"
                className="px-4 py-3 outline-none rounded-md w-full border border-gray-100"
                {...register("discount_price", {
                  required: "Discount Price is required",
                  min: {
                    value: 0,
                    message: "Discount Price should be a positive number",
                  },
                })}
              />
              {errors.discount_price && (
                <span className="text-red-600">
                  {errors.discount_price.message}
                </span>
              )}
            </div>
          </div>
          <div className="w-full mt-4 space-y-2">
            {type === "view" && (
              <label className="font-bold">Short Description</label>
            )}
            <textarea
              placeholder="Short Description"
              disabled={type === "view"}
              className="px-4 py-3 outline-none rounded-md w-full border border-gray-100"
              {...register("short_description", {
                required: "Short Description is required",
              })}
            />
            {errors.short_description && (
              <span className="text-red-600">
                {errors.short_description.message}
              </span>
            )}
          </div>

          {type !== "view" && (
            <button
              type="submit"
              className="px-6 py-2 mt-4 rounded-full bg-primary text-white"
            >
              Submit
            </button>
          )}
        </div>

        <div className="w-1/3 space-y-6">
          <div className="flex flex-col items-center">
            <label htmlFor="file-upload" className="relative cursor-pointer">
              <div className="w-full rounded-md flex items-center justify-center">
                {featured ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${featured}`}
                    alt="upload icon"
                    className="w-full object-contain aspect-video rounded-md"
                  />
                ) : (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${UploadImg}`}
                    alt="upload icon"
                    width={50}
                    height={50}
                    className="w-full object-contain aspect-video rounded-md"
                  />
                )}
              </div>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".jpg, .jpeg, .png"
              />
            </label>
            {featuredErr && <span className="text-red-600">{featuredErr}</span>}
            <p>Upload Featured Cover Photo</p>
          </div>
          {/* <div className="flex flex-col items-center">
            <label
              htmlFor="file-upload-multi"
              className="relative cursor-pointer"
            >
              <div className="w-full rounded-md flex items-center justify-center">
                {!!galleryImages.length ? (
                  <div className="grid grid-cols-3 gap-4">
                    {galleryImages.map((image, index) => (
                      <div key={index} className="relative">
                        <div>
                          <AiFillCloseCircle
                            className="absolute -top-1 right-0 cursor-pointer text-red-600 w-3 h-3"
                            onClick={() => removeImage(index)}
                          />
                        </div>
                        <div
                          key={index}
                          className="aspect-ratio-1/1 rounded-md overflow-hidden"
                        >
                          <img
                            key={index}
                            src={image}
                            alt={`Gallery_img_${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Image
                    src={UploadImg}
                    alt="upload icon"
                    className="w-full object-contain aspect-video rounded-md"
                  />
                )}
              </div>
              <input
                id="file-upload-multi"
                type="file"
                multiple
                className="hidden"
                onChange={handelGalleryImages}
              />
            </label>
            <p>Upload Gallery Slider Images</p>
          </div> */}

          <div className="mb-4 p-4 rounded-md overflow-hidden">
            {/* <div className="flex gap-2">{renderIcons(documents.length)}</div> */}
            <div className="w-full rounded-md flex items-center justify-center">
              {!!galleryImages.length ? (
                <div className="grid grid-cols-3 gap-4">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="relative">
                      <div className={`${type === "view" && "hidden"}`}>
                        <AiFillCloseCircle
                          className="absolute -top-1 -right-1 cursor-pointer text-red-600 w-3 h-3"
                          onClick={() => removeImage(index)}
                        />
                      </div>
                      <div
                        key={index}
                        className="aspect-ratio-1/1 rounded-md overflow-hidden"
                      >
                        <img
                          key={index}
                          src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${image}`}
                          alt={`Gallery_img_${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Image
                  src={UploadImg}
                  alt="upload icon"
                  className="w-[60px]  object-contain aspect-square rounded-md"
                />
              )}
            </div>
            <div className="relative">
              <input
                type="file"
                id="documents"
                disabled={type === "view"}
                // {...register("documents", {
                //   required: "This field is required",
                // })}
                multiple
                accept=".jpg, .jpeg, .png, .mp4"
                onChange={handelGalleryImages}
                className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="p-4 text-center">
                <span>Upload Gallery Slider Images</span>
              </div>
            </div>
            {/* {errors.documents && (
              <p className="text-red-500">{errors.documents.message}</p>
            )} */}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
