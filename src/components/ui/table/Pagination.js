import React from "react";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";

export default function Pagination({
  params,
  router,
  pathname,
  resultsToShow,
  endIndex,
  totalPages,
}) {
  return (
    <div className="pagination flex items-center justify-center mt-10 text-white p-4 gap-3 absolute bottom-2 left-1/2 -translate-x-[78px]">
      <button
        onClick={() =>
          router.push(
            `${pathname}?page=${parseInt(params.get("page") ?? 1) - 1}`,
            undefined,
            { shallow: true, exact: true }
          )
        }
        disabled={parseInt(params.get("page") ?? 1) === 1}
        className={`flex items-center justify-cente px-4 py-2 pr-5 rounded-md ${
          parseInt(params.get("page") ?? 1) === 1
            ? "cursor-not-allowed bg-gray-400"
            : "cursor-pointer bg-primary"
        }`}
      >
        <MdSkipPrevious size={25} className="text-white" />
        <span>Previous</span>
      </button>
      <div className="bg-white text-primary border border-primary px-4 py-2 rounded-md">
        <span>Page {params.get("page") ?? 1}</span>
        {/* Display total pages if needed */}
        <span> of {totalPages}</span>
      </div>
      <button
        onClick={() =>
          router.push(
            `${pathname}?page=${parseInt(params.get("page") ?? 1) + 1}`,
            undefined,
            { shallow: true, exact: true }
          )
        }
        disabled={endIndex >= resultsToShow?.length}
        className={`flex items-center justify-center px-4 py-2 pl-5 rounded-md ${
          endIndex >= resultsToShow?.length
            ? "cursor-not-allowed bg-gray-400"
            : "cursor-pointer bg-primary"
        }
    `}
      >
        <span>Next</span>
        <MdSkipNext size={25} fill="#fff" className="text-white" />
      </button>
    </div>
  );
}
