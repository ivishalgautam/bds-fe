import moment from "moment";
import { useEffect, useState } from "react";
import { capitalize } from "@/utils/utils";
import Table from "./Table";

export default function CourseEnquiryTable({
  data: courseEnquiryData,
  isLoading,
}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(courseEnquiryData);
  }, []);

  function handleSearch(e) {
    const inputValue = e.target.value.toLowerCase();
    const filtered = courseEnquiryData?.filter(
      (item) =>
        item?.username?.toLowerCase().includes(inputValue) ||
        item?.email?.toLowerCase().includes(inputValue) ||
        item?.course_name?.toLowerCase().includes(inputValue) ||
        item?.mobile_number?.includes(inputValue)
    );
    setData(filtered);
  }

  const columns = [
    {
      name: "Course Name",
      selector: (row, key) => capitalize(row.course_name),
    },
    {
      name: "Enquiry by (username)",
      selector: (row) => row.username,
    },
    {
      name: "Enquiry by (email)",
      selector: (row) => row.email,
    },
    {
      name: "Enquiry by (phone)",
      selector: (row) => capitalize(row.mobile_number),
    },
    {
      name: "Enquiry date",
      selector: (row) => moment(row.created_at).format("DD-MM-YYYY"),
    },
  ];

  return (
    <>
      <div className="mb-4 flex justify-between">
        <div>
          <div className="relative">
            <input
              type="text"
              onChange={(e) => handleSearch(e)}
              placeholder="Search"
              name="search"
              className="rounded shadow px-3 py-2 outline-primary"
            />
          </div>
        </div>
      </div>
      <div className="rounded-lg overflow-hidden">
        <Table
          columns={columns}
          data={data}
          pagination
          progressPending={isLoading}
        />
      </div>
    </>
  );
}
