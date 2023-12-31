import Image from "next/image";
import React from "react";
import Community from "../assets/community.svg";
import moment from "moment";
import Members from "../assets/members.svg";
import Spinner from "@/components/Spinner";
import { FaTelegramPlane } from "react-icons/fa";

export default function ChatScreen({
  groupMembersLoading,
  groupMembers,
  chatsLoading,
  chats,
  onMessage,
  messageInput,
  setMessageInput,
  user,
  messagesEndRef,
}) {
  return (
    <div className="flex gap-4">
      <div className="w-1/3 bg-white rounded-xl">
        <div className="bg-primary rounded-xl px-8 py-2 text-white flex items-center gap-6">
          <Image src={Members} className="w-20" alt="members" />
          <div>
            <h2 className="text-xl font-mulish font-bold">Members</h2>
            {groupMembersLoading ? (
              <p>Loading...</p>
            ) : (
              <p>
                {`${groupMembers?.length} ${
                  groupMembers?.length < 2 ? "Member" : "Members"
                }`}
                {/* uniqueUsers.length - 1 to don't count current logged in user in total members/chats. */}
              </p>
            )}
          </div>
        </div>
        <div className="h-96 space-y-2 p-4 overflow-y-scroll ">
          {groupMembersLoading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            groupMembers
              ?.filter((i) => i.fullname !== " ")
              .map((member, i) => (
                <div key={i}>
                  <div
                    className={`gap-6 px-4 py-2 rounded-md bg-gray-100 cursor-pointer flex items-center justify-start`} // hide current logged in user from chat/member list.
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${member.image_url}`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="text-primary">{member.fullname}</h3>
                    </div>
                  </div>
                  {i !== groupMembers?.length - 2 && <hr />}
                </div>
              ))
          )}
        </div>
      </div>
      <div className="w-2/3 bg-white rounded-xl">
        <div className="bg-primary rounded-xl px-8 py-2 text-white flex items-center gap-6">
          <Image src={Community} alt="coummunity" className="w-20" />
        </div>
        <div className="h-96 relative">
          <div className="p-4 h-[80%]	 overflow-y-scroll space-y-2">
            {chatsLoading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : chats?.length === 0 ? (
              <p className="text-center">No chats</p>
            ) : (
              <ul className="messages space-y-2">
                {chats?.map((chat, index) => (
                  <li
                    key={index}
                    className={`flex items-start justify-start gap-2 ${
                      user?.id !== chat?.message_from_id
                        ? ""
                        : "flex-row-reverse"
                    }`}
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${chat?.image_url}`}
                      alt={chat?.message_from_fullname}
                      className="w-10 h-10 rounded-full"
                    />
                    <div
                      key={index}
                      className={`shadow-md p-[0.7rem] rounded-lg ${
                        chat?.role === "teacher"
                          ? "bg-emerald-500 text-white"
                          : user?.id !== chat?.message_from_id
                          ? ""
                          : "bg-primary text-white"
                      }`}
                    >
                      <div className="flex justify-between items-center capitalize gap-10">
                        <h3 className="text-xs font-bold">
                          ~{chat?.message_from_fullname}
                        </h3>
                        <p className="text-xs">{chat?.role}</p>
                      </div>
                      <p className="text-[12px]">{chat?.message}</p>
                      <span
                        className={`text-[10px] ${
                          chat?.role === "teacher"
                            ? "text-white"
                            : user?.id !== chat?.message_from_id
                            ? "text-gray-400"
                            : "text-white"
                        } font-semibold`}
                      >
                        {moment(chat?.created_at)
                          .startOf("minute")
                          .format("DD/MM/YY HH:mm A")}
                      </span>
                    </div>
                  </li>
                ))}
                <li ref={messagesEndRef} />
              </ul>
            )}
          </div>
          <form
            className="flex items-center gap-4 absolute bottom-4 w-full p-4"
            onSubmit={(e) => onMessage(e, messageInput)}
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Type your message?..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 inline-block w-full p-4 border border-gray-300 rounded-full outline-none"
              />
              <button
                type="submit"
                className="bg-primary text-white p-2 rounded-full absolute top-1/2 right-2.5 -translate-y-1/2 block"
              >
                <FaTelegramPlane
                  size={25}
                  // className="-translate-x-0.5 translate-y-0.5"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
