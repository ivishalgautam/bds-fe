import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React from "react";

async function fetchCourseEnquiries() {
  return await http().get(`${endpoints.courses.getAll}/enquiry`);
}

export default function CourseEnquiries() {
  const { data } = useQuery({
    queryKey: ["course-enquiries"],
    queryFn: fetchCourseEnquiries,
  });

  console.log({ data });

  return (
    <div>
      <div
        className="relative shadow-md sm:rounded-lg"
        // onMouseLeave={() => setShow(false)}
      >
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Course Name
              </th>
              <th scope="col" className="px-6 py-3">
                Enquiry by (username)
              </th>
              <th scope="col" className="px-6 py-3">
                Enquiry by (email)
              </th>
              <th scope="col" className="px-6 py-3">
                Enquiry by (phone)
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Enquiry date
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr
                className="bg-white dark:border-gray-700"
                key={`${index}${item.id}`}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap"
                >
                  {item.course_name}
                </th>
                <td className="px-6 py-4 text-gray-700">{item.username}</td>
                <td className="px-6 py-4 text-gray-700">{item.email}</td>
                <td className="px-6 py-4 text-gray-700">
                  {item.mobile_number}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {item.is_assigned === true ? "Assigned" : "Not assigned"}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {moment(item.created_at).format("DD-MM-YYYY")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
