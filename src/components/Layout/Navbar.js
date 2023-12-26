import React, { useState, useEffect, useContext } from "react";
import Logo from "../../assets/logo.svg";
import { FiSettings } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { LuWallet } from "react-icons/lu";
import { useRouter } from "next/router";
import Image from "next/image";
import Avatar from "../../assets/avatar.svg";
import { MainContext } from "@/store/context";
import { useFetchInvites } from "@/hooks/useFetchGroupInvites";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetchRewards } from "@/hooks/useFetchRewards";

const updateNotification = async ({ invitationId, status }) => {
  const data = await http().put(
    `${endpoints.groups.getAll}/invite/${invitationId}`,
    {
      status,
    }
  );

  return data;
};
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const queryClient = useQueryClient();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const router = useRouter();

  const handleLogOut = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    router.push("/login");
  };

  const { user } = useContext(MainContext);

  const userProfile = (firstName, lastName, username, email) => {
    let displayName;

    if (firstName && lastName) {
      displayName = `${firstName} ${lastName}`;
    } else if (firstName) {
      displayName = firstName;
    } else if (lastName) {
      displayName = lastName;
    } else {
      displayName = username;
    }

    return (
      <>
        <p className="text-base font-bold font-mulish">{displayName}</p>
        <p className="text-sm text-[#9A9AB0] -mt-1">{email}</p>
      </>
    );
  };

  const { data: invites, isLoading } = useFetchInvites(isNotification);
  const { data: rewards, isLoading: rewardLoading } = useFetchRewards(
    user?.role === "student"
  );

  // console.log({ rewards });

  const { mutate } = useMutation(updateNotification, {
    onSuccess: (data) => {
      console.log("success");
      queryClient.invalidateQueries("fetchInvites");
      queryClient.invalidateQueries("fetchGroups");
    },
  });

  const handleNotfication = async (e, invitationId, status) => {
    e.preventDefault();
    mutate({ invitationId, status });
  };

  return (
    <div className="bg-white shadow-md h-[80px] flex items-center justify-between px-4 border-b">
      <Image src={Logo} alt="logo" width={160} height={40} priority />
      <div className="flex items-center gap-2">
        {user?.role === "student" && (
          <div className="rounded-full p-1 bg-yellow-200 text-white flex items-center justify-center cursor-pointer gap-2">
            <div className="p-2 bg-yellow-500 rounded-full">
              <LuWallet size={25} className="text-black" />
            </div>
            {rewardLoading ? (
              <span className="text-yellow-500 text-xs font-extrabold">
                {rewardLoading ? "loading..." : rewards?.[0].reward_points ?? 0}
              </span>
            ) : (
              <span className="text-yellow-500 text-2xl font-extrabold">
                {rewards?.[0]?.reward_points ?? 0}
              </span>
            )}
            <span className="text-black leading-3 text-xs font-semibold mr-2">
              Reward <br /> points
            </span>
          </div>
        )}
        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer">
          <FiSettings className="w-6 h-6" />
        </div>
        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer relative">
          <IoMdNotificationsOutline
            className="w-7 h-7"
            onMouseOver={() => setIsNotification(true)}
          />
          {isNotification && (
            <ul
              className="absolute top-full right-0 bg-white text-black w-96 shadow-lg p-4 rounded-md space-y-4 z-40"
              onMouseLeave={() => setIsNotification(false)}
            >
              {isLoading ? (
                <p>Loading notifications...</p>
              ) : invites?.length === 0 ? (
                <p>No notifications</p>
              ) : (
                invites?.map((invite, ind) => (
                  <li key={invite.id}>
                    <div className="flex gap-4 mb-2">
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${invite.admin_profile}`}
                        alt="admin profile"
                        className="rounded-full w-10 h-10"
                      />
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700">
                          Group <b>{invite.group_name}</b> invitation by{" "}
                          <b>{invite.admin}</b>
                        </p>
                        <div className="space-x-1">
                          {invite.is_viewed ? (
                            <p className="capitalize">{invite.status}</p>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="bg-emerald-500 text-white w-20 py-1 rounded-md text-sm font-bold"
                                onClick={(e) =>
                                  handleNotfication(e, invite.id, "accepted")
                                }
                              >
                                Join
                              </button>
                              <button
                                type="button"
                                className="bg-rose-500 text-white w-20 py-1 rounded-md text-sm font-bold"
                                onClick={(e) =>
                                  handleNotfication(e, invite.id, "declined")
                                }
                              >
                                Decline
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {invites?.length !== ind + 1 && <hr />}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div className="relative inline-block">
          {user && (
            <div
              onClick={toggleDropdown}
              className="flex gap-4 items-center cursor-pointer"
            >
              {user.image_url ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${user.image_url}`}
                  alt="profile"
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <Image
                  src={Avatar}
                  alt="avatar"
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                {userProfile(
                  user.first_name,
                  user.last_name,
                  user.username,
                  user.email
                )}
              </div>
            </div>
          )}
          {isOpen && (
            <div className="absolute mt-2 py-2 px-4 bg-white border border-gray-300 rounded-md w-full z-10 cursor-pointer">
              {/* Dropdown content */}
              <ul>
                <li onClick={handleLogOut}>Log Out</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
