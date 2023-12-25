import CreateTeacher from "@/components/Forms/CreateTeacher";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

function Create() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createStudent = async (newItem) => {
    await http().post(endpoints.createUser, newItem);
  };

  const createMutation = useMutation(createStudent, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student created successfully.");
      router.push("/students");
    },
    onError: () => {
      toast.error("Failed to create Student.");
      router.push("/students");
    },
  });

  const handleCreate = (newItem) => {
    createMutation.mutate(newItem);
  };
  return (
    <div className="bg-white p-8 rounded-xl">
      <CreateTeacher
        userRole="student"
        type="add"
        handleCreate={handleCreate}
      />
    </div>
  );
}

export default Create;
