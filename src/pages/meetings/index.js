import MeetingCard from "@/components/Cards/Meeting";
import MeetingForm from "@/components/Forms/MeetingForm";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import { MainContext } from "@/store/context";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import useLocalStorage from "@/utils/useLocalStorage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";

const fetchMeetings = async () => {
  return http().get(endpoints.meeting);
};

export default function Meetings() {
  const [accessToken] = useLocalStorage("token");
  const { user } = useContext(MainContext);
  const [openCreateMeeting, setOpenCreateMeeting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["meetings"],
    queryFn: fetchMeetings,
  });

  const queryClient = useQueryClient();

  async function handleDelete(id) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const resp = await axios.delete(`${baseUrl}/meeting/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (resp.statusText === "OK") {
        toast.success("Meeting deleted");
        queryClient.invalidateQueries("meetings");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const openMeetingModal = () => {
    setOpenCreateMeeting(true);
  };

  const closeMeetingModal = () => {
    setOpenCreateMeeting(false);
  };

  console.log({ data });

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title text="All Meetings" />

        {user?.role === "teacher" && (
          <button
            className="bg-primary px-6 py-2 rounded-full text-white"
            onClick={openMeetingModal}
          >
            Create Meeting
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((meeting) => (
          <MeetingCard
            key={meeting.id}
            meeting={meeting}
            handleDelete={handleDelete}
          />
        ))}
      </div>

      <Modal isOpen={openCreateMeeting} onClose={closeMeetingModal}>
        <MeetingForm closeMeetingModal={closeMeetingModal} />
      </Modal>
    </div>
  );
}
