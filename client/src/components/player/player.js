import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import io from "socket.io-client";
import "video.js/dist/video-js.css";
import "@videojs/themes/dist/fantasy/index.css";

let socket;

export default () => {
  const playerRef = useRef();

  if (!socket) {
    socket = io(":3001");
  }

  useEffect(() => {
    const options = {
      controls: "control",
      autoplay: false,
      muted: false,
      preload: "auto",
      width: "400",
      height: "225",
    };
    const player = videojs(playerRef.current, options, () => {
      player.src("/video.mp4");

      player.on("timeupdate", () => {
        if (player.paused()) {
          socket.emit("pause");
        }

        if (!player.paused()) {
          socket.emit("play");
        }
        if (player.seeking()) {
          socket.emit("move", player.currentTime());
        }
        socket.on("play", () => {
          if (player.paused()) {
            player.play();
          } else {
            return;
          }
        });
        socket.on("pause", () => {
          player.pause();
        });
        socket.on("move", (value) => {
          player.currentTime(value);
        });
      });
    });

    return () => {
      player.dispose();
    };
  }, []);

  return (
    <div
      style={{
        margin: "2% auto",
        padding: "2%",
      }}
    >
      <video ref={playerRef} className="video-js vjs-theme-fantasy" />
    </div>
  );
};
