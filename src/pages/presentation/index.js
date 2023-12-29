import DocViewerApp from "@/components/DocViewerApp";
import { endpoints } from "@/utils/endpoints";
import getFileName from "@/utils/filename";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function PPT() {
  const [docs, setDocs] = useState([{}]);
  const router = useRouter();
  const { pptUrl } = router.query;

  useEffect(() => {
    const filename = getFileName(pptUrl);
    const docs = [
      {
        uri: `${process.env.NEXT_PUBLIC_API_URL}${endpoints.files.getFiles}?file_path=${filename}`,
        // uri: `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${path}`,
        filename: filename,
      },
    ];

    setDocs(docs);
  }, [pptUrl]);

  return (
    <div className="h-[600px]">
      <DocViewerApp docs={docs} />
    </div>
  );
}
