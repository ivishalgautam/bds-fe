import React from "react";

export default function ProfileCard({ user }) {
  console.log(user);
  return (
    <div className="p-4">
      <div>
        <img
          src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${user?.image_url}`}
          alt={user?.first_name}
          className="w-40 h-40 mx-auto object-cover object-center rounded-full"
        />
        <div className="text-center text-xl font-bold capitalize mt-2">
          {user?.first_name} {user?.last_name}
        </div>
        <div className="text-center text-gray-500">@{user?.username}</div>
      </div>
    </div>
  );
}
