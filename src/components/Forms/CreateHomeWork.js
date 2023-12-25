import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Title from "../Title";
import UploadImg from "../../assets/upload.svg";
import http from "@/utils/http";
import axios from "axios";
import { endpoints } from "@/utils/endpoints";
import Image from "next/image";
import { FaTrashAlt } from "react-icons/fa";
import Spinner from "../Spinner";
import useLocalStorage from "@/utils/useLocalStorage";
import toast from "react-hot-toast";

export default function CreateHomeWork() {
  const [isFirstFormSubmitted, setIsFirstFormSubmitted] = useState(false);
  const [firstFormData, setFirstFormData] = useState({});
  const [featured, setFeatured] = useState(null);
  const [featuredErr, setFeaturedErr] = useState(null);
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [pptImages, setPptImages] = useState([]);
  const [courseSyllabus, setCourseSyllabus] = useState([
    {
      weeks: 1,
      day_wise: [
        {
          days: 1,
          heading: "",
          description: "",
          file: "",
          ppt_file: "",
        },
      ],
    },
  ]);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  const [token] = useLocalStorage("token");

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
      toast.error("Failed to Create Course.");
      router.push("/courses");
    },
  });

  const handleCreateCourse = (newItem) => {
    createMutation.mutate(newItem);
  };

  const onSubmitFirstForm = (data) => {
    const payload = {
      course_name: data.course_name,
      duration: data.duration,
    };
    console.log(data);
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
            file: "",
            ppt_file: "",
          },
        ],
      });
    }
  };
  const handleFileChange = async (event, weekIndex, dayIndex) => {
    try {
      const selectedFile = event.target.files[0];
      if (!selectedFile) {
        return; // No file selected, so do nothing
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

      console.log(data.path[0]);

      setValue(
        `homework[${weekIndex}].day_wise[${dayIndex}].ppt_file`,
        data.path[0]
      );

      setPptImages((prevPptImages) => {
        const updatedPptImages = [...prevPptImages];
        updatedPptImages[dayIndex] = data.path[0];
        return updatedPptImages;
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // const handleFileChange = async (event, weekIndex, dayIndex) => {
  //   setLoading(true);
  //   try {
  //     const selectedFile = event.target.files[0];
  //     if (!selectedFile) {
  //       setLoading(false);
  //       return; // No file selected, so do nothing
  //     }

  //     const formData = new FormData();
  //     formData.append("file", selectedFile);

  //     const response = await axios.post(
  //       `${baseUrl}${endpoints.files.upload}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`, // Set the Authorization header with the token
  //         },
  //       }
  //     );

  //     setCourseSyllabus((prevCourseSyllabus) => {
  //       const updatedCourseSyllabus = [...prevCourseSyllabus];
  //       // Ensure that the weekIndex and dayIndex are valid before accessing day_wise
  //       if (
  //         updatedCourseSyllabus[weekIndex] &&
  //         updatedCourseSyllabus[weekIndex].day_wise
  //       ) {
  //         updatedCourseSyllabus[weekIndex].day_wise[dayIndex].ppt_file =
  //           response.data.path[0];
  //       }
  //       return updatedCourseSyllabus;
  //     });

  //     setFeatured(response.data.path[0]);
  //     setFeaturedErr("");
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     setFeatured("");
  //     setFeaturedErr("Error uploading the file.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const addDays = (weekIndex) => {
    console.log("Adding Days");
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
            file: "",
            ppt_file: "",
          },
        ],
      };
      updatedCourseSyllabus[weekIndex] = updatedWeek;
      return updatedCourseSyllabus;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await http().get(`${endpoints.courses.getAll}/${id}`);
        console.log(data);

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
                ppt_file: day.ppt_file || "",
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
    // if (type === "edit" || type === "view") {
    fetchData();
    // }
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
    console.log(courseSyllabus);
    const payload = { ...firstFormData, homework: filteredSyllabus };
    console.log(payload);

    // if (type === "add") {
    //   handleCreateCourse(payload);
    // } else {
    //   handleUpdate(payload);
    // }
  };
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="space-y-6">
      <Title text="Create Course" />
      <div className="">
        {!isFirstFormSubmitted ? (
          <form
            onSubmit={handleSubmit(onSubmitFirstForm)}
            className="space-y-6 bg-white  rounded-xl"
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
                  // disabled={type === "view"}
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
                  // disabled={type === "view"}
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
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-primary px-6 py-2 text-white rounded-md font-mulish"
              >
                Save and Forward
                {/* {type === "view" ? "More Info" : "Save and Forward"} */}
              </button>
            </div>
          </form>
        ) : (
          // <form onSubmit={handleSubmitSecondForm} className="space-y-6">
          //   {filteredSyllabus.map((item, i) => (
          //     <div key={i} className="space-y-6 bg-white p-8 rounded-xl">
          //       <p className="px-4 py-2 border-2 border-dashed border-primary rounded-md font-mulish text-primary max-w-max">
          //         Week {i + 1}
          //       </p>

          //       {item.day_wise.map((day, index) => (
          //         <div key={index} className="space-y-6">
          //           {index !== 0 && (
          //             <div className="flex justify-end">
          //               <button
          //                 type="button"
          //                 onClick={() => deleteDay(i, index)}
          //                 className="px-4 py-2 border-2 right-0 border-red-500 rounded-full font-mulish text-red-500 max-w-max"
          //               >
          //                 <FaTrashAlt />
          //               </button>
          //             </div>
          //           )}
          //           <div className="grid grid-cols-3 gap-4">
          //             <input
          //               value={index + 1}
          //               // disabled={type === "view"}
          //               placeholder="Select Days"
          //               className="col-span-1 w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
          //             />
          //             <input
          //               placeholder="Heading"
          //               // disabled={type === "view"}
          //               className="col-span-2 w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
          //               value={day.heading}
          //               onChange={(e) => {
          //                 const updatedCourseSyllabus = [...courseSyllabus];
          //                 updatedCourseSyllabus[i].day_wise[index].heading =
          //                   e.target.value;
          //                 setCourseSyllabus(updatedCourseSyllabus);
          //               }}
          //             />
          //           </div>
          //           <div>
          //             <input
          //               placeholder="Description"
          //               // disabled={type === "view"}
          //               className="w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
          //               value={day.description}
          //               onChange={(e) => {
          //                 const updatedCourseSyllabus = [...courseSyllabus];
          //                 updatedCourseSyllabus[i].day_wise[index].description =
          //                   e.target.value;
          //                 setCourseSyllabus(updatedCourseSyllabus);
          //               }}
          //             />
          //           </div>
          //           <div>
          //             <input
          //               placeholder="File"
          //               // disabled={type === "view"}
          //               className="w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
          //               value={day.file}
          //               onChange={(e) => {
          //                 const updatedCourseSyllabus = [...courseSyllabus];
          //                 updatedCourseSyllabus[i].day_wise[index].file =
          //                   e.target.value;
          //                 setCourseSyllabus(updatedCourseSyllabus);
          //               }}
          //             />
          //           </div>

          //           <div class="flex flex-col items-center">
          //             <label for="file-upload" class="relative cursor-pointer">
          //               {loading ? (
          //                 <Spinner />
          //               ) : featured ? (
          //                 <>
          //                   <div class="w-full rounded-md flex items-center justify-center">
          //                     <img
          //                       src={featured}
          //                       alt="upload icon"
          //                       className="w-80 mb-4 aspect-video object-cover rounded-md"
          //                     />
          //                   </div>
          //                   <input
          //                     id={`file-upload-${i}-${index}`}
          //                     type="file"
          //                     // disabled={type === "view"}
          //                     onChange={(e) => handleFileChange(e, i, index)}
          //                     className="hidden"
          //                   />
          //                 </>
          //               ) : (
          //                 <>
          //                   <div class="w-full rounded-md flex items-center justify-center">
          //                     <Image
          //                       src={UploadImg}
          //                       alt="upload icon"
          //                       className="w-full object-cover rounded-md"
          //                     />
          //                   </div>
          //                   <input
          //                     id="file-upload"
          //                     type="file"
          //                     // disabled={type === "view"}
          //                     onChange={(e) => handleFileChange(e, i, index)}
          //                     className="hidden"
          //                   />
          //                 </>
          //               )}
          //             </label>
          //             <p>Upload Cover Photo</p>
          //             {/* {type !== "view" && <p>Upload Cover Photo</p>} */}
          //             {featuredErr && (
          //               <span className="text-red-600">{featuredErr}</span>
          //             )}
          //           </div>
          //         </div>
          //       ))}
          //       {/* <button onClick={() => addDays(i)}>Add Days</button> */}
          //       {item.day_wise.length < 7 && (
          //         // && type !== "view"
          //         <div className="flex justify-center mt-6">
          //           <button
          //             type="button"
          //             onClick={() => addDays(i)}
          //             className="px-4 py-2 border-2 border-primary rounded-full font-mulish text-primary max-w-max"
          //           >
          //             Add Day
          //           </button>
          //         </div>
          //       )}
          //     </div>
          //   ))}
          //   {/* {type !== "view" && ( */}
          //   <div className="flex justify-center">
          //     <button
          //       type="submit"
          //       className="bg-primary px-6 py-2 text-white rounded-full"
          //     >
          //       Submit
          //     </button>
          //   </div>
          //   {/* )} */}
          // </form>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6 bg-white p-8 rounded-xl">
              <h3 className="text-2xl font-semibold mb-4">Homework</h3>

              <div className="space-y-6">
                <Controller
                  name="homework"
                  control={control}
                  defaultValue={[
                    {
                      weeks: 1,
                      day_wise: [
                        {
                          days: 1,
                          heading: "",
                          file: "",
                          ppt_file: null,
                          is_disabled: true,
                        },
                      ],
                    },
                  ]}
                  render={({ field }) => (
                    <div>
                      {field.value.map((week, weekIndex) => (
                        <div key={weekIndex} className="space-y-6">
                          {week.day_wise.map((day, dayIndex) => (
                            <div key={dayIndex} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <input
                                  type="number"
                                  placeholder="Days"
                                  {...register(
                                    `homework[${weekIndex}].day_wise[${dayIndex}].days`,
                                    {
                                      required: true,
                                      min: 1,
                                    }
                                  )}
                                  className="col-span-1 w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                                />
                                <input
                                  type="text"
                                  placeholder="Heading"
                                  {...register(
                                    `homework[${weekIndex}].day_wise[${dayIndex}].heading`,
                                    {
                                      required: "Heading is required",
                                    }
                                  )}
                                  className="col-span-1 w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                                />
                              </div>
                              <input
                                type="text"
                                placeholder="File"
                                {...register(
                                  `homework[${weekIndex}].day_wise[${dayIndex}].file`,
                                  {
                                    required: "File URL is required",
                                  }
                                )}
                                className="w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                              />
                              <div className="grid grid-cols-2 gap-4">
                                <input
                                  type="file"
                                  onChange={(e) =>
                                    handleFileChange(e, weekIndex, dayIndex)
                                  }
                                  className="col-span-1"
                                />
                                <input
                                  type="checkbox"
                                  {...register(
                                    `homework[${weekIndex}].day_wise[${dayIndex}].is_disabled`
                                  )}
                                  className="col-span-1"
                                />
                                <label>Is Disabled</label>
                              </div>
                              {pptImages[dayIndex] && ( // Show image preview for the specific day
                                <div className="w-32 h-32 mx-auto mt-4">
                                  <img
                                    src={pptImages[dayIndex]}
                                    alt="Uploaded PPT"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              )}
                              {errors.homework &&
                                errors.homework[weekIndex] &&
                                errors.homework[weekIndex].day_wise &&
                                errors.homework[weekIndex].day_wise[
                                  dayIndex
                                ] && (
                                  <span className="text-red-600">
                                    {
                                      errors.homework[weekIndex].day_wise[
                                        dayIndex
                                      ].ppt_file?.message
                                    }
                                  </span>
                                )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const currentValues = getValues();
                              setValue(
                                "homework",
                                currentValues.homework.map((w, index) => {
                                  if (index === weekIndex) {
                                    return {
                                      ...w,
                                      day_wise: [
                                        ...w.day_wise,
                                        {
                                          days: w.day_wise.length + 1,
                                          heading: "",
                                          file: "",
                                          ppt_file: null,
                                          is_disabled: false,
                                        },
                                      ],
                                    };
                                  }
                                  return w;
                                })
                              );
                              setPptImages((prevPptImages) => [
                                ...prevPptImages,
                                null,
                              ]);
                            }}
                          >
                            Add Day
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const currentValues = getValues();
                              setValue(
                                "homework",
                                currentValues.homework.map((w, index) => {
                                  if (index === weekIndex) {
                                    return {
                                      ...w,
                                      day_wise: w.day_wise.slice(
                                        0,
                                        w.day_wise.length - 1
                                      ),
                                    };
                                  }
                                  return w;
                                })
                              );
                              setPptImages((prevPptImages) => {
                                const updatedPptImages = [...prevPptImages];
                                updatedPptImages.splice(dayIndex, 1); // Remove the image for the deleted day
                                return updatedPptImages;
                              });
                            }}
                          >
                            Delete Day
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-primary px-6 py-2 text-white rounded-full"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
