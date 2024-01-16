import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AllRoutes } from "@/data/sidebarData";
import { MainContext } from "@/store/context";

export default function Sidebar() {
  const router = useRouter();
  const { pathname } = router;
  const { user } = useContext(MainContext);

  const userRole = user?.role;

  const filteredMenu = AllRoutes.filter(
    (item) =>
      !item.link.includes("/edit") &&
      !item.link.includes("/create") &&
      !item.link.includes("[id]") &&
      !item.link.includes("/upload") &&
      !item.link.includes("/notes") &&
      !item.link.includes("/todos") &&
      !item.link.includes("/[courseId]/[batchId]/[week]") &&
      !item.link.includes("/batches/quiz") &&
      !item.link.includes("/presentation")
  );

  // Determine the appropriate sidebar data based on the user's role
  let sidebarData = filteredMenu.filter((route) => {
    return route.roles.includes(userRole);
  });

  const renderIcon = (IconComponent) => {
    if (IconComponent) {
      return <IconComponent />;
    }
    return null;
  };

  const isLinkActive = (link) => {
    if (link === "/") {
      return pathname === "/";
    }
    return pathname.includes(link);
  };

  return (
    <div className="w-80 h-full bg-white shadow-md">
      <ul className="p-4 font-mulish font-bold text-base space-y-4">
        {sidebarData?.map((item) => (
          <li key={item.label}>
            <Link href={item.link}>
              <p
                className={`px-4 py-2 ${
                  isLinkActive(item.link)
                    ? "bg-primary text-white"
                    : "bg-transparent"
                } hover:bg-primary hover:text-white rounded-md cursor-pointer flex items-center gap-2`}
              >
                {renderIcon(item.icon)} {item.label}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
