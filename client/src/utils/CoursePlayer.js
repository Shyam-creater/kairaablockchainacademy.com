import React, { useEffect, useState } from "react";
import axios from "axios";

const CoursePlayer = ({ videoUrl, title, resumeTime = 0, onTimeUpdate }) => {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  useEffect(() => {
    if (videoUrl) {
      axios
        .post(`${process.env.REACT_APP_PUBLIC_SERVER_URI}/getVdoCipherOTP`, {
          videoId: videoUrl,
        })
        .then((res) => {
          setVideoData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching video OTP:", err);
        });
    }
  }, [videoUrl]);

  useEffect(() => {
    const handleMessage = (event) => {
      // VdoCipher occasionally broadcasts time or if we have an API wrapper
      // Standardize catching whatever we can from the iframe
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && (data.event === 'timeupdate' || data.type === 'timeupdate')) {
          if (onTimeUpdate) {
            onTimeUpdate(data.time || data.currentTime, data.duration || 0);
          }
        }
      } catch (e) {
        // Ignore JSON parse errors for non-JSON messages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onTimeUpdate]);

  return (
    <div style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden" }}>
      {
        videoData.otp && videoData.playbackInfo !== "" && (
          <iframe src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData.playbackInfo}&player=ZtO7ZDTR6tLw2a3k&time=${resumeTime}`}
            style={{
              border: 0,
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            allowFullScreen="true"
            allow="encrypted-media">

          </iframe>
        )
      }
    </div>
  );
};

export default CoursePlayer;
