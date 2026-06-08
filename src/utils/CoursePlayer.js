import React, { useEffect, useState } from "react";
import axios from "axios";

const CoursePlayer = ({ videoUrl,title }) => {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  useEffect(() => {
    axios
      .post(`https://back.kairaablockchainacademy.com/api/v1/getVdoCipherOTP`, {
        videoId: videoUrl,
      })
      .then((res) => {
        setVideoData(res.data);
      });
  }, [videoUrl]);

  return (
    <div   style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden" }}>
    {
        videoData.otp && videoData.playbackInfo !== "" && (
            <iframe src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData.playbackInfo}&player=ZtO7ZDTR6tLw2a3k`}
            style={{
                border:0,
                width:"100%",
                height:"100%",
                position:"absolute",
                top:0,
                left:0,
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
