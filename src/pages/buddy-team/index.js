import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Avatar from "@/assets/avatar.svg";
import Title from "@/components/Title";
import Group1 from "@/assets/group1.svg";
import Group2 from "@/assets/group2.svg";
import Group3 from "@/assets/group3.svg";
import Group4 from "@/assets/group4.svg";
import Group5 from "@/assets/group5.svg";
import { MainContext } from "@/store/context";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import Spinner from "@/components/Spinner";
import { useFetchStudents } from "@/hooks/useFetchStudents";
import { toast } from "react-hot-toast";
import { useFetchGroups } from "@/hooks/useFetchGroups";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

function BuddyTeam() {
  const [selectedIds, setSelectedIds] = useState([]);
  const { user } = useContext(MainContext);
  const [selected, setSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: students, isError, isLoading } = useFetchStudents();
  const { data: groups } = useFetchGroups();
  const queryClient = useQueryClient();
  // console.log({ groups });

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  // Handle checkbox change
  const handleCheckboxChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id)); // Remove ID
    } else {
      setSelectedIds([...selectedIds, id]); // Add ID
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      group_name: data.name,
      group_admin: [user.id],
      group_image: data.group,
      group_users: selectedIds,
    };

    setLoading(true);
    try {
      // const response = await http().post(endpoints.buddy.getAll, payload);
      const response = await http().post(
        `${endpoints.groups.getAll}/invite`,
        payload
      );
      queryClient.invalidateQueries("fetchGroups");
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      reset();
    }
  };

  const GroupImages = [
    {
      value: "http://localhost:3001/public/images/group1.svg",
      label: "group1",
      imageSrc: Group1,
    },
    {
      value: "http://localhost:3001/public/images/group2.svg",
      label: "group2",
      imageSrc: Group2,
    },
    {
      value: "http://localhost:3001/public/images/group3.svg",
      label: "group3",
      imageSrc: Group3,
    },
    {
      value: "http://localhost:3001/public/images/group4.svg",
      label: "group4",
      imageSrc: Group4,
    },
    {
      value: "http://localhost:3001/public/images/group5.svg",
      label: "group5",
      imageSrc: Group5,
    },
  ];

  if (isLoading)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );

  if (isError) {
    return <h1>Error</h1>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {user?.role === "student" && (
        <div className="p-8 bg-white space-y-8 rounded-xl">
          <Title text="Create Buddy Team" />
          <div className="flex gap-4">
            <div>
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-2 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Interests"
                className="w-full px-4 py-2 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                {...register("interests", {
                  required: "Interests are required",
                })}
              />
              {errors.interests && (
                <p className="text-red-600">{errors.interests.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-8">
            <label>Group Images:</label>
            <div className="radio-toolbar flex gap-4">
              {GroupImages.map((group, i) => (
                <label
                  key={group.value}
                  onClick={() => setSelected(i)}
                  className={
                    selected === i
                      ? "border-2 border-primary p-1 rounded-full"
                      : "border-2 border-transparent p-1 rounded-full"
                  }
                >
                  <input
                    type="radio"
                    value={group.value}
                    {...register("group", { required: "Group is required" })}
                  />
                  <Image src={group.imageSrc} alt={group.label} />
                </label>
              ))}
            </div>
            {errors.group && (
              <span className="text-red-600">{errors.group.message}</span>
            )}
          </div>
        </div>
      )}

      <div className="px-8 space-y-8 rounded-xl">
        <Title text="Your groups" />
        <div className="grid grid-cols-4 gap-8">
          {groups?.length === 0 ? (
            <p className="text-center">You have no group</p>
          ) : (
            groups?.map((item, index) => (
              <Link key={index} href={`/buddy-team/${item.id}`}>
                <div
                  className={`bg-white p-8 rounded-xl space-y-2 relative border-2 `}
                >
                  <div className="flex">
                    <img
                      src={item.group_image}
                      alt=""
                      className="w-24 h-24 mx-auto rounded-full shadow-md"
                    />
                  </div>
                  <h3 className="font-bold text-center">{item.group_name}</h3>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {user?.role === "student" && (
        <div className="px-8 space-y-8 rounded-xl">
          <Title text="Select Batchmates to Join ( 3/5 )" />
          <div className="grid grid-cols-4 gap-8">
            {students?.map((item, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-xl space-y-2 relative border-2 ${
                  selectedIds.includes(item.user_id)
                    ? " border-primary"
                    : "border-white"
                }`}
              >
                <div className="flex">
                  <label className="absolute w-full h-full opacity-0">
                    <input
                      type="checkbox"
                      className="form-checkbox w-5 h-5 text-primary rounded focus:ring-primary focus:ring-2 "
                      checked={selectedIds.includes(item.user_id)} // Check if ID is in selectedIds array
                      onChange={() => handleCheckboxChange(item.user_id)} // Pass the ID to the handler
                    />
                  </label>
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${item.image_url}`}
                    alt=""
                    className="w-24 h-24 mx-auto rounded-full shadow-md"
                  />
                </div>
                <h3 className="font-bold text-center">{item.title}</h3>
                <p className="text-center">{item.username}</p>
                {/* <p className="text-center">
                Earned Points :{" "}
                <span className="text-yellow-400">{item.points}</span>
              </p> */}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-primary px-6 py-2 rounded-md text-white"
            >
              {loading ? <Spinner color="white" /> : "Create Team"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export default BuddyTeam;
