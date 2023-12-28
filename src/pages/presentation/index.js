import DocViewerApp from "@/components/DocViewerApp";
import PdfViewerComponent from "@/components/PPTViewer";
import getFileName from "@/utils/filename";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";

export default function PPT() {
  const [docs, setDocs] = useState([{}]);
  const router = useRouter();
  const { pptUrl } = router.query;

  useEffect(() => {
    const docs = [
      {
        uri: `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${pptUrl}`,
        fileType: "ppt",
      },
    ];

    setDocs(docs);
  }, [pptUrl]);

  useEffect(() => {
    // Get the iframe element
    // const iframe = document.getElementsByTagName("iframe");

    // // Get the iframe's document
    // const iframeDocument = iframe.contentWindow.document;

    // Get the element inside the iframe by its ID
    const iframeElement = document.getElementById(
      "ChromelessStatusBar.RightDock"
    );
    console.log({ iframeElement });
    // Style the element
    // iframeElement.style.color = "red";
    // iframeElement.style.backgroundColor = "yellow";
  }, []);

  const openDoc = (path) => {};

  return (
    <div className="h-[600px]">
      {/* <PdfViewerComponent embedUrl={pptUrl} /> */}
      <DocViewerApp docs={docs} />
    </div>
  );
}
