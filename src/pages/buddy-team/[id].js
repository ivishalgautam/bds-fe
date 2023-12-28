import Title from "@/components/Title";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "@/store/context";
import { FaTelegramPlane } from "react-icons/fa";
import toast from "react-hot-toast";
import moment from "moment";
import ReconnectingWebSocket from "reconnecting-websocket";
import ChatScreen from "@/components/ChatScreen";

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
      console.log("Connected");
    });

    return () => {
      socketRef.current.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
    return () => {
      // console.log("chat unmount 0");
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
      <Title text="Chat" />
      <ChatScreen
        groupMembersLoading={groupMembersLoading}
        groupMembers={groupMembers}
        chatsLoading={chatsLoading}
        chats={chats}
        onMessage={onMessage}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        user={user}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
}
