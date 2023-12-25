import React, { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import Title from "../Title";
import moment from "moment";
import { useFetchBatchesNames } from "@/hooks/useFetchBatchesName";
import Spinner from "../Spinner";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { MainContext } from "@/store/context";

const MeetingForm = () => {
  const {
    handleSubmit,
    control,
    watch,
    register,
    formState: { errors },
  } = useForm();
  const { user } = useContext(MainContext);
  const [show, setShow] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState();
  const watchMeetingType = watch("meeting_type");
  const { data: batches, isLoading, isError } = useFetchBatchesNames();

  const formatedbatches = batches?.map(({ id: value, batch_name: label }) => {
    return { value, label };
  });

  // Function to handle form submission
  const onSubmit = async (data) => {
    let payload = {
      meeting_topic: data.meeting_topic,
      meeting_host: user.email,
      meeting_type: data.meeting_type.value,
      batch_id: data.batch_id.value,
    };
    
    if (data.meeting_type.value === 2) {
      payload.scheduled_at= moment(data.scheduled_at, "YYYY-MM-DDTHH:mm").format(
        "YYYY-MM-DDTHH:mm:ss[Z]"
      )
    }

    try {
      const res = await http().post(endpoints.meeting, payload);
      console.log(res);
      if (res.meeting_type === "INSTANT") {
        //redirect user to start url
        window.location.href = res.start_url;
      } else {
        setMeetingDetails(res);
        setShow(true);
      }
    } catch (error) {
      console.log(error);
    }

    console.log(payload);
    // You can submit the data to your API or perform any other actions here
  };
  const now = new Date();
  const minDateTime = moment(now).format("YYYY-MM-DDTHH:mm");

  // Options for the meeting type select field
  const meetingTypeOptions = [
    { value: 1, label: "Instant" },
    { value: 2, label: "Schedule" },
  ];

  if (isLoading)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  if (isError) return <h2>Error</h2>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Title text="Create Meeting" />
      <div className="grid grid-cols-2 gap-6">
        <div>
          {/* <label>Meeting Topic</label> */}
          <input
            {...register("meeting_topic", { required: true })}
            placeholder="Meeting Topic"
            className="w-full px-4 h-[42px] border outline-none rounded-md font-mulish text-xl font-semibold"
          />
          {errors.meeting_topic && (
            <span className="text-red-600">This field is required</span>
          )}
        </div>

        <div>
          {/* <label>Meeting Participants</label> */}
          <Controller
            name="batch_id"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select Batch"
                className="w-full  h-[42px] border outline-none rounded-md  font-mulish text-xl font-semibold"
                options={formatedbatches}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={document.body}
                menuPosition="absolute"
              />
            )}
          />
          {errors.batch_id && (
            <span className="text-red-600">This field is required</span>
          )}
        </div>

        <div>
          {/* <label>Meeting Type</label> */}
          <Controller
            name="meeting_type"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                options={meetingTypeOptions}
                placeholder="Meeting Type"
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={document.body}
                menuPosition="absolute"
                className="w-full  h-[42px] border outline-none rounded-md  font-mulish text-xl font-semibold"
              />
            )}
          />
          {errors.meeting_type && (
            <span className="text-red-600">This field is required</span>
          )}
        </div>
        {watchMeetingType?.value === 2 && (
          <div>
            {/* <label>Scheduled At</label> */}
            <input
              type="datetime-local"
              min={minDateTime}
              {...register("scheduled_at", {
                required: watchMeetingType.value === 1 ? false : true,
              })}
              placeholder="Scheduled At"
              className="w-full  h-[42px] border outline-none rounded-md px-4 font-mulish text-xl font-semibold"
            />
            {errors.scheduled_at && (
              <span className="text-red-600">This field is required</span>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="bg-primary px-6 py-2 rounded-full text-white"
      >
        Submit
      </button>

      {show && (
        <div>
          <h2>
            <span className="font-bold">Join Url</span> :{" "}
            {meetingDetails.join_url}{" "}
          </h2>
          <h2>
            <span className="font-bold"> Start Url</span> :{" "}
            {meetingDetails.start_url}{" "}
          </h2>
          <h2>
            <span className="font-bold">Scheduled At</span> :{" "}
            {moment(meetingDetails.scheduled_at).format("DD/MM/YYYY HH:mm A")}
          </h2>
        </div>
      )}
    </form>
  );
};

export default MeetingForm;
