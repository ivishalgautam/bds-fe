import React, { useContext, useEffect, useState } from "react";
import Stats from "../components/Stats";
import Report from "../components/Report";
import AnnouncementSection from "../components/AnnouncementSection";
import Title from "../components/Title";
import TicketCard from "../components/Cards/TicketCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../utils/http";
import Spinner from "../components/Spinner";
import { endpoints } from "../utils/endpoints";
import Link from "next/link";
import Modal from "@/components/Modal";
import TicketForm from "@/components/TicketForm";
import CreateTicketForm from "@/components/CreateTicketForm";
import { MainContext } from "@/store/context";
import OngoingCourses from "@/components/OngoingCourses";
import MileStones from "@/components/MileStones";
import toast from "react-hot-toast";
import ProfileCard from "@/components/Cards/Profile";
import { useFetchRewards } from "@/hooks/useFetchRewards";
import { calculateLevelProgress } from "@/utils/calculateProgress";

const getReport = () => {
  return http().get(endpoints.dashboard.getAll);
};

const updateItem = async (itemId, updatedItem) => {
  await http().put(`${endpoints.ticket.getAll}/${itemId}`, updatedItem);
};

const fetchLevels = async () => {
  return await http().get(endpoints.levels.getAll);
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { user } = useContext(MainContext);

  const { isLoading, isError, data } = useQuery({
    queryKey: ["reports"],
    queryFn: getReport,
  });

  const queryClient = useQueryClient();

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const updateMutation = useMutation(
    (updatedItem) => updateItem(selectedId, updatedItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ticket"] });
        toast.success("Ticket updated successfully.");
      },
      onError: () => {
        toast.error("Failed to update Ticket.");
      },
    }
  );

  const handleUpdate = (updatedItem) => {
    updateMutation.mutate(updatedItem);
  };

  const { data: rewards, isLoading: rewardLoading } = useFetchRewards(
    user?.role === "student"
  );

  const { data: levels } = useQuery({
    queryKey: ["levels"],
    queryFn: fetchLevels,
    enabled: user?.role === "student",
  });

  console.log({ levels });

  if (isLoading)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  if (isError) return <h2>Error</h2>;

  const reports = [
    {
      title: data.reports?.total_master_franchisee || 0,
      description: "Master-Franchisee",
      bg: "bg-[#E6FFFF]",
    },
    {
      title: data.reports?.total_sub_franchisee || 0,
      description: "Total Sub-Franchisee",
      bg: "bg-[#FFE2E2]",
    },
    {
      title: data.reports?.total_student || 0,
      description: "Total No. of Students",
      bg: "bg-[#FEFFCB]",
    },
    {
      title: data.reports?.total_course || 0,
      description: "Total Courses",
      bg: "bg-[#FEFFCB]",
    },
  ];

  // console.log({ reports });

  return (
    <div className="space-y-6">
      {user?.role === "student" && (
        <div className="grid grid-cols-9 gap-4">
          <div className="bg-primary text-white col-span-3 rounded-xl shadow-lg">
            <ProfileCard
              user={user}
              minPoint={levels?.map((l) => l.min_reward_point)[0]}
              maxPoint={
                levels?.map((l) => l.min_reward_point)[levels?.length - 1]
              }
              progress={calculateLevelProgress(
                rewards?.[0].reward_points,
                levels
                  ?.map((l) => l.min_reward_point)
                  .reduce((accu, curr) => accu + curr, 0)
              )}
            />
          </div>
          <div className="col-span-6 bg-white rounded-xl py-4">
            <MileStones
              user={user}
              levels={levels}
              rewards={rewards}
              rewardLoading={rewardLoading}
            />
          </div>
        </div>
      )}
      {user?.role !== "student" && (
        <>
          <Stats data={reports} />
          <Title text="Report of 30 Days" />
          <Report last_30_days_data={data.last_30_days_reports} />
        </>
      )}
      <AnnouncementSection data={data.announcements} />
      {user?.role !== "student" && data.tickets?.length > 0 && (
        <>
          <Title text="Support Tickets to Answer" />
          <div className="">
            <div className="grid grid-cols-2 gap-6">
              {data.tickets.map((ticket) => (
                <TicketCard
                  key={ticket?.id}
                  id={ticket?.id}
                  heading={ticket?.heading}
                  setSelectedId={setSelectedId}
                  openModal={openModal}
                  description={ticket?.description}
                  date={ticket?.date}
                  imageUrl={ticket?.image_url}
                  username={
                    ticket.first_name != null && ticket.last_name != null
                      ? ticket.first_name + " " + ticket.last_name
                      : ticket.username
                  }
                  user={user}
                  answer={ticket.answer}
                />
              ))}
            </div>
            <div className="mt-16 font-bold">
              <div className="flex justify-center">
                <Link href="/support">
                  <button className="font-mulish bg-white text-black px-6 py-2 rounded-full">
                    View All
                  </button>
                </Link>
              </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <TicketForm
                handleUpdate={handleUpdate}
                closeModal={closeModal}
                selectedId={selectedId}
                user={user}
              />
            </Modal>
            <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
              <CreateTicketForm closeModal={closeCreateModal} />
            </Modal>
          </div>
        </>
      )}
      {user?.role === "student" && (
        <div className="flex gap-6">
          <div className="w-9/12">
            <OngoingCourses user={user} />
          </div>
          <div className="w-3/12">
            <h1 className="text-2xl font-semibold font-primary">
              Recent Recording
            </h1>
          </div>
        </div>
      )}
    </div>
  );
}
