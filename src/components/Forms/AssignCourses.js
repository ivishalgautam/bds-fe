import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Title from "../Title";
import http from "../../utils/http";
import { endpoints } from "../../utils/endpoints";
import Select from "react-select";
import { useFetchUsers } from "@/hooks/useFetchUseres";

const AssignCourseForm = ({
  handleCreate,
  handleUpdate,
  closeModal,
  coursesAssignId,
  courses,
  type,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data) => {
    const payload = {
      status: data.status.value,
      course_id: data.course_id.value,
      user_id: data.user_id.value,
    };
    type === "edit" ? handleUpdate(payload) : handleCreate(payload);
    closeModal();
  };

  const { data: users } = useFetchUsers();

  const formattedUsers = users?.map(({ id: value, username: label }) => ({
    value,
    label,
  }));

  const options = [
    { value: "UNASSIGNED", label: "Unassigned" },
    { value: "ASSIGNED", label: "Assigned" },
  ];

  //prefilled data
  useEffect(() => {
    const fetchInfo = async () => {
      const response = await http().get(
        `${endpoints.assign_courses}/${coursesAssignId}`
      );
      courses &&
        setValue(
          "course_id",
          courses.find((so) => so.value === response.course_id)
        );
      options &&
        setValue(
          "status",
          options.find((so) => so.value === response.status)
        );
      formattedUsers &&
        setValue(
          "user_id",
          formattedUsers.find((so) => so.value === response.user_id)
        );
    };
    if (coursesAssignId && (type === "edit" || type === "view")) {
      fetchInfo();
    }
  }, [coursesAssignId, formattedUsers, courses, options]);
  return (
    <div className="space-y-4">
      <Title
        text={
          type === "add"
            ? "Assign Course"
            : type === "view"
            ? "Assign Course Details"
            : "Edit Assign Course"
        }
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <Controller
              control={control}
              name="status"
              maxMenuHeight={230}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={options}
                  placeholder="Status"
                  isDisabled={type === "view"}
                  className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={document.body}
                  menuPosition="absolute"
                />
              )}
            />
            {errors.status && (
              <p className="text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              control={control}
              maxMenuHeight={230}
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

          <div className="space-y-2">
            <Controller
              control={control}
              maxMenuHeight={230}
              name="user_id"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={formattedUsers}
                  placeholder="Select Users"
                  isDisabled={type === "view"}
                  className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={document.body}
                  menuPosition="absolute"
                />
              )}
            />
            {errors.user_id && (
              <p className="text-red-600">{errors.user_id.message}</p>
            )}
          </div>
        </div>

        {type !== "view" && (
          <button
            type="submit"
            className="px-6 py-2 mt-4 rounded-full bg-primary text-white"
          >
            {type === "edit" ? "Update" : "Submit"}
          </button>
        )}
      </form>
    </div>
  );
};

export default AssignCourseForm;
