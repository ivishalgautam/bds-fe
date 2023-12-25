import React from "react";
import CreateHomeWork from "../../../components/Forms/CreateHomeWork";
import { endpoints } from "../../../utils/endpoints";
import http from "../../../utils/http";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import HomeworkForm from "@/components/Forms/HomeWork";
import toast from "react-hot-toast";
import { isObject } from "@/utils/object";

function CreateHomeWorkPage() {
  const router = useRouter();

  const createItem = async (newItem) => {
    await http().post(endpoints.homeworks.getAll, newItem);
  };

  const createMutation = useMutation(createItem, {
    onSuccess: () => {
      toast.success("Homework created successfully");
      router.push("/homework");
    },
    onError: (err) => {
      if (isObject(err)) {
        toast.error(err.message);
      } else {
        toast.error("Failed to create Homework");
      }
      router.push("/homework");
    },
  });

  const handleCreate = (newItem) => {
    createMutation.mutate(newItem);
  };

  return (
    <div className="bg-white p-8 rounded-xl">
      <HomeworkForm type="add" handleCreate={handleCreate} />
      {/* <CreateHomeWork type="add" handleCreate={handleCreate} /> */}
    </div>
  );
}

export default CreateHomeWorkPage;
