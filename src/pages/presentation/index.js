import DocViewerApp from "@/components/DocViewerApp";
import { endpoints } from "@/utils/endpoints";
import getFileName from "@/utils/filename";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

export default function PPT() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef();
  const [docs, setDocs] = useState([{}]);
  const router = useRouter();
  const { pptUrl } = router.query;

  useEffect(() => {
    const filename = getFileName(pptUrl);
    const docs = [
      {
        uri: `${process.env.NEXT_PUBLIC_API_URL}${endpoints.files.getFiles}?file_path=${filename}`,
        filename: filename,
      },
    ];

    setDocs(docs);
  }, [pptUrl]);

  function requestFullscreen(element, state) {
    if (state === "fullscreen") {
      if (!element.fullscreenElement) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
          setIsFullscreen(true);
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
          setIsFullscreen(true);
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen(element.ALLOW_KEYBOARD_INPUT);
          setIsFullscreen(true);
        }
      }
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }
  return (
    <div className="h-[600px] relative" ref={containerRef}>
      <div className="text-center mb-10 absolute top-2 right-2 z-10">
        {isFullscreen ? (
          <button
            className="bg-primary px-4 py-2 rounded-lg text-white"
            onClick={() => requestFullscreen(containerRef.current)}
          >
            Exit Fullscreen
          </button>
        ) : (
          <button
            className="bg-primary px-4 py-2 rounded-lg text-white"
            onClick={() =>
              requestFullscreen(containerRef.current, "fullscreen")
            }
          >
            Go Fullscreen
          </button>
        )}
      </div>
      <DocViewerApp docs={docs} />
    </div>
  );
}
