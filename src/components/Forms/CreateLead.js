import { useFetchCoursesNames } from "@/hooks/useFetchCoursesName";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import Title from "../Title";

export default function CreateLeadForm({
  handleUpdate,
  handleCreate,
  leadId,
  type,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const { data } = useFetchCoursesNames();
  const formattedCourse = data?.map(({ label, value }) => ({ label, value }));

  const onSubmit = async (data) => {
    const payload = {
      fullname: data.fullname,
      email: data.email,
      phone: data.phone,
      course_id: data.course.value,
    };

    type === "create" ? handleCreate(payload) : handleUpdate(payload);
  };

  const getDetails = async (id) => {
    try {
      const resp = await http().get(`${endpoints.leads.getAll}/${id}`);
      (await resp) && setValue("fullname", resp?.fullname);
      (await resp) && setValue("phone", resp?.phone);
      (await resp) && setValue("email", resp?.email);
      formattedCourse &&
        setValue(
          "course",
          formattedCourse?.find((so) => so.value === resp?.course_id)
        );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if ((leadId && type === "view") || type === "edit") {
      getDetails(leadId);
    }
  }, [leadId, formattedCourse]);

  return (
    <div className="space-y-4">
      {type === "create" ? null : (
        <div className="flex items-center justify-between">
          <Title text={type === "edit" ? "Edit Lead" : "Lead Details"} />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          {/* fullname */}
          <div>
            <input
              type="text"
              name="fullname"
              placeholder="Fullname"
              className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
              {...register("fullname", {
                required: "Fullname is required",
              })}
              disabled={type === "view"}
            />
            {errors.fullname && (
              <p className="text-red-600">{errors.fullname.message}</p>
            )}
          </div>

          {/* phone */}
          <div>
            <input
              type="number"
              name="phone"
              placeholder="Phone number"
              className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Invalid mobile number",
                },
              })}
              disabled={type === "view"}
            />
            {errors.phone && (
              <p className="text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* email */}
          <div>
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
              })}
              disabled={type === "view"}
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* course */}
          <div>
            <Controller
              control={control}
              name="course"
              maxMenuHeight={320}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  isDisabled={type === "view"}
                  options={formattedCourse}
                  placeholder="Select course"
                  className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={
                    typeof document !== "undefined" && document.body
                  }
                  menuPosition="absolute"
                />
              )}
            />
            {errors.course && (
              <p className="text-red-600">{errors.course.message}</p>
            )}
          </div>

          {/* button */}
          {type === "view" ? null : (
            <div className="col-span-2">
              <button className="bg-primary px-6 py-2 text-white rounded-full font-mulish">
                {type === "create" ? "Send lead" : "Update"}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
