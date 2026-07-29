import React, { useEffect, useRef, useState } from "react";

const YouTubePlayer = ({ videoUrl, resumeTime = 0, onTimeUpdate }) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const extractVideoId = (url) => {
    if (!url) return null;
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1]?.split("?")[0];
    if (url.includes("youtube.com/watch?v=")) return url.split("v=")[1]?.split("&")[0];
    if (url.includes("youtube.com/embed/")) return url.split("embed/")[1]?.split("?")[0];
    if (url.includes("youtube.com/shorts/")) return url.split("shorts/")[1]?.split("?")[0];
    // If it's just a raw ID without a domain, return it directly
    if (!url.includes("http") && url.length === 11) return url;
    return url;
  };

  useEffect(() => {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) return;

    const loadPlayer = () => {
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          start: Math.floor(resumeTime),
          enablejsapi: 1,
        },
        events: {
          onReady: (event) => {
            setIsReady(true);
            if (resumeTime > 0) {
              event.target.seekTo(resumeTime);
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              intervalRef.current = setInterval(() => {
                if (playerRef.current && playerRef.current.getCurrentTime) {
                  const currentTime = playerRef.current.getCurrentTime();
                  const duration = playerRef.current.getDuration ? playerRef.current.getDuration() : 0;
                  if (onTimeUpdate) onTimeUpdate(currentTime, duration);
                }
              }, 1000);
            } else {
              clearInterval(intervalRef.current);
            }
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = loadPlayer;
    } else {
      loadPlayer();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoUrl]); // Intentionally omitting resumeTime and onTimeUpdate to prevent re-renders

  return (
    <div style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden" }}>
      <div
        ref={containerRef}
        style={{
          border: 0,
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
};

export default YouTubePlayer;
