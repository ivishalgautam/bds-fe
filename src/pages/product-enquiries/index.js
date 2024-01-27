import Spinner from "@/components/Spinner";
import ProductEnquiryTable from "@/components/ui/table/ProductEnquiry";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React from "react";

async function fetchProductEnquiries() {
  return await http().get(`${endpoints.products.getAll}/enquiry`);
}

export default function ProductEnquiries() {
  const { data, isLoading } = useQuery({
    queryKey: ["product-enquiries"],
    queryFn: fetchProductEnquiries,
  });

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className="relative shadow-md sm:rounded-lg"
      // onMouseLeave={() => setShow(false)}
    >
      <ProductEnquiryTable data={data} />
    </div>
  );
}
