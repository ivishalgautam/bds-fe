import Title from "@/components/Title";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import Members from "../../assets/members.svg";
import Community from "../../assets/community.svg";
import { MainContext } from "@/store/context";
import Spinner from "@/components/Spinner";
import { FaTelegramPlane } from "react-icons/fa";
import toast from "react-hot-toast";
import moment from "moment";
import ReconnectingWebSocket from "reconnecting-websocket";

const postMessage = async ({ message, message_from, group_id }) => {
  return await http().post(endpoints.chats, {
    message: message,
    message_from: message_from,
    group_id: group_id,
  });
};

export default function Chat() {
  const [chats, setChats] = useState([]);
  const { user } = useContext(MainContext);
  const [messageInput, setMessageInput] = useState("");
  const socketRef = useRef();
  const router = useRouter();
  const { id: group_chat_id } = router.query;
  const messagesEndRef = useRef(null);

  const fetchChats = async () => {
    return await http().get(`${endpoints.chats}/${group_chat_id}`);
  };

  const fetchGroupMembers = async () => {
    return await http().get(
      `${endpoints.groups.getAll}/group-members/${group_chat_id}`
    );
  };

  const { data: fetchedChats, isLoading: chatsLoading } = useQuery({
    queryKey: ["fetchChats"],
    queryFn: fetchChats,
    enabled: !!group_chat_id,
  });

  const { data: groupMembers, isLoading: groupMembersLoading } = useQuery({
    queryKey: ["fetchGroupMembers"],
    queryFn: fetchGroupMembers,
    enabled: !!group_chat_id,
  });

  // console.log({ groupMembers });

  const { mutate } = useMutation(postMessage, {
    onSuccess: () => {
      console.log("message sent");
    },
    onError: () => {
      toast.error("Unable to send message!");
    },
  });

  const onMessage = (e, content) => {
    e.preventDefault();

    mutate({
      message: content,
      message_from: user?.id,
      group_id: group_chat_id,
    });

    socketRef.current.send(
      JSON.stringify({
        event: "message",
        group_id: group_chat_id,
        user: user,
        message: content,
      })
    );

    setMessageInput("");
  };

  useEffect(() => {
    // socketRef.current = new ReconnectingWebSocket("ws://localhost:3001");
    socketRef.current = new ReconnectingWebSocket(
      process.env.NEXT_PUBLIC_SOCKET_URL
    );

    socketRef.current.addEventListener("open", (event) => {
      console.log("WebSocket connected!", event);
    });

    socketRef.current.addEventListener("message", (event) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.group_chat_id === group_chat_id) {
        setChats((prev) => [...prev, parsedData]);
      }
    });

    socketRef.current.addEventListener("close", () => {
      console.log("WebSocket closed");
    });

    return () => {
      socketRef.current.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
    return () => {
      console.log("chat unmount 0");
    };
  }, [chats]);

  useEffect(() => {
    if (fetchedChats && fetchedChats.length > 0) {
      setChats(fetchedChats);
      // console.log(fetchedChats);
    }
  }, [fetchedChats]);

  return (
    <div className="space-y-6">
      <Title text="Community Chat" />
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
                  <>
                    <div
                      key={i}
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
                  </>
                ))
            )}
          </div>
        </div>
        <div className="w-2/3 bg-white rounded-xl">
          <div className="bg-primary rounded-xl px-8 py-2 text-white flex items-center gap-6">
            <Image src={Community} alt="coummunity" className="w-20" />
            <div>
              <h2 className="text-xl font-mulish font-bold">
                {/* {selectedUser?.username} */}
              </h2>
              {/* <p>{members.length} Members | 02 Teachers</p> */}
            </div>
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
    </div>
  );
}
