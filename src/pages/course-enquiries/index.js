import Spinner from "@/components/Spinner";
import CourseEnquiryTable from "@/components/ui/table/CourseEnquiry";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import React from "react";

async function fetchCourseEnquiries() {
  return await http().get(`${endpoints.courses.getAll}/enquiry`);
}

export default function CourseEnquiries() {
  const { data, isLoading } = useQuery({
    queryKey: ["course-enquiries"],
    queryFn: fetchCourseEnquiries,
  });

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="relative shadow-md sm:rounded-lg">
      <CourseEnquiryTable data={data} />
    </div>
  );
}
