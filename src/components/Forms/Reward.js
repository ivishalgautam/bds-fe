import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const updateReward = async (data, id) => {
  return http().put(`${endpoints.rewards.getAll}/${id}`, data);
};

export default function RewardForm({ studentId, setIsModal }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const updateMutation = useMutation(
    (updatedItem) => updateReward(updatedItem, studentId),
    {
      onSuccess: () => {
        toast.success("reward added");
      },
      onError: () => {
        toast.error("unable to add reward!");
      },
    }
  );

  const onSubmit = async (data) => {
    const payload = {
      reward_points: data.reward_points,
    };
    updateMutation.mutate(payload);
    reset();
    setIsModal(false);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-96 space-y-6 mx-auto"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              id="reward_points"
              placeholder="Reward points"
              className="w-full px-4 py-2 outline-none border border-gray-300 rounded-md"
              {...register("reward_points", {
                required: "Rewards is required",
              })}
            />
            {errors.username && (
              <p className="text-red-500">{errors.reward_points.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-2 bg-primary rounded-lg text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
