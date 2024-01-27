import CreateLeadForm from "@/components/Forms/CreateLead";
import Title from "@/components/Title";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { isObject } from "@/utils/object";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const createLead = async (data) => {
  return http().post(endpoints.leads.getAll, data);
};

export default function CreateLeads() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createMutation = useMutation(createLead, {
    onSuccess: () => {
      toast.success("Lead sent");
      queryClient.invalidateQueries("fetchLeads");
      router.push("/leads");
    },
    onError: (err) => {
      if (isObject(err)) {
        toast.error(err.response.data.message);
      } else {
        console.log("Some error occured!");
      }
    },
  });

  const handleCreate = async (data) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <Title text={"Create Leads"} />
      <CreateLeadForm type={"create"} handleCreate={handleCreate} />
    </div>
  );
}
