import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import useLocalStorage from "@/utils/useLocalStorage";

function DocViewerApp({ docs }) {
  const [accessToken] = useLocalStorage("token");
  console.log({ docs });
  return (
    <DocViewer
      documents={docs}
      pluginRenderers={DocViewerRenderers}
      requestHeaders={{
        Authorization: `Bearer ${accessToken}`,
      }}
    />
  );
}

export default DocViewerApp;
