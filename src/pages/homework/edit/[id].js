import React from "react";
// import CreateHomeWork from "../../../components/Forms/CreateHomeWork";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "../../../utils/endpoints";
import http from "../../../utils/http";
import { useRouter } from "next/router";
import HomeworkForm from "@/components/Forms/HomeWork";
import toast from "react-hot-toast";

function EditHomeWork() {
  const router = useRouter();
  const { id } = router.query;

  const updateItem = async (itemId, updatedItem) => {
    await http().put(`${endpoints.homeworks.getAll}/${itemId}`, updatedItem);
  };

  const queryClient = useQueryClient();

  const updateMutation = useMutation(
    (updatedItem) => updateItem(id, updatedItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["homeworks"] });
        toast.success("Homework updated successfully.");
        router.push("/homework");
      },
      onError: () => {
        toast.error("Failed to update Homework.");
        router.push("/homework");
      },
    }
  );

  const handleUpdate = (updatedItem) => {
    updateMutation.mutate(updatedItem);
  };
  return (
    <div className="bg-white p-8 rounded-xl">
      <HomeworkForm type="edit" handleUpdate={handleUpdate} productId={id} />
    </div>
  );
}

export default EditHomeWork;
