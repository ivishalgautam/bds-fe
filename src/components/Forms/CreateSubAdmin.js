import React from "react";
import { useForm } from "react-hook-form";

export default function CreateSubAdmin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <input
          type="text"
          id="subAdminName"
          placeholder="Sub Admin Name"
          className="px-4 py-3 outline-none rounded-md w-full"
          {...register("subAdminName", { required: "This field is required" })}
        />
        {errors.subAdminName && (
          <p className="text-red-600">{errors.subAdminName.message}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          id="qualifications"
          placeholder="Qualifications"
          className="px-4 py-3 outline-none rounded-md w-full"
          {...register("qualifications", {
            required: "This field is required",
          })}
        />
        {errors.qualifications && (
          <p className="text-red-600">{errors.qualifications.message}</p>
        )}
      </div>
      <div className="flex gap-4 items-stretch w-full">
        <div className="w-1/2">
          <div className="relative border rounded-md overflow-hidden w-full h-full flex items-center justify-center">
            <input
              type="file"
              id="profilePicture"
              placeholder="Select Profile Picture"
              {...register("profilePicture", {
                required: "This field is required",
              })}
              className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="p-4 text-center">
              <span className="text-gray-500">Select Profile Picture</span>
            </div>
          </div>
          {errors.profilePicture && (
            <p className="text-red-600">{errors.profilePicture.message}</p>
          )}
        </div>
        <div className="w-1/2 space-y-4">
          <div>
            <input
              type="text"
              id="designation"
              placeholder="Designation"
              className="px-4 py-3 outline-none rounded-md w-full"
              {...register("designation", {
                required: "This field is required",
              })}
            />
            {errors.designation && (
              <p className="text-red-600">{errors.designation.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              id="contactNumber"
              placeholder="Contact Number"
              className="px-4 py-3 outline-none rounded-md w-full"
              {...register("contactNumber", {
                required: "This field is required",
              })}
            />
            {errors.contactNumber && (
              <p className="text-red-600">{errors.contactNumber.message}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-full"
        >
          Create
        </button>
      </div>
    </form>
  );
}
