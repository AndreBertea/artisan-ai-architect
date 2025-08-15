import React, { useState } from "react";

/**
 * User Icon Button – React component
 * Circular button with user icon and hover effects
 * - Props:
 *    - size: diameter of the button in px (default 50)
 *    - bgColor / hoverColor: background colors
 *    - iconColor: SVG path fill color
 *    - onClick: click handler
 *    - title: accessible label
 *    - userInitials: user initials to display
 */
export default function UserIconButton({
  size = 50,
  bgColor = "#F59E0B",
  hoverColor = "#D97706",
  iconColor = "#fff",
  onClick,
  title = "User",
  className = "",
  userInitials = "U",
}: {
  size?: number;
  bgColor?: string;
  hoverColor?: string;
  iconColor?: string;
  onClick?: (e: any) => void;
  title?: string;
  className?: string;
  userInitials?: string;
}) {
  const [hovered, setHovered] = useState(false);

  const style = {
    width: size,
    height: size,
    borderRadius: "50%",
    border: bgColor === "transparent" ? "2px solid #F59E0B" : "2px solid transparent",
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
      {bgColor === "transparent" ? (
        // Icône utilisateur pour fond transparent
        <svg
          viewBox="0 0 24 24"
          width={size * 0.4}
          height={size * 0.4}
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-hidden="true"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ) : (
        // Initiales pour fond coloré
        <span
          style={{
            color: iconColor,
            fontSize: `${size * 0.4}px`,
            fontWeight: "bold",
            lineHeight: 1,
          }}
        >
          {userInitials}
        </span>
      )}
    </button>
  );
}
