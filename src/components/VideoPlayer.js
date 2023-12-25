import React from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

const VideoPlayer = ({ videoUrl }) => {
  return (
    <div>
      <Plyr
        source={{
          type: "video",
          sources: [
            {
              src: videoUrl,
              type: "video/mp4",
            },
          ],
        }}
        options={{
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "captions",
            "settings",
            "pip",
            "airplay",
            "fullscreen",
            "quality",
          ],
          settings: ["captions", "quality", "speed"],
        }}
      />
    </div>
  );
};

export default VideoPlayer;
