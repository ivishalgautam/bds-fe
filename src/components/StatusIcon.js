import React from "react";

const StatusIcon = ({ connected }) => {
  return <i className={`icon ${connected ? "connected" : ""}`}></i>;
};

export default StatusIcon;
