import React from "react";
import Logo from "../assets/logo.svg";
import Image from "next/image";
import Link from "next/link";

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-m space-y-6 flex flex-col items-center rounded-2xl">
        <Image src={Logo} />
        <h1 className="text-4xl font-bold">Unauthorized Access</h1>
        <p className="text-lg text-gray-700">
          Sorry, you are not authorized to access this page.
        </p>
        <Link href="/" className="bg-primary px-6 py-2 text-white rounded-full">
          GO BACK HOME
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
