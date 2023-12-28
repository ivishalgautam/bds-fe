export default function PdfViewerComponent({ embedUrl }) {
  let url = `https://docs.google.com/gview?url=${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${embedUrl}&embedded=true`;
  // let url =
  //   "https://docs.google.com/presentation/d/e/2PACX-1vTY2xx5XS6rAvJn1hmv64bPRmnWFpoCgfuBvYfAaI80EjrUGVRy9xzMb5qS3OoqcA/embed?start=false&loop=false&delayms=3000&pli=1#slide=id.p5";
  console.log(url);
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
