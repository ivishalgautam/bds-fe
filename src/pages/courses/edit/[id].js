import React from "react";
import CreateCourse from "../../../components/Forms/CreateCourse";
import { useRouter } from "next/router";
import http from "../../../utils/http";
import { endpoints } from "../../../utils/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function EditCourse() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const updateItem = async (itemId, updatedItem) => {
    await http().put(`${endpoints.courses.getAll}/${itemId}`, updatedItem);
  };

  const updateMutation = useMutation(
    (updatedItem) => updateItem(id, updatedItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        toast.success("Course updated successfully.");
        router.push("/courses");
      },
      onError: () => {
        toast.error("Failed to update Course.");
        router.push("/courses");
      },
    }
  );

  const handleUpdate = (updatedItem) => {
    updateMutation.mutate(updatedItem);
  };

  return <CreateCourse id={id} type="edit" handleUpdate={handleUpdate} />;
}

export default EditCourse;
