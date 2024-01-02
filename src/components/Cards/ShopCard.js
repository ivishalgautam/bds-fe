import Image from "next/image";
import React from "react";
import ShopImg from "../../assets/shop.svg";

export default function ShopCard({
  id,
  title,
  shortDescription,
  thumbnail,
  handleEnquiryProduct,
  is_queried,
}) {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <img
        src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${thumbnail || ShopImg}`}
        className="w-full aspect-video bg-cover"
      />
      <div className="p-4 space-y-2">
        <div className="flex justify-between">
          <p className="font-bold">{title}</p>
        </div>
        <p className="text-base">{shortDescription}</p>
        <div className="flex justify-between">
          {!is_queried ? (
            <button
              className="bg-primary py-2 px-6 text-white rounded-md"
              onClick={() => handleEnquiryProduct(id)}
            >
              Enquire now
            </button>
          ) : (
            <button className="bg-primary py-2 px-6 text-white rounded-md">
              Enquiry sent
            </button>
          )}
          {/* <button className="text-primary font-bold">View Product</button> */}
        </div>
      </div>
    </div>
  );
}
