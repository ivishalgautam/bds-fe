import { useEffect, useRef } from "react";

export default function PdfViewerComponent({ embedUrl }) {
  // const iframeRef = useRef(null);
  // useEffect(() => {
  //   const iframe = iframeRef.current;
  //   const iframeDocument =
  //     iframe.contentDocument || iframe.contentWindow.document;
  //   const element = iframeDocument.querySelector(".ndfHFb-c4YZDc-Wrql6b");
  //   console.log(iframe);
  //   // element.style.display = "none";
  // }, []);
  //   let url = `https://docs.google.com/gview?url=${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${embedUrl}&embedded=true`;
  let url = `https://docs.google.com/gview?url=${"https://magnitecorp.com/ppt/slides.pptx"}&embedded=true`;

  return (
    <div>
      <div style={{ width: "100%", height: "600px" }}>
        <iframe
          // ref={iframeRef}
          src={url}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          className="ppt-iframe"
          sandbox="allow-same-origin allow-scripts allow-popups"
        ></iframe>
      </div>
    </div>
  );
}
