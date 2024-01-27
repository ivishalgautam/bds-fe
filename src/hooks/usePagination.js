import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function usePagination({ data, perPage }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [totalPages, setTotalPages] = useState(0);
  const [resultsPerPage] = useState(perPage ?? 3);
  const [resultsToShow, setResultsToShow] = useState(null);
  const startIndex = (parseInt(params.get("page") ?? 1) - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;

  useEffect(() => {
    setResultsToShow(data);
  }, [data]);

  useEffect(() => {
    const tp = Math.ceil(resultsToShow?.length / resultsPerPage);
    setTotalPages(tp);
  }, [resultsToShow]);

  return {
    params,
    pathname,
    router,
    totalPages,
    resultsToShow,
    setResultsToShow,
    startIndex,
    endIndex,
  };
}
