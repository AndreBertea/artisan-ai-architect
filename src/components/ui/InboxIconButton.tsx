import React, { useState } from "react";

/**
 * Circular Inbox button (React), styled similar to PhoneIconButton for consistency.
 * - Props:
 *    - size: diameter of the button in px (default 50)
 *    - bgColor / hoverColor: background colors
 *    - iconColor: SVG path fill color
 *    - onClick: click handler
 *    - title: accessible label
 */
export default function InboxIconButton({
  size = 50,
  bgColor = "#464646",
  hoverColor = "#5a5a5a",
  iconColor = "#fff",
  onClick,
  title = "Inbox",
  className = "",
}: {
  size?: number;
  bgColor?: string;
  hoverColor?: string;
  iconColor?: string;
  onClick?: (e: any) => void;
  title?: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);

  const style = {
    width: size,
    height: size,
    borderRadius: "50%",
    border: bgColor === "transparent" ? "2px solid #3B82F6" : "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    backgroundColor: hovered ? hoverColor : bgColor,
    boxShadow: "0px 0px 20px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease-in-out",
  };

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`inline-flex select-none ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={style}
    >
      <svg
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        width={size * 0.34}
        height={size * 0.34}
        role="img"
        aria-hidden="true"
      >
        <path
          fill={iconColor}
          d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
        ></path>
      </svg>
    </button>
  );
}
