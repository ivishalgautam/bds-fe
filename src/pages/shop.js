import ShopCard from "@/components/Cards/ShopCard";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import useLocalStorage from "@/utils/useLocalStorage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";

const fetchShops = () => {
  return http().get(endpoints.products.getAll);
};

export default function Shop() {
  const queryClient = useQueryClient();
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["shop"],
    queryFn: fetchShops,
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [token] = useLocalStorage("token");

  const handleEnquiryProduct = async (product_id) => {
    try {
      const resp = await axios.post(
        `${baseUrl}${endpoints.products.getAll}/enquiry/${product_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resp.statusText === "OK") {
        toast.success(resp.data.message);
        queryClient.invalidateQueries("shop");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to enquire!");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );

  if (isError) return <h2>{error?.message}</h2>;
  console.log(data);
  return (
    <div className="space-y-6">
      <Title text="Shop" />
      <div className="grid grid-cols-3 gap-4">
        {data.map((item) => (
          <ShopCard
            key={item.id}
            id={item.id}
            title={item.title}
            shortDescription={item.short_description}
            thumbnail={item.thumbnail}
            is_queried={item.is_queried}
            handleEnquiryProduct={handleEnquiryProduct}
          />
        ))}
      </div>
    </div>
  );
}
