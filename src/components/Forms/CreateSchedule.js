import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

function CreateSchedule({
  type,
  schedules,
  batchId,
  scheduleId,
  handleCreate,
  handleUpdate,
  formattedBatches,
  closeModal,
}) {
  console.log({ type, scheduleId });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
  } = useForm();

  const onSubmit = (data) => {
    const { batch, ...rest } = data;
    type === "edit"
      ? handleUpdate(rest)
      : handleCreate({ batch_id: batch.value, ...rest });
    closeModal();
  };

  useEffect(() => {
    const fetchInfo = async () => {
      const response = await http().get(
        `${endpoints.schedules.getAll}/schedule/${scheduleId}`
      );
      const formattedSchedule = schedules?.filter(
        (i) => i.id === response.id
      )[0];
      formattedBatches &&
        setValue(
          "batch",
          formattedBatches?.filter((so) => so.value === response.batch_id)
        );
      schedules && setValue("schedule_name", formattedSchedule.schedule_name);
      schedules && setValue("schedule_desc", formattedSchedule.schedule_desc);
      schedules && setValue("start_time", formattedSchedule.start_time);
      schedules && setValue("end_time", formattedSchedule.end_time);
    };
    if (scheduleId && (type === "edit" || type === "view")) {
      fetchInfo();
    }
  }, [batchId, scheduleId]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl space-y-6 p-4"
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Controller
            control={control}
            maxMenuHeight={230}
            name="batch"
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={formattedBatches}
                isDisabled={type === "edit"}
                placeholder="Select batch"
                className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={
                  typeof document !== "undefined" && document.body
                }
                menuPosition="absolute"
              />
            )}
          />
          {errors.course_id && (
            <p className="text-red-600">{errors.course_id.message}</p>
          )}
        </div>

        <div>
          {/* <label htmlFor="courseName">Course Name</label> */}
          <input
            type="text"
            id="courseName"
            placeholder="Schedule Name"
            className="w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
            {...register("schedule_name", { required: true })}
          />
          {errors.course_name && (
            <span className="text-red-600">This field is required</span>
          )}
        </div>

        <div>
          {/* <label htmlFor="courseName">Course Name</label> */}
          <input
            type="textarea"
            id="courseName"
            placeholder="Schedule description"
            className="w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
            {...register("schedule_desc", { required: true })}
          />
          {errors.course_name && (
            <span className="text-red-600">This field is required</span>
          )}
        </div>

        {/* start time */}
        <div>
          <label htmlFor="courseName">Start time</label>
          <input
            type="date"
            id="courseName"
            placeholder="Start time"
            className="w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
            {...register("start_time", { required: true })}
          />
          {errors.course_name && (
            <span className="text-red-600">This field is required</span>
          )}
        </div>

        {/* end time */}
        <div>
          <label htmlFor="courseName">End time</label>
          <input
            type="date"
            id="courseName"
            placeholder="End time"
            className="w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
            {...register("end_time", { required: true })}
          />
          {errors.course_name && (
            <span className="text-red-600">This field is required</span>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="px-6 py-2 mt-4 rounded-full bg-primary text-white"
      >
        Submit
      </button>
    </form>
  );
}

export default CreateSchedule;
