export default function PdfViewerComponent({ embedUrl }) {
  let url = `https://docs.google.com/gview?url=${embedUrl}&embedded=true`;

  return (
    <div>
      <div style={{ width: "100%", height: "600px" }}>
        <iframe
          src={url}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          className="ppt-iframe"
        ></iframe>
      </div>
    </div>
  );
}
