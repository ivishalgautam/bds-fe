import { useContext, useState } from "react";
import Title from "../components/Title";
import { endpoints } from "../utils/endpoints";
import http from "../utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "../components/Spinner";
import TicketCard from "../components/Cards/TicketCard";
import Modal from "../components/Modal";
import TicketForm from "../components/TicketForm";
import { AiOutlinePlus } from "react-icons/ai";
import CreateTicketForm from "@/components/CreateTicketForm";
import { MainContext } from "@/store/context";
import toast from "react-hot-toast";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/ui/table/Pagination";
import { isObject } from "@/utils/object";

const fetchTickets = () => {
  return http().get(endpoints.ticket.getAll);
};

const updateItem = async (itemId, updatedItem) => {
  await http().put(`${endpoints.ticket.getAll}/${itemId}`, updatedItem);
};
const updateTicket = async (itemId, updatedItem) => {
  await http().put(`${endpoints.ticket.getAll}/${itemId}/user`, updatedItem);
};

export default function Support() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCresteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [type, setType] = useState(null);
  const { user } = useContext(MainContext);

  const { isLoading, isError, data } = useQuery({
    queryKey: ["ticket"],
    queryFn: fetchTickets,
  });

  const queryClient = useQueryClient();

  const {
    params,
    pathname,
    router,
    totalPages,
    resultsToShow,
    setResultsToShow,
    startIndex,
    endIndex,
  } = usePagination({ data: data, perPage: 5 });

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };
  const openCreateModal = () => {
    setIsCresteModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const closeCreateModal = () => {
    setIsCresteModalOpen(false);
  };

  const updateMutation = useMutation(
    (updatedItem) => updateItem(selectedId, updatedItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ticket"] });
        toast.success("Ticket Updated Successfully");
      },
      onError: () => {
        toast.error("Failed to update Ticket");
      },
    }
  );
  const updateTicketMutation = useMutation(
    (updatedItem) => updateTicket(selectedId, updatedItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ticket"] });
        toast.success("Ticket Updated Successfully");
      },
      onError: () => {
        toast.error("Failed to update Ticket");
      },
    }
  );

  const handleUpdate = (updatedItem) => {
    updateMutation.mutate(updatedItem);
  };
  const handleUpdateTicket = (updatedItem) => {
    updateTicketMutation.mutate(updatedItem);
  };

  const handleDelete = async (itemId) => {
    try {
      const resp = await http().delete(`${endpoints.ticket.getAll}/${itemId}`);
      setResultsToShow((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error("error deleting student");
      }
    }
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
      <Title text="Support" />

      <div className="grid grid-cols-2 gap-x-6 gap-y-12 pb-24">
        {user?.role !== "admin" && (
          <div
            className="p-8 bg-white rounded-xl cursor-pointer flex flex-col items-center justify-center space-y-4 "
            onClick={() => {
              openCreateModal();
              setType("add");
            }}
          >
            <AiOutlinePlus className="text-6xl bg-primary p-2 text-white rounded-full " />
            <p>Raise Ticket</p>
          </div>
        )}
        {resultsToShow?.slice(startIndex, endIndex)?.map((ticket) => (
          <TicketCard
            key={ticket.id}
            id={ticket.id}
            heading={ticket.heading}
            description={ticket.description}
            date={ticket.date}
            openModal={openModal}
            openCreateModal={openCreateModal}
            setSelectedId={setSelectedId}
            imageUrl={ticket.image_url}
            profession={ticket.profession}
            username={
              ticket.first_name != null && ticket.last_name != null
                ? ticket.first_name + " " + ticket.last_name
                : ticket.username
            }
            user={user}
            answer={ticket.answer}
            setType={setType}
            handleDelete={handleDelete}
          />
        ))}
      </div>

      {totalPages > 0 && (
        <Pagination
          params={params}
          router={router}
          pathname={pathname}
          resultsToShow={resultsToShow}
          endIndex={endIndex}
          totalPages={totalPages}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <TicketForm
          handleUpdate={handleUpdate}
          closeModal={closeModal}
          selectedId={selectedId}
          user={user}
        />
      </Modal>
      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <CreateTicketForm
          closeModal={closeCreateModal}
          selectedId={selectedId}
          type={type}
          handleUpdateTicket={handleUpdateTicket}
        />
      </Modal>
    </div>
  );
}
