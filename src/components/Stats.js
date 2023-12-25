import React, { useContext, useEffect, useState } from "react";
import Office from "../assets/office.svg";
import Image from "next/image";
import { MainContext } from "@/store/context";

export default function Stats({ data }) {
  const { user } = useContext(MainContext);

  const finalData =
    user?.role === "sub_franchisee" || user?.role === "teacher"
      ? data.slice(2)
      : user?.role !== "admin"
      ? data.slice(1)
      : data;

  return (
    <div
      className={`grid ${
        user?.role === "admin" ? "grid-cols-4" : "grid-cols-3"
      } gap-8`}
    >
      {finalData?.map((item, i) => (
        <div className="bg-white p-4 rounded-lg font-mulish" key={i}>
          <div className="flex gap-4 items-center">
            <div className={`${item.bg} p-3 rounded-full`}>
              <Image src={Office} alt="" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl text-primary font-bold">{item.title}</p>
              <p className="text-xs text-[#002277]">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
