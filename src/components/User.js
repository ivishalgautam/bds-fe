import React from "react";
import StatusIcon from "./StatusIcon";

const User = ({ user, selected, onSelect }) => {
  const onClick = () => {
    onSelect();
  };

  const status = user.connected ? "online" : "offline";

  return (
    <div className={`user ${selected ? "selected" : ""}`} onClick={onClick}>
      <div className="description">
        <div className="name">
          {user.username} {user.self ? " (yourself)" : ""}
        </div>
        <div className="status">
          <StatusIcon connected={user.connected} />
          {status}
        </div>
      </div>
      {user.hasNewMessages && <div className="new-messages">!</div>}
    </div>
  );
};

export default User;
