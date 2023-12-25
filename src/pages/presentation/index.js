import PdfViewerComponent from "@/components/PPTViewer";
import { useRouter } from "next/router";
import React from "react";

export default function PPT() {
  const router = useRouter();

  const { pptUrl } = router.query;

  return (
    <div>
      <PdfViewerComponent embedUrl={pptUrl} />
    </div>
  );
}
