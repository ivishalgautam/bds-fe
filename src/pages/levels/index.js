import LevelCard from "@/components/Cards/LevelCard";
import SubFranchiseeCard from "@/components/Cards/SubFranchiseeCard";
import Title from "@/components/Title";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

const fetchLevels = async () => {
  return await http().get(endpoints.levels.getAll);
};

export default function Levels() {
  const { data } = useQuery({
    queryKey: ["levels"],
    queryFn: fetchLevels,
  });

  return (
    <div className="space-y-6">
      <Title text="All Levels" />

      <div className="grid grid-cols-2 gap-6">
        <Link
          href="/levels/create"
          className="bg-white p-8 space-y-3 rounded-xl cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <AiOutlinePlus className="text-6xl bg-primary p-2 text-white rounded-full" />
            <p>Add New Level</p>
          </div>
        </Link>
        {data?.map((item) => (
          <LevelCard
            key={item.id}
            level={item.level}
            id={item.id}
            minRewardPoint={item.min_reward_point}
          />
        ))}
      </div>
    </div>
  );
}
