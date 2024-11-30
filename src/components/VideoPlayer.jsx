import videojs from "video.js";
import Hls from "hls.js";
import "video.js/dist/video-js.css";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    playerRef.current = videojs(videoRef.current, {
      controls: true,
      autoplay: true,
      muted: true,
      preload: "auto",
    });

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          toast.error("Network issue detected, retrying...");
          setTimeout(() => hls.loadSource(src), 3000);
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          toast.error("Media error occurred, attempting recovery.");
          hls.recoverMediaError();
        }
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src;
      videoRef.current.addEventListener("canPlay", () => {
        videoRef.current.play();
      });
    } else {
      console.log("Video format not supported");
      toast.error("Video format not suppported");
    }
  }, [src]);

  return (
    <div>
      <div data-vjs-player>
        <video
          ref={videoRef}
          style={{
            width: "100%",
            height: "500px",
          }}
          className="video-js vjs-control-bar"
        ></video>
      </div>
    </div>
  );
};

export default VideoPlayer;
