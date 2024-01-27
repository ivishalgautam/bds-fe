import Link from "next/link";
import { useFetchLeads } from "@/hooks/useFetchLeads";
import moment from "moment";
import { useEffect, useState } from "react";
import { capitalize } from "@/utils/utils";
import { FaPen } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import Table from "./Table";

export default function LeadsTable({
  handleUpdate,
  leads,
  isLoading,
  setLeadId,
  openModal,
  setType,
  user,
}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(leads);
  }, [leads]);

  function handleSearch(e) {
    const inputValue = e.target.value.toLowerCase();
    const filtered = leads?.filter(
      (item) =>
        item.fullname.toLowerCase().includes(inputValue) ||
        item.email.toLowerCase().includes(inputValue) ||
        item.franchisee_name.toLowerCase().includes(inputValue) ||
        item.course_name.toLowerCase().includes(inputValue) ||
        item.phone.includes(inputValue)
    );
    setData(filtered);
  }

  const columns = [
    {
      name: "Fullname",
      selector: (row, key) => capitalize(row.fullname),
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Franchisee",
      selector: (row) => capitalize(row.franchisee_name),
    },
    {
      name: "Course",
      selector: (row) => capitalize(row.course_name),
    },
    {
      name: "Date",
      selector: (row) => moment(row.created_at).format("DD-MM-YYYY"),
    },
    {
      name: "Actions",
      selector: (row) => (
        <div className="space-x-2">
          {user?.role === "sub_franchisee" && (
            <button
              onClick={() => {
                setLeadId(row.id);
                setType("edit");
                openModal();
              }}
              className="bg-primary group p-2 rounded hover:brightness-90 transition-all border space-x-2"
            >
              <FaPen size={20} className="text-white" />
            </button>
          )}
          <button
            onClick={() => {
              setLeadId(row.id);
              setType("view");
              openModal();
            }}
            className="bg-primary group p-2 rounded hover:brightness-90 transition-all border space-x-2"
          >
            <IoEyeOutline size={20} className="text-white" />
          </button>
        </div>
      ),
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
