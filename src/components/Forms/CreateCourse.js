import React, { useEffect, useState } from "react";
import Title from "../Title";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "../../utils/endpoints";
import http from "../../utils/http";
import UploadImg from "../../assets/upload.svg";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import Image from "next/image";
import useLocalStorage from "@/utils/useLocalStorage";
import toast from "react-hot-toast";

export default function CreateCourse({ id, type, handleUpdate }) {
  const [isFirstFormSubmitted, setIsFirstFormSubmitted] = useState(false);
  const [firstFormData, setFirstFormData] = useState({});
  const [featured, setFeatured] = useState(null);
  const [featuredErr, setFeaturedErr] = useState(null);
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [courseSyllabus, setCourseSyllabus] = useState([
    {
      weeks: 1,
      day_wise: [
        {
          days: 1,
          heading: "",
          description: "",
        },
      ],
    },
  ]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [token] = useLocalStorage("token");
  const router = useRouter();

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

  const createCourse = async (newItem) => {
    await http().post(endpoints.courses.getAll, newItem);
  };

  const queryClient = useQueryClient();

  const createMutation = useMutation(createCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course created successfully.");
      router.push("/courses");
    },
    onError: () => {
      toast.error("Failed to Create Course");
      router.push("/courses");
    },
  });

  const handleCreateCourse = (newItem) => {
    createMutation.mutate(newItem);
  };

  const onSubmitFirstForm = (data) => {
    if (!featured) {
      setFeaturedErr("Please Upload Cover Image");
      return;
    }
    const payload = {
      course_name: data.course_name,
      duration: data.duration,
      regular_price: data.price,
      discount_price: data.discount_price || 0, //Optional
      course_description: data.course_description,
      course_thumbnail: featured,
    };

    setFirstFormData(payload);
    setIsFirstFormSubmitted(true);
    setDuration(data.duration);
    for (let i = 1; i < +data.duration; i++) {
      courseSyllabus.push({
        weeks: i + 1,
        day_wise: [
          {
            days: +i,
            heading: "",
            description: "",
          },
        ],
      });
    }
  };

  const addDays = (weekIndex) => {
    setCourseSyllabus((prevCourseSyllabus) => {
      const updatedCourseSyllabus = [...prevCourseSyllabus];
      const updatedWeek = {
        ...updatedCourseSyllabus[weekIndex],
        day_wise: [
          ...updatedCourseSyllabus[weekIndex].day_wise,
          {
            days: updatedCourseSyllabus[weekIndex].day_wise.length + 1,
            heading: "",
            description: "",
          },
        ],
      };
      updatedCourseSyllabus[weekIndex] = updatedWeek;
      return updatedCourseSyllabus;
    });
  };

  const deleteDay = (weekIndex, dayIndex) => {
    setCourseSyllabus((prevCourseSyllabus) => {
      const updatedCourseSyllabus = [...prevCourseSyllabus];
      updatedCourseSyllabus[weekIndex].day_wise.splice(dayIndex, 1);
      return updatedCourseSyllabus;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await http().get(`${endpoints.courses.getAll}/${id}`);

        setValue("course_name", data.course_name || "");
        setValue("duration", data.duration || "");
        setValue("price", data.regular_price || "");
        setValue("discount_price", data.discount_price || "");
        setValue("course_description", data.course_description || "");
        setFeatured(data.course_thumbnail || "");

        if (data.course_syllabus && data.course_syllabus.length > 0) {
          const updatedCourseSyllabus = data.course_syllabus.map((week) => {
            const updatedWeek = {
              weeks: week.weeks || "",
              day_wise: week.day_wise.map((day) => ({
                days: day.days || "",
                heading: day.heading || "",
                description: day.description || "",
              })),
            };
            return updatedWeek;
          });

          setCourseSyllabus(updatedCourseSyllabus);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (type === "edit" || type === "view") {
      fetchData();
    }
  }, []);

  const removeDuplicateWeeks = (inputArray) => {
    const uniqueWeeks = inputArray.reduce((accumulator, currentItem) => {
      const existingWeek = accumulator.find(
        (item) => item.weeks === currentItem.weeks
      );
      if (!existingWeek) {
        accumulator.push(currentItem);
      }
      return accumulator;
    }, []);

    return uniqueWeeks;
  };

  const filteredSyllabus = removeDuplicateWeeks(courseSyllabus);

  const handleSubmitSecondForm = (e) => {
    e.preventDefault();

    const payload = { ...firstFormData, course_syllabus: filteredSyllabus };

    if (type === "add") {
      handleCreateCourse(payload);
    } else {
      handleUpdate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <Title text="Create Course" />
      <div className="">
        {!isFirstFormSubmitted ? (
          <form
            onSubmit={handleSubmit(onSubmitFirstForm)}
            className="space-y-6 bg-white p-8 rounded-xl"
          >
            <p className="px-4 py-2 border-2 border-dashed border-primary rounded-md font-mulish text-primary max-w-max">
              Basic Details
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {/* <label htmlFor="courseName">Course Name</label> */}
                <input
                  type="text"
                  id="courseName"
                  disabled={type === "view"}
                  placeholder="Course Name"
                  className="w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                  {...register("course_name", { required: true })}
                />
                {errors.course_name && (
                  <span className="text-red-600">This field is required</span>
                )}
              </div>
              <div>
                {/* <label htmlFor="duration">Duration</label> */}
                <input
                  type="number"
                  id="duration"
                  min={1}
                  max={52}
                  disabled={type === "view"}
                  placeholder="Duration"
                  className="w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                  {...register("duration", { required: true, min: 1, max: 52 })}
                />
                {errors.duration?.type === "required" && (
                  <span className="text-red-600">This field is required</span>
                )}
                {errors.duration?.type === "min" && (
                  <span className="text-red-600">
                    Number must be greater than 0
                  </span>
                )}
                {errors.duration?.type === "max" && (
                  <span className="text-red-600">Number cannot exceed 52</span>
                )}
              </div>
              <div>
                {/* <label htmlFor="discountPrice">Discount Price</label> */}
                <input
                  type="number"
                  id="discountPrice"
                  disabled={type === "view"}
                  placeholder="Discount Price"
                  className="w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                  {...register("discount_price", { required: true, min: 1 })}
                />
                {errors.discount_price?.type === "required" && (
                  <span className="text-red-600">This field is required</span>
                )}
                {errors.discount_price?.type === "min" && (
                  <span className="text-red-600">
                    Number must be greater than 0
                  </span>
                )}
              </div>
              <div>
                {/* <label htmlFor="price">Price</label> */}
                <input
                  type="number"
                  id="price"
                  disabled={type === "view"}
                  placeholder="Price"
                  className="w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                  {...register("price", { required: true, min: 1 })}
                />
                {errors.price?.type === "required" && (
                  <span className="text-red-600">This field is required</span>
                )}
                {errors.price?.type === "min" && (
                  <span className="text-red-600">
                    Number must be greater than 0
                  </span>
                )}
              </div>
            </div>
            <div>
              {/* <label htmlFor="courseDescription">Course Description</label> */}
              <textarea
                id="courseDescription"
                placeholder="Course Description"
                disabled={type === "view"}
                className="w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                {...register("course_description", { required: true })}
              />
              {errors.course_description && (
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
                      accept=".jpeg, .jpg, .png"
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
                      accept=".jpeg, .jpg, .png"
                    />
                  </>
                )}
              </label>
              {type !== "view" && <p>Upload Cover Photo</p>}
              {featuredErr && (
                <span className="text-red-600">{featuredErr}</span>
              )}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-primary px-6 py-2 text-white rounded-md font-mulish"
              >
                {type === "view" ? "More Info" : "Save and Forward"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitSecondForm} className="space-y-6">
            {filteredSyllabus.map((item, i) => (
              <div key={i} className="space-y-6 bg-white p-8 rounded-xl">
                <p className="px-4 py-2 border-2 border-dashed border-primary rounded-md font-mulish text-primary max-w-max">
                  Week {i + 1}
                </p>

                {item.day_wise.map((day, index) => (
                  <div key={index} className="space-y-6">
                    {index !== 0 && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => deleteDay(i, index)}
                          className="px-4 py-2 border-2 right-0 border-red-500 rounded-full font-mulish text-red-500 max-w-max"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        value={index + 1}
                        disabled={type === "view"}
                        placeholder="Select Days"
                        className="col-span-1 w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                      />
                      <input
                        placeholder="Heading"
                        disabled={type === "view"}
                        className="col-span-2 w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                        value={day.heading}
                        onChange={(e) => {
                          const updatedCourseSyllabus = [...courseSyllabus];
                          updatedCourseSyllabus[i].day_wise[index].heading =
                            e.target.value;
                          setCourseSyllabus(updatedCourseSyllabus);
                        }}
                      />
                    </div>
                    <div>
                      <input
                        placeholder="Description"
                        disabled={type === "view"}
                        className="w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                        value={day.description}
                        onChange={(e) => {
                          const updatedCourseSyllabus = [...courseSyllabus];
                          updatedCourseSyllabus[i].day_wise[index].description =
                            e.target.value;
                          setCourseSyllabus(updatedCourseSyllabus);
                        }}
                      />
                    </div>
                  </div>
                ))}
                {/* <button onClick={() => addDays(i)}>Add Days</button> */}
                {item.day_wise.length < 7 && type !== "view" && (
                  <div className="flex justify-center mt-6">
                    <button
                      type="button"
                      onClick={() => addDays(i)}
                      className="px-4 py-2 border-2 border-primary rounded-full font-mulish text-primary max-w-max"
                    >
                      Add Day
                    </button>
                  </div>
                )}
              </div>
            ))}
            {type !== "view" && (
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-primary px-6 py-2 text-white rounded-full"
                >
                  Submit
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
