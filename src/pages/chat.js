import Title from "@/components/Title";
import React, { useContext, useEffect, useRef, useState } from "react";
import Members from "../assets/members.svg";
import Community from "../assets/community.svg";
import Avatar from "../assets/avatar.svg";
import Image from "next/image";
import { MainContext } from "@/store/context";
import useLocalStorage from "@/utils/useLocalStorage";
import { useFetchChat } from "@/hooks/useFetchChat";
import Spinner from "@/components/Spinner";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";

const fetchChat = () => {
  return http().get(endpoints.chat);
};

function getTransformedChat(onlineUsers, chatData) {
  const transformedData = [];

  // Create a map for quick lookup of chats by ID
  const chatMap = new Map(chatData.map((chat) => [chat.id, chat]));

  // Add users from chatData that are not in onlineUsers
  for (const chat of chatData) {
    if (!onlineUsers.some((user) => user.userID === chat.id)) {
      const transformedUser = {
        userID: chat.id,
        username: chat.name,
        connected: false, // Set to false if not in onlineUsers
        self: false, // Set to false if not in onlineUsers
        messages: [],
        hasNewMessages: false, // Set to false if not in onlineUsers
        imageUrl: chat.image_icon,
        isGroupChat: chat.type === "group", // Determine group chat based on type
        type: chat.type, // Add the type property
      };

      transformedData.push(transformedUser);
    }
  }

  return transformedData;
}

function Chat() {
  const [token] = useLocalStorage("token");
  const { user } = useContext(MainContext);
  // const { data, isLoading, isError } = useFetchChat();

  const {
    isLoading,
    isError,
    data: chat,
    error,
  } = useQuery({
    queryKey: ["chat"],
    queryFn: fetchChat,
  });

  const [users, setUsers] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);

  const displaySender = (message, index) => {
    return (
      index === 0 ||
      selectedUser.messages[index - 1]?.fromSelf !== message.fromSelf
    );
  };

  useEffect(() => {
    console.log("chat update 2", selectedUser);
    const initReactiveProperties = (user) => {
      user.messages = [];
      user.hasNewMessages = false;
    };

    if (users?.length === 0 && chat) {
      const transformedChats = getTransformedChat([], chat);
      setUsers(transformedChats);
    }
  }, [selectedUser, chat]);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
    return () => {
      console.log("chat unmount 0");
    };
  }, []);

  const onMessage = (e, content) => {
    e.preventDefault();
  };

  const onSelectUser = (user) => {
    setSelectedUser(user);
    user.hasNewMessages = false;
  };

  const uniqueUsers = Array.from(
    new Set(users?.map((item) => item.userID))
  ).map((userID) => users?.find((item) => item.userID === userID));
  // if (isLoading)
  //   return (
  //     <div className="flex justify-center">
  //       <Spinner />
  //     </div>
  //   );

  // if (isError) {
  //   return <h1>Error</h1>;
  // }

  return (
    <div className="space-y-6">
      <Title text="Community Chat" />
      <div className="flex gap-4">
        <div className="w-1/3 bg-white rounded-xl">
          <div className="bg-primary rounded-xl px-8 py-2 text-white flex items-center gap-6">
            <Image src={Members} className="w-20" />
            <div>
              <h2 className="text-xl font-mulish font-bold">Members</h2>
              <p>
                {uniqueUsers?.length > 1 ? uniqueUsers.length - 1 : 0} Members{" "}
                {/* uniqueUsers.length - 1 to don't count current logged in user in total members/chats. */}
              </p>
            </div>
          </div>
          <div className="h-96 space-y-4 p-4 overflow-y-scroll">
            {uniqueUsers?.map((member, i) => (
              <div
                key={i}
                onClick={() => onSelectUser(member)}
                className={`gap-6 member-bg px-4 py-2 rounded-full cursor-pointer ${
                  member?.userID === user?.id ? "hidden" : "flex"
                }`} // hide current logged in user from chat/member list.
              >
                <div className="relative">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <Image
                      src={member.isGroupChat ? Community : Avatar}
                      alt={member.username}
                      className="w-12"
                    />
                  )}
                  {!member.isGroupChat && (
                    <span
                      className={`w-3 h-3 rounded-full border-2 border-white absolute bottom-1 right-0 z-10 ${
                        member.connected ? "bg-green-500" : "bg-slate-300"
                      }`}
                    ></span>
                  )}
                </div>
                <div>
                  <h3 className="text-primary">{member.username}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-2/3 bg-white rounded-xl">
          <div className="bg-primary rounded-xl px-8 py-2 text-white flex items-center gap-6">
            <Image src={Community} alt="coummunity" className="w-20" />
            <div>
              <h2 className="text-xl font-mulish font-bold">
                {selectedUser?.username}
              </h2>
              {/* <p>{members.length} Members | 02 Teachers</p> */}
            </div>
          </div>
          <div className="h-96 relative">
            <div className="p-4 h-[80%]	 overflow-y-scroll space-y-2">
              <ul className="messages">
                {selectedUser?.messages?.map((message, index) =>
                  message.fromSelf ? (
                    <div className="chat chat-end" key={`chat-${index}`}>
                      <div class="chat-image avatar">
                        <div class="w-10 rounded-full">
                          <Image src={Avatar} alt="Avatar" />
                        </div>
                      </div>

                      <div className="chat-bubble chat-bubble-success text-white break-all">
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <div className="chat chat-start" key={`chat-${index}`}>
                      <div class="chat-image avatar">
                        <div class="w-10 rounded-full">
                          <Image src={Avatar} alt="Avatar" />
                        </div>
                      </div>
                      <div className="chat-bubble bg-slate500 text-white break-all">
                        {message.content}
                      </div>
                    </div>
                  )
                )}
              </ul>
              {/* {messages.map((message, index) => (
                <div key={index} className="shadow-md p-4">
                  <div className="flex justify-between items-center capitalize">
                    <Title text={user.username} />
                    <p>{user.role}</p>
                  </div>
                  <span>{message.timestamp}</span>
                  <p>{message.text}</p>
                </div>
              ))} */}
              <div ref={messagesEndRef} />
            </div>
            <form
              className="flex items-center gap-4 absolute bottom-4 w-full p-4"
              onSubmit={(e) => onMessage(e)}
            >
              <input
                type="text"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 inline-block w-full p-4 border border-gray-300 rounded-md outline-none"
              />
              <button
                type="submit"
                className="bg-primary text-white px-8 py-2 rounded-full block"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
