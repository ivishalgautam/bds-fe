import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Select from "react-select";
import Title from "../Title";
import { FaTrashAlt } from "react-icons/fa";
import useLocalStorage from "@/utils/useLocalStorage";
import { useFetchCoursesNames } from "@/hooks/useFetchCoursesName";
import { AiFillCloseCircle, AiOutlineFileDone } from "react-icons/ai";
import Modal from "@/components/Modal";
import DocViewerApp from "@/components/DocViewerApp";
import { useRouter } from "next/router";

const HomeworkForm = ({ type, handleCreate, productId, handleUpdate }) => {
  const router = useRouter();
  const { pathname } = router;
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
    setValue,
  } = useForm();
  const { data: courseOptions } = useFetchCoursesNames();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "homework",
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const [token] = useLocalStorage("token");
  const [docs, setDocs] = useState([{}]);
  const [openDocViewer, setOpenDocViewer] = useState(false);

  const handleFileUpload = async (event, weekIndex, dayIndex, type) => {
    try {
      const selectedFile = event.target.files[0];
      if (!selectedFile) {
        return toast.error("No file selected!");
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

      const updateFields = [...fields];
      updateFields[weekIndex].day_wise[dayIndex][type] = data.path[0];
      update(updateFields);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  //prefilled Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await http().get(
          `${endpoints.homeworks.getAll}/${productId}`
        );

        // console.log({ data });
        if (courseOptions) {
          const course = courseOptions.find((c) => c.value === data.course_id);
          setValue("course_id", course);
        }
        remove();
        append(data.homework);
      } catch (error) {
        console.error(error);
      }
    };

    if (type === "edit" || type === "view") {
      fetchData();
    }
  }, [setValue, type, productId, courseOptions]);

  const onSubmit = (data) => {
    data.homework = data.homework.map(({ weeks, day_wise }) => ({
      weeks,
      day_wise: day_wise.map(({ days, heading, file, ppt_file }) => ({
        days,
        heading,
        file,
        ...(ppt_file && { ppt_file }),
      })),
    }));
    const payload = { ...data, course_id: data.course_id.value };
    if (type === "add") {
      handleCreate(payload);
      reset();
    } else {
      handleUpdate(payload);
      reset();
    }
  };

  const addDays = (weekIndex) => {
    const week = { ...fields[weekIndex] };
    week.day_wise = [
      ...week.day_wise,
      {
        days: week.day_wise.length + 1,
        heading: null,
        file: null,
        ppt_file: null,
      },
    ];
    update(weekIndex, week);
  };

  const removeFile = (weekIndex, dayIndex, type) => {
    const updateFields = [...fields];
    updateFields[weekIndex].day_wise[dayIndex][type] = null;
    update(updateFields);
  };

  const deleteDay = (weekIndex, dayIndex) => {
    const week = { ...fields[weekIndex] };
    week.day_wise = week.day_wise
      .filter((d, i) => i !== dayIndex)
      .map((d, i) => ({
        ...d,
        days: i + 1,
      }));
    update(weekIndex, week);
  };

  const handleCourseChange = (course) => {
    setValue("course_id", course);
    generateFieldArray(course.course_syllabus);
  };

  const generateFieldArray = (course_syllabus) => {
    remove();
    const cs = course_syllabus.map((w) => {
      const day_wise = w.day_wise.map((d) => ({
        days: d.days,
        heading: null,
        file: null,
        ppt_file: null,
      }));
      const week = {
        weeks: w.weeks,
        day_wise,
      };
      return week;
    });
    append(cs);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Title
          text={
            type === "add"
              ? "Create Homework"
              : type === "edit"
              ? "Edit HomeWork"
              : "Homework Details"
          }
        />
        <div className="space-y-6 bg-white rounded-xl">
          <div className="space-y-6">
            <div className="space-y-2">
              {type === "view" && <label htmlFor="courseId">Course</label>}
              {!pathname.includes("edit") && courseOptions && (
                <Controller
                  control={control}
                  name="course_id"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={courseOptions}
                      onChange={handleCourseChange}
                      placeholder="Course Name"
                      isDisabled={type === "view"}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPortalTarget={document.body}
                      menuPosition="absolute"
                      className="w-full border outline-none rounded-md font-mulish text-xl font-semibold"
                    />
                  )}
                />
              )}

              {errors.course_id && (
                <span className="text-red-600">This field is required</span>
              )}
            </div>
          </div>
        </div>
        {fields.map((item, i) => (
          <div className="space-y-6" key={i}>
            <div className="space-y-6 bg-white rounded-xl">
              <p className="px-4 py-2 border-2 border-dashed border-primary rounded-md font-mulish text-primary max-w-max">
                Week {i + 1}
              </p>

              {item.day_wise.map((day, index) => (
                <div key={index} className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      value={index + 1}
                      disabled={true}
                      className="col-span-1 w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                    />
                    <input
                      placeholder="Heading"
                      type="text"
                      disabled={type === "view"}
                      className="col-span-2 w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                      {...register(`homework.${i}.day_wise.${index}.heading`, {
                        onBlur: (e) => {
                          const updateFields = [...fields];
                          updateFields[i].day_wise[index].heading =
                            e.target.value;
                          update(updateFields);
                        },
                        required: true,
                      })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      {day.file ? (
                        <div className="relative">
                          <AiOutlineFileDone
                            size={50}
                            onClick={() => {
                              const fileName = day.file.split("/").slice(-1)[0];
                              const docs = [
                                {
                                  uri: `${baseUrl}${endpoints.files.getFiles}?file_path=${fileName}`,
                                  fileName: fileName,
                                },
                              ];
                              setDocs(docs);
                              setOpenDocViewer(true);
                            }}
                          />

                          {type === "edit" && (
                            <AiFillCloseCircle
                              className="absolute -top-1 left-10 cursor-pointer text-red-600 w-3 h-3"
                              onClick={() => removeFile(i, index, "file")}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="relative border">
                          <input
                            type="file"
                            disabled={type === "view"}
                            {...register(
                              `homework.${i}.day_wise.${index}._file`,
                              {
                                onChange: (e) =>
                                  handleFileUpload(e, i, index, "file"),
                                required: true,
                              }
                            )}
                            placeholder="Project File"
                            className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer"
                          />

                          {/* {documentErr && (
                          <span className="text-red-600">{documentErr}</span>
                        )} */}
                          <div className="p-4 text-center">
                            <span className="text-gray-500">
                              {type !== "view"
                                ? "Upload Homework File Here"
                                : ""}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      {day.ppt_file ? (
                        <div className="relative">
                          <AiOutlineFileDone
                            size={50}
                            onClick={() => {
                              const fileName = day.file.split("/").slice(-1)[0];

                              const docs = [
                                {
                                  uri: `${baseUrl}${endpoints.files.getFiles}?file_path=${fileName}`,
                                  fileName: fileName,
                                },
                              ];
                              setDocs(docs);
                              setOpenDocViewer(true);
                            }}
                          />
                          {type === "edit" && (
                            <AiFillCloseCircle
                              className="absolute -top-1 left-10 cursor-pointer text-red-600 w-3 h-3"
                              onClick={() => removeFile(i, index, "ppt_file")}
                            />
                          )}
                        </div>
                      ) : !day.ppt_file && type === "view" ? (
                        <p>No PPT File to show yet</p>
                      ) : (
                        <div className="relative border">
                          <input
                            type="file"
                            // id="documents"
                            disabled={type === "view"}
                            Add
                            {...register(
                              `homework.${i}.day_wise.${index}._ppt_file`,
                              {
                                onChange: (e) =>
                                  handleFileUpload(e, i, index, "ppt_file"),
                                required: false,
                              }
                            )}
                            placeholder="Project File"
                            className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer"
                          />
                          {/* {documentErr && (
                          <span className="text-red-600">{documentErr}</span>
                        )} */}
                          <div className="p-4 text-center">
                            <span className="text-gray-500">
                              {type !== "view" ? "Upload PPT File Here" : ""}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* )} */}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          {type !== "view" && (
            <button
              type="submit"
              className="bg-primary px-6 py-2 text-white rounded-full"
              disabled={!fields.length}
            >
              Submit
            </button>
          )}
        </div>
      </form>
      <Modal isOpen={openDocViewer} onClose={() => setOpenDocViewer(false)}>
        <DocViewerApp docs={docs} />
      </Modal>
    </div>
  );
};

export default HomeworkForm;
