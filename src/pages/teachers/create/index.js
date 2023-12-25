import CreateTeacher from "@/components/Forms/CreateTeacher";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

function Create() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const createTeacher = async (newItem) => {
    await http().post(endpoints.createUser, newItem);
  };

  const createMutation = useMutation(createTeacher, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher created successfully.");
      router.push("/teachers");
    },
    onError: () => {
      toast.error("Failed to create Teacher.");
      router.push("/teachers");
    },
  });

  const handleCreate = (newItem) => {
    createMutation.mutate(newItem);
  };
  return (
    <div className="bg-white p-8 rounded-xl">
      <CreateTeacher
        userRole="teacher"
        type="add"
        handleCreate={handleCreate}
      />
    </div>
  );
}

export default Create;
