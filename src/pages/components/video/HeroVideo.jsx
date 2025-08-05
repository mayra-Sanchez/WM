import React from "react";
import "./HeroVideo.css";

const HeroVideo = () => {
  return (
    <div className="video-container">
      <video
        src="/assets/hero.mp4"
        autoPlay
        loop
        playsInline
        controls={false}
      />
    </div>
  );
};

export default HeroVideo;
