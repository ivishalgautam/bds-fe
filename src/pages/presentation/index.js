import DocViewerApp from "@/components/DocViewerApp";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function PPT() {
  const [docs, setDocs] = useState([{}]);
  const router = useRouter();
  const { pptUrl } = router.query;

  useEffect(() => {
    const docs = [
      {
        uri: `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${pptUrl}`,
        // fileType: "ppt",
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
