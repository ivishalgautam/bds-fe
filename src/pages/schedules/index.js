import CreateSchedule from "@/components/Forms/CreateSchedule";
import Calender from "@/components/Layout/Calendar";
import { MainContext } from "@/store/context";
import React, { useContext, useEffect, useState } from "react";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { isObject } from "@/utils/object";
import Modal from "@/components/Modal";
import { AiOutlinePlus } from "react-icons/ai";

const fetchBatches = () => {
  return http().get(endpoints.batch.getAll);
};

const createSchedule = async (newItem) => {
  await http().post(endpoints.schedules.getAll, newItem);
};

const updateSchedule = async (scheduleId, updatedItem) => {
  console.log({ scheduleId, updatedItem });
  const data = await http().put(
    `${endpoints.schedules.getAll}/${scheduleId}`,
    updatedItem
  );
  console.log({ data });
  return data;
};

export default function Schedules() {
  const { user } = useContext(MainContext);
  const [type, setType] = useState(null);
  const [meetings, setMeetings] = useState(null);
  const [batchId, setBatchId] = useState("");
  const [scheduleId, setScheduleId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { control } = useForm();

  const { data: batches } = useQuery({
    queryKey: ["batches"],
    queryFn: fetchBatches,
  });

  const formattedBatches = batches?.map(({ id: value, batch_name: label }) => ({
    value,
    label,
  }));

  const { data } = useQuery({
    queryKey: ["schedules", batchId],
    queryFn: fetchSchedules,
    enabled: !!batchId,
  });

  async function fetchSchedules() {
    return http().get(`${endpoints.schedules.getAll}/${batchId}`);
  }

  useEffect(() => {
    setMeetings(data);
  }, [data]);

  const createMutation = useMutation(createSchedule, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["create-schedule"] });
      toast.success("Schedule created.");
    },
    onError: (err) => {
      console.log({ err });
      if (isObject(err)) {
        toast.error(err.message);
      } else {
        toast.error("Failed to create schedule");
      }
    },
  });

  const handleCreate = (newItem) => {
    createMutation.mutate(newItem);
  };

  const updateMutation = useMutation(
    (updatedItem) => updateSchedule(scheduleId, updatedItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["update-schedule", "schedules"],
        });
        setIsModalOpen(false);
        toast.success("Schedule updated successfully.");
      },
      onError: (err) => {
        if (isObject(err)) {
          toast.error(err.message);
        } else {
          toast.error("Failed to update Schedule.");
        }
      },
    }
  );

  const handleUpdate = (updatedItem) => {
    updateMutation.mutate(updatedItem);
  };

  const handleBatchChange = (e) => {
    setBatchId(e.value);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      {user?.role === "sub_franchisee" && (
        <div
          className="bg-white p-4 rounded-2xl space-y-4 flex justify-center items-center cursor-pointer"
          onClick={() => {
            setType("add");
            openModal();
          }}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <AiOutlinePlus className="text-5xl bg-primary p-2 text-white rounded-full" />
            <p className="font-bold font-mulish text-lg">Create Schedule</p>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateSchedule
          type={type}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          schedules={meetings}
          formattedBatches={formattedBatches}
          scheduleId={scheduleId}
          closeModal={closeModal}
        />
      </Modal>

      <Calender
        control={control}
        handleBatchChange={handleBatchChange}
        formattedBatches={formattedBatches}
        meetings={meetings}
        setType={setType}
        openModal={openModal}
        setScheduleId={setScheduleId}
      />
    </div>
  );
}
