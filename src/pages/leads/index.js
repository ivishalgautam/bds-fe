import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import LeadsTable from "@/components/ui/table/Leads";
import { useFetchLeads } from "@/hooks/useFetchLeads";
import { MainContext } from "@/store/context";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import Link from "next/link";
import { useContext, useState } from "react";
import { isObject } from "@/utils/object";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import CreateLeadForm from "@/components/Forms/CreateLead";

const updateLead = async (data) => {
  return http().put(`${endpoints.leads.getAll}/${data.id}`, data);
};

export default function Leads() {
  const { user } = useContext(MainContext);
  const { data, isLoading, isError } = useFetchLeads();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState(null);
  const [leadId, setLeadId] = useState(null);

  const router = useRouter();
  const queryClient = useQueryClient();

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateMutation = useMutation(updateLead, {
    onSuccess: () => {
      toast.success("Updated");
      queryClient.invalidateQueries("fetchLeads");
      closeModal();
    },
    onError: (err) => {
      if (isObject(err)) {
        toast.error(err.response.data.message);
      } else {
        console.log("Some error occured!");
      }
    },
  });

  const handleUpdate = async (data) => {
    updateMutation.mutate({ ...data, id: leadId });
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <h2>Error!</h2>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Title text={"Leads"} />
        {user?.role === "sub_franchisee" && (
          <Link
            href={"/leads/create"}
            className="bg-primary text-white px-4 py-1.5 rounded-full"
          >
            Create Lead
          </Link>
        )}
      </div>

      <LeadsTable
        leads={data}
        isLoading={isLoading}
        setLeadId={setLeadId}
        setType={setType}
        openModal={openModal}
        user={user}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateLeadForm
          handleUpdate={handleUpdate}
          closeModal={closeModal}
          leads={data}
          leadId={leadId}
          type={type}
        />
      </Modal>
    </div>
  );
}
