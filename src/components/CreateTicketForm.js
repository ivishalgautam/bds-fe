import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Title from "./Title";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const createTicket = async (newItem) => {
  await http().post(endpoints.ticket.getAll, newItem);
};

const CreateTicketForm = ({
  closeModal,
  selectedId,
  type,
  handleUpdateTicket,
}) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const queryClient = useQueryClient();

  const createMutation = useMutation(createTicket, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
      toast.success("Your ticket raised.");
    },
    onError: () => {
      toast.error("Failed to raise ticket");
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await http().get(`${endpoints.ticket.getAll}/${selectedId}`);
      setValue("heading", data.heading);
      setValue("description", data.description);
    };
    if (selectedId && type === "edit") {
      fetchData();
    }
  }, [selectedId]);

  const handleCreateTicket = (newItem) => {
    createMutation.mutate(newItem);
  };

  const onSubmit = (data) => {
    if (type == "edit") {
      handleUpdateTicket(data);
    } else {
      handleCreateTicket(data);
    }
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Title text={type === "edit" ? "Edit Ticket" : "Create Ticket"} />
      <div>
        <label htmlFor="heading">Heading</label>
        <input
          {...register("heading", { required: "Heading is required" })}
          type="text"
          className="w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
        />
        {errors.heading && (
          <span className="text-red-600">{errors.heading.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          className="w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
        />
        {errors.description && (
          <span className="text-red-600">{errors.description.message}</span>
        )}
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-primary px-6 py-2 text-white rounded-full"
        >
          {type === "edit" ? "Update" : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default CreateTicketForm;
