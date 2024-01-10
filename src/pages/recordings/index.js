import Title from "@/components/Title";
import React, { useContext, useState } from "react";
import Link from "next/link";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";
import Modal from "@/components/Modal";
import VideoPlayer from "@/components/VideoPlayer";
import { MainContext } from "@/store/context";
import { AiOutlinePlus } from "react-icons/ai";
import MeetingForm from "@/components/Forms/MeetingForm";

const fetchRecordings = () => {
  return http().get(endpoints.recordings.getAll);
};

function Recordings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const { user } = useContext(MainContext);
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["recordings"],
    queryFn: fetchRecordings,
  });

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  if (isError) return <h2>Error</h2>;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title text="All Recording" />
      </div>

      <div className="grid grid-cols-2 gap-12">
        {user?.role === "teacher" && (
          <Link
            href="/recordings/upload"
            className="bg-white p-4 rounded-xl space-y-4 flex justify-center items-center cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <AiOutlinePlus className="text-6xl bg-primary p-2 text-white rounded-full" />
              <h2 className="text-center text-2xl">Add New Video</h2>
            </div>
          </Link>
        )}

        {data?.map((item) => (
          <div className="bg-white rounded-xl overflow-hidden" key={item.id}>
            <img src={item.thumbnail} alt="" className="w-full aspect-video" />
            <div className="space-y-4 bg-white p-6  font-mulish">
              <div className="flex justify-between">
                <p className="text-primary">{item.heading}</p>
                <p>{item.batch_name}</p>
              </div>
              <h3 className="text-2xl  font-bold">{item.heading} </h3>
              <p className="text-base">{item.description}</p>
              <div className="flex justify-center">
                <button
                  className="bg-primary w-10/12 rounded-full p-2 text-white"
                  onClick={() => {
                    openModal();
                    setSelected(
                      `${process.env.NEXT_PUBLIC_AWS_PATH}/${item.video_url}`
                    );
                  }}
                >
                  View Video
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <VideoPlayer videoUrl={selected} />
      </Modal>
    </div>
  );
}

export default Recordings;
