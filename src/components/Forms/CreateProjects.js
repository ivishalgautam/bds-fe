import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Title from "../Title";
import http from "../../utils/http";
import { endpoints } from "../../utils/endpoints";
import Select from "react-select";
import axios from "axios";
import { AiOutlineFileDone, AiFillCloseCircle } from "react-icons/ai";
import useLocalStorage from "@/utils/useLocalStorage";
import { useFetchCoursesNames } from "@/hooks/useFetchCoursesName";
import Modal from "@/components/Modal";
import DocViewerApp from "@/components/DocViewerApp";

const ProjectForm = ({
  handleCreate,
  closeModal,
  ProjectId,
  type,
  handleUpdate,
}) => {
  const [featured, setFile] = useState(null);
  const [documentErr, setdocumentErr] = useState(null);
  const [weekOption, setWeekOption] = useState([]);
  const { data: courseOptions } = useFetchCoursesNames();
  const [docs, setDocs] = useState([{}]);
  const [openDocViewer, setOpenDocViewer] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [token] = useLocalStorage("token");

  const handleFileChange = async (event) => {
    try {
      const selectedFile = event.target.files[0];
      console.log(selectedFile);
      const formData = new FormData();
      formData.append("file", selectedFile);
      console.log("formData=>", formData);
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
      setFile(response.data.path[0]);
      setdocumentErr("");

      console.log("Upload successful:", response.data.path[0]);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const onSubmit = (data) => {
    if (!featured) {
      setdocumentErr("File is required");
      return false;
    }

    const payload = {
      ...data,
      weeks: +data.weeks.value,
      project_file: featured,
      course_id: data.course_id.value,
    };
    if (type === "add") {
      console.log(payload);
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
          `${endpoints.projects.getAll}/${ProjectId}`
        );

        const course = courseOptions?.find(
          (item) => item.value === data?.course_id
        );

        const selectedWeek = course?.course_syllabus?.find(
          (item) => item.weeks === +data?.weeks
        );

        const week = {
          value: selectedWeek?.weeks,
          label: `Week ${selectedWeek?.weeks}`,
        };

        setValue("project_name", data?.project_name);
        setValue("weeks", week);
        setValue("is_disabled", data?.is_disabled);
        setValue("course_id", course);
        setFile(data?.project_file);
      } catch (error) {
        console.error(error);
      }
    };
    if (type === "edit" || type === "view") {
      fetchData();
    }
  }, [setValue, type, ProjectId]);

  const watchCourseId = watch("course_id");
  useEffect(() => {
    if (watchCourseId) {
      const course = courseOptions?.find(
        (c) => c.value === watchCourseId.value
      );
      if (course?.course_syllabus == null) return;
      const weeks = course.course_syllabus.map(({ weeks }) => {
        return {
          value: weeks,
          label: `Week ${weeks}`,
        };
      });
      setWeekOption(weeks);
    }
  }, [watchCourseId, setWeekOption]);

  const handleCourseChange = (event) => {
    setValue("weeks", null);
  };

  return (
    <div className="space-y-4">
      <Title
        text={
          type === "add"
            ? "Create Project"
            : type === "view"
            ? "Project Details"
            : "Edit Project"
        }
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {type === "view" && (
              <label htmlFor="courseId" className="font-bold">
                Course
              </label>
            )}
            <Controller
              control={control}
              name="course_id"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  maxMenuHeight={230}
                  options={courseOptions}
                  placeholder="Course Name"
                  isDisabled={type === "view"}
                  onInputChange={handleCourseChange}
                  className="w-full border outline-none rounded-md font-mulish text-xl font-semibold"
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={document.body}
                  menuPosition="absolute"
                />
              )}
            />
            {errors.course_id && (
              <span className="text-red-600">This field is required</span>
            )}
          </div>
          <div className="space-y-2">
            {type === "view" && (
              <label htmlFor="weeks" className="font-bold">
                Weeks
              </label>
            )}
            <Controller
              control={control}
              name="weeks"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  maxMenuHeight={230}
                  placeholder="Week"
                  options={weekOption}
                  className="w-full border outline-none rounded-md font-mulish text-xl font-semibold z-10"
                  isDisabled={type === "view"}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={document.body}
                  menuPosition="absolute"
                />
              )}
            />
            {errors.weeks && (
              <span className="text-red-600">This field is required</span>
            )}
          </div>
        </div>

        <div className="space-y-2 pt-3">
          {type === "view" && <label className="font-bold">Project Name</label>}
          <input
            type="text"
            disabled={type === "view"}
            className="w-full px-4 py-3 h-[44px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
            placeholder="Project Name"
            {...register("project_name", {
              required: "Project Name is required",
            })}
          />
          {errors.project_name && (
            <span className="text-red-600">{errors.project_name.message}</span>
          )}
        </div>
        <div className="pt-4">
          {type === "view" && (
            <label className="font-bold pt-3">Project File</label>
          )}
        </div>

        <div className="mb-4 border p-4 rounded-md overflow-hidden">
          {featured && (
            <div className="flex gap-2">
              <div className="relative">
                <AiOutlineFileDone
                  size={40}
                  className="mr-2 cursor-pointer"
                  onClick={() => {
                    const fileName = featured.split("/").slice(-1)[0];
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
                    className="absolute -top-1 right-2 cursor-pointer text-red-600 w-3 h-3"
                    onClick={() => setFile(null)}
                  />
                )}
              </div>
            </div>
          )}
          <div className="relative">
            <input
              type="file"
              id="documents"
              disabled={type === "view"}
              onChange={handleFileChange}
              placeholder="Project File"
              accept=".pdf"
              className="absolute inset-0  w-full h-full opacity-0 cursor-pointer"
            />
            {documentErr && <span className="text-red-600">{documentErr}</span>}
            <div className="p-4 text-center">
              <span className="text-gray-500">
                {type !== "view" ? "Upload Project File Here" : ""}
              </span>
            </div>
          </div>
        </div>
        <div>
          {type !== "view" && (
            <button
              type="submit"
              className="px-6 py-2 mt-4 block rounded-full bg-primary text-white"
            >
              {type === "edit" ? "Update" : "Submit"}
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

export default ProjectForm;
