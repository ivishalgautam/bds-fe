import React from "react";
import { useForm } from "react-hook-form";
import Title from "./Title";
import http from "../utils/http";
import { endpoints } from "../utils/endpoints";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function TicketForm({
  handleUpdate,
  closeModal,
  selectedId,
  user,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Fetch ticket data using react-query useQuery hook
  const { data: ticketInfo } = useQuery(
    ["ticket", selectedId],
    async () => {
      const res = await http().get(`${endpoints.ticket.getAll}/${selectedId}`);
      return res;
    },
    {
      enabled: !!selectedId, // Fetch data only when selectedId is available
    }
  );

  const queryClient = useQueryClient();

  // Use the useMutation hook to handle the update operation
  const updateMutation = useMutation((data) => handleUpdate(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["ticket", selectedId]);
      toast.success("Ticket updated successfully.");
      closeModal();
    },
    onError: () => {
      toast.error("Failed to update ticket");
      closeModal();
    },
  });

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Title text="Answer Ticket" />
      <div>
        <textarea
          id="answer"
          disabled={user?.role !== "admin"}
          placeholder="Answer"
          className="w-full px-4 py-3 border border-gray-300 outline-none rounded-md"
          {...register("answer", { required: true })}
          defaultValue={ticketInfo?.answer || ""} // Set the default value from ticketInfo
        />
        {errors.answer && (
          <span className="text-red-600">This field is required</span>
        )}
      </div>
      {user?.role === "admin" && (
        <button
          type="submit"
          className="bg-primary px-6 py-2 text-white rounded-full"
        >
          Submit
        </button>
      )}
    </form>
  );
}
