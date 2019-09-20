import React from "react";
import { Layout } from "../variables";
import Loading from "./Loading";

export default function Content({ loading, data }) {
  if (loading) {
    return <Loading />;
  }

  return (
    <div className={`${Layout.content} docs-content`}>
      <div>
        <pre>{data}</pre>
      </div>
    </div>
  );
}
