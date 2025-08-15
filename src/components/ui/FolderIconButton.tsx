import React, { useState } from "react";

/**
 * Animated folder icon button (React, single-file, no external CSS required).
 * - Keeps only the folder/file icon and hover animation.
 * - Props:
 *    - size: base width of the icon in px (default 50)
 *    - className: extra classes for the <button>
 *    - title: accessible label / tooltip
 *    - onClick: click handler
 */
export default function FolderIconButton({
  size = 50,
  className = "",
  title = "Folder",
  onClick,
}) {
  const [hovered, setHovered] = useState(false);

  const filePageStyle = {
    transition: "transform 0.3s ease-out",
    transform: hovered ? "translateY(-5px)" : "none",
  };

  const fileFrontStyle = {
    transition: "transform 0.3s ease-out",
    transformOrigin: "bottom",
    // Use perspective to make rotateX visible
    transform: hovered ? "perspective(300px) rotateX(30deg)" : "none",
  };

  const containerStyle = {
    width: `${size}px`,
  };

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group inline-flex select-none items-center justify-center bg-transparent border-0 p-0 cursor-pointer active:scale-95 ${className}`}
      style={{ lineHeight: 0 }}
    >
      <span
        className="relative flex flex-col items-center justify-end"
        style={containerStyle}
      >
        {/* Back part of the folder */}
        <svg
          className="z-[1] w-[80%] h-auto"
          viewBox="0 0 146 113"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
        >
          <path
            d="M0 4C0 1.79086 1.79086 0 4 0H50.3802C51.8285 0 53.2056 0.627965 54.1553 1.72142L64.3303 13.4371C65.2799 14.5306 66.657 15.1585 68.1053 15.1585H141.509C143.718 15.1585 145.509 16.9494 145.509 19.1585V109C145.509 111.209 143.718 113 141.509 113H3.99999C1.79085 113 0 111.209 0 109V4Z"
            fill="url(#paint0_linear_117_4)"
          ></path>
          <defs>
            <linearGradient
              id="paint0_linear_117_4"
              x1="0"
              y1="0"
              x2="72.93"
              y2="95.4804"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8F88C2"></stop>
              <stop offset="1" stopColor="#5C52A2"></stop>
            </linearGradient>
          </defs>
        </svg>

        {/* Sliding page */}
        <svg
          className="absolute z-[2] w-1/2 h-auto"
          viewBox="0 0 88 99"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
          style={filePageStyle}
        >
          <rect width="88" height="99" fill="url(#paint0_linear_117_6)"></rect>
          <defs>
            <linearGradient
              id="paint0_linear_117_6"
              x1="0"
              y1="0"
              x2="81"
              y2="160.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white"></stop>
              <stop offset="1" stopColor="#686868"></stop>
            </linearGradient>
          </defs>
        </svg>

        {/* Front flap */}
        <svg
          className="absolute z-[3] w-[85%] h-auto opacity-95"
          viewBox="0 0 160 79"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
          style={fileFrontStyle}
        >
          <path
            d="M0.29306 12.2478C0.133905 9.38186 2.41499 6.97059 5.28537 6.97059H30.419H58.1902C59.5751 6.97059 60.9288 6.55982 62.0802 5.79025L68.977 1.18034C70.1283 0.410771 71.482 0 72.8669 0H77H155.462C157.87 0 159.733 2.1129 159.43 4.50232L150.443 75.5023C150.19 77.5013 148.489 79 146.474 79H7.78403C5.66106 79 3.9079 77.3415 3.79019 75.2218L0.29306 12.2478Z"
            fill="url(#paint0_linear_117_5)"
          ></path>
          <defs>
            <linearGradient
              id="paint0_linear_117_5"
              x1="38.7619"
              y1="8.71323"
              x2="66.9106"
              y2="82.8317"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#C3BBFF"></stop>
              <stop offset="1" stopColor="#51469A"></stop>
            </linearGradient>
          </defs>
        </svg>
      </span>
    </button>
  );
}
