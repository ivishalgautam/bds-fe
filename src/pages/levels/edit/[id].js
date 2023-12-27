import LevelForm from "@/components/Forms/Level";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";

export default function Edit() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const updateLevel = async (id, data) => {
    return await http().put(`${endpoints.levels.getAll}/${id}`, data);
  };

  const updateMutation = useMutation(
    (updatedLevel) => updateLevel(id, updatedLevel),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["levels"] });
        toast.success("level successfully updated.");
        router.push("/levels");
      },
      onError: () => {
        toast.error("Failed to update level.");
      },
    }
  );

  const handleUpdate = async (data) => {
    updateMutation.mutate(data);
  };

  return (
    <div>
      <LevelForm type={"edit"} handleUpdate={handleUpdate} id={id} />
    </div>
  );
}
