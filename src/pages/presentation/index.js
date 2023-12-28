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
    // Get all iframes in the document
    var iframes =
      typeof document !== "undefined" && document.querySelectorAll("iframe");

    // Loop through each iframe
    iframes.forEach(function (iframe) {
      // Get the content document of the iframe
      var iframeDocument =
        iframe.contentDocument || iframe.contentWindow.document;

      // Find the element with class "mce-content-body" inside the iframe content
      var element = iframeDocument.querySelector(
        "#ChromelessStatusBar.RightDock"
      );

      // Set its HTML content to the response (assuming response is a string containing HTML)
      if (element) {
        element.style.display = "none";
      }
    });
  }, []);

  return (
    <div className="h-[600px]">
      {/* <PdfViewerComponent embedUrl={pptUrl} /> */}
      <DocViewerApp docs={docs} />
    </div>
  );
}
