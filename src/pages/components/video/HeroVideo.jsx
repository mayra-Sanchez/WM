import React from "react";
import "./HeroVideo.css";

const HeroVideo = () => {
  return (
    <div className="video-container">
      <iframe
        src="https://www.youtube.com/embed/KA44sobuBwA?autoplay=1&loop=1&rel=0&modestbranding=1&playlist=KA44sobuBwA&controls=0&showinfo=0&vq=hd1080&mute=1"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default HeroVideo;
