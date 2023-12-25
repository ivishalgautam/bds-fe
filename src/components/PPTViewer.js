export default function PdfViewerComponent({ embedUrl }) {
  //   let url = `https://docs.google.com/gview?url=${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${embedUrl}&embedded=true`;
  let url = `https://docs.google.com/gview?url=${"https://magnitecorp.com/ppt/slides.pptx"}&embedded=true`;

  return (
    <div>
      <div style={{ width: "100%", height: "600px" }}>
        <iframe
          src={url}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
