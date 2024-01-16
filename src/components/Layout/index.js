import React, { useContext, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Notes from "../../assets/notes.svg";
import Todo from "../../assets/todo.svg";
import Support from "../../assets/support.svg";
import { MainContext } from "@/store/context";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.clear();
  }
  Router.push("/login");
};

const features = [
  {
    label: "Notes",
    link: "/notes",
    icon: Notes,
  },
  {
    label: "To-Do List",
    link: "/todos",
    icon: Todo,
  },
  {
    label: "Support",
    link: "/support",
    icon: Support,
  },
];

const Layout = ({ children }) => {
  const { user } = useContext(MainContext);
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="relative overflow-hidden h-screen">
      <Navbar />
      <div className="flex h-full">
        <Sidebar />
        <div className="overflow-scroll w-full p-8 h-full bg-gray-100">
          <main>{children}</main>
        </div>
      </div>

      {user?.role === "student" && pathname !== "/" && (
        <>
          {!show && (
            <div
              className={`bg-primary absolute right-0 h-24 p-1 top-[48%] flex flex-col justify-center rounded-l-xl ease-in-out duration-300 ${
                !show ? "-translate-x-0" : "translate-x-full"
              }`}
              onClick={() => setShow(true)}
            >
              <FaChevronLeft className="text-white mx-auto cursor-pointer" />
            </div>
          )}
          <div
            className={`bg-primary absolute right-0 top-48 h-96 flex flex-col justify-center rounded-l-xl ease-in-out duration-300 ${
              show ? "-translate-x-0" : "translate-x-full"
            }`}
          >
            <div>
              {features.map((feature, i) => (
                <Link href={feature.link} key={i}>
                  <div className="py-4 px-2 text-white flex flex-col justify-center items-center space-y-2">
                    <Image
                      src={feature.icon}
                      alt={feature.label}
                      className="w-8"
                    />
                    <p className="text-xs">{feature.label}</p>
                  </div>
                </Link>
              ))}
              <div
                onClick={() => setShow(false)}
                className="py-4 px-2 text-white flex flex-col justify-center items-center space-y-2 cursor-pointer"
              >
                <FaChevronRight className="text-white mx-auto cursor-pointer w-full" />
                <p className="text-xs">Close</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
