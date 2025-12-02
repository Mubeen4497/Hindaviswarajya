import React, { useState } from "react";

interface LogoProps {
  className?: string;
}

const LOCAL_LOGO = "/logo.png";
const FALLBACK_LOGO =
  "https://instasize.com/api/image/e459683b3f4860c40e457aeea26a8381f94f6989fae5cfc82a7a412da73cef6e.png";

export default function Logo({ className = "" }: LogoProps) {
  const [src, setSrc] = useState(LOCAL_LOGO);

  return (
    <div className={`group-parent ${className}`}>
      <img
        className="group-child"
        src={src}
        onError={() => {
          if (src !== FALLBACK_LOGO) setSrc(FALLBACK_LOGO);
        }}
        alt="HindaviSwarajya logo"
      />
      <div className="group-item"></div>
      <div className="group-inner"></div>
      <div className="ellipse-div"></div>
      <div className="group-child2"></div>
      <div className="rectangle-div"></div>
      <div className="group-child3"></div>
      <div className="group-child4"></div>
      <div className="group-child5"></div>
    </div>
  );
}
