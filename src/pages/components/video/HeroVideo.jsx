import React from "react";
import "./HeroVideo.css";

const HeroVideo = () => {
  return (
    <div className="video-container">
      <iframe
        src="https://player.cloudinary.com/embed/?cloud_name=dvcd7qmif&public_id=WM_WEB_m9464y&profile=cld-default&loop=true"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        frameBorder="0"
        title="Cloudinary Hero Video"
      ></iframe>
    </div>
  );
};

export default HeroVideo;
