import LevelForm from "@/components/Forms/Level";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { isObject } from "@/utils/object";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";

const createLevel = async (data) => {
  return await http().post(endpoints.levels.getAll, data);
};

export default function LevelCreate() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const postMutations = useMutation(createLevel, {
    onSuccess: () => {
      toast.success("Level created");
      queryClient.invalidateQueries("fetchLevels");
      router.push("/levels");
    },
    onError: (err) => {
      if (isObject(err)) {
        toast.error(err.message);
      } else {
        toast.error("Error while creating level!");
      }
    },
  });

  const handleCreate = async (data) => {
    postMutations.mutate(data);
  };

  return (
    <div>
      <LevelForm type="add" handleCreate={handleCreate} />
    </div>
  );
}
