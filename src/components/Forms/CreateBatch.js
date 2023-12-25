import React, { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import Title from "../Title";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useFetchCoursesNames } from "@/hooks/useFetchCoursesName";
import { useFetchStudents } from "@/hooks/useFetchStudents";
import { useFetchTeachers } from "@/hooks/useFetchTeachers";
import { MainContext } from "@/store/context";

function CreateBatch({
  students,
  teachers,
  courses,
  handleCreateBatch,
  closeModal,
  selectedBatch,
  type,
  handleUpdateBatch,
}) {
  const { user } = useContext(MainContext);
  const { data: coursesData } = useFetchCoursesNames();
  const { data: studentsData } = useFetchStudents();
  const { data: teachersData } = useFetchTeachers(user?.role);

  const formatedStudents = studentsData.map(
    ({ id: value, username: label }) => {
      return { value, label };
    }
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const studentIds = data.students_ids.map((student) => student.value);
    console.log({ data });
    let payload = {
      batch_name: data.batch_name,
      students_ids: studentIds,
      course_id: data.course_id.value,
      start_time: data.start_time,
      end_time: data.end_time,
    };

    if (user?.role !== "teacher") {
      payload.teacher_id = data.teacher_id.value;
    }

    if (type === "add") {
      handleCreateBatch(payload);
    } else {
      handleUpdateBatch(payload);
    }
    closeModal();
  };

  useEffect(() => {
    // Fetch data from API and populate the form with prefilled values

    const fetchData = async () => {
      try {
        const data = await http().get(
          `${endpoints.batch.getAll}/${selectedBatch}`
        );
        const course = { label: data.course_name, value: data.course_id };

        const teachers = teachersData?.find(
          (item) => item.id === data.teacher_id
        );

        const teacher = {
          label: teachers?.username,
          value: teachers?.id,
        };

        const getStudents = (preselectedStudents) => {
          return formatedStudents.filter((student) =>
            preselectedStudents.includes(student.value)
          );
        };

        setValue("batch_name", data.batch_name);
        teacher && setValue("teacher_id", teacher);
        setValue("course_id", course);
        setValue("students_ids", getStudents(data.students_id));
        setValue("start_time", data.start_time);
        setValue("end_time", data.end_time);
      } catch (error) {
        console.error(error);
      }
    };
    if (type === "edit" || type === "view") {
      fetchData();
    }
  }, [setValue, type, selectedBatch]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 bg-white  rounded-xl"
    >
      <Title
        text={
          type === "add"
            ? "Create Batch"
            : type === "view"
            ? "Batch Details"
            : "Edit Batch"
        }
      />
      <div className="grid grid-cols-2 gap-8">
        <div>
          <input
            type="text"
            disabled={type === "view"}
            className="w-full px-4 py-3 h-[44px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
            placeholder="Batch Name"
            {...register("batch_name", {
              required: "Batch Name is required",
            })}
          />
          {errors.batch_name && (
            <span className="text-red-600">{errors.batch_name.message}</span>
          )}
        </div>
        <div>
          {/* <label htmlFor="role">Studetns:</label> */}

          <Controller
            control={control}
            name="course_id"
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={courses}
                placeholder="Select Course"
                isDisabled={type === "view"}
                className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={document.body}
                menuPosition="absolute"
              />
            )}
          />
          {errors.course_id && (
            <p className="text-red-600">{errors.course_id.message}</p>
          )}
        </div>
        {user?.role !== "teacher" && (
          <div>
            {/* <label htmlFor="role">Studetns:</label> */}

            <Controller
              control={control}
              name="teacher_id"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={teachers}
                  placeholder="Select Teacher"
                  isDisabled={type === "view"}
                  className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={document.body}
                  menuPosition="absolute"
                />
              )}
            />
            {errors.teacher_id && (
              <p className="text-red-600">{errors.teacher_id.message}</p>
            )}
          </div>
        )}
        <div>
          {/* <label htmlFor="role">Studetns:</label> */}

          <Controller
            control={control}
            name="students_ids"
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                isDisabled={type === "view"}
                options={students}
                placeholder="Selected Students"
                className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={document.body}
                menuPosition="absolute"
              />
            )}
          />
          {errors.students_ids && (
            <p className="text-red-600">{errors.students_ids.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="start_time">Start Time:</label>
          <input
            type="time"
            disabled={type === "view"}
            className="w-full px-4 py-3 h-[44px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
            placeholder="Start time"
            {...register("start_time", {
              required: "Start time is required",
            })}
          />
          {errors.batch_name && (
            <span className="text-red-600">{errors.batch_name.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="end_time">End time:</label>
          <input
            type="time"
            disabled={type === "view"}
            className="w-full px-4 py-3 h-[44px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
            placeholder="End time"
            {...register("end_time", {
              required: "End time is required",
            })}
          />
          {errors.batch_name && (
            <span className="text-red-600">{errors.batch_name.message}</span>
          )}
        </div>
      </div>
      {type !== "view" && (
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-primary text-white w-24 py-2 rounded-full"
          >
            {type === "edit" ? "Update" : "Submit"}
          </button>
        </div>
      )}
    </form>
  );
}

export default CreateBatch;
