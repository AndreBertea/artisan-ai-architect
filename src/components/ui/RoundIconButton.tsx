import React, { useState } from "react";

/**
 * RoundIconButton – React component
 * Style-uniform with FolderIconButton (no external CSS).
 * - Circular button with hover + active feedback
 * - Defaults to a phone (call) icon; you can pass your own icon via children
 *
 * Props
 *  - size: number (px) – overall diameter (default 60)
 *  - bg: string – background color (default "#30C04F")
 *  - hoverBg: string – hover background color (default "#2bac47")
 *  - title: string – accessible label / tooltip
 *  - className: string – extra classes for the <button>
 *  - onClick: function – click handler
 *  - children: ReactNode – optional custom icon to render inside
 */
export default function RoundIconButton({
  size = 60,
  bg = "#30C04F",
  hoverBg = "#2bac47",
  title = "Call",
  className = "",
  onClick,
  children,
}: {
  size?: number;
  bg?: string;
  hoverBg?: string;
  title?: string;
  className?: string;
  onClick?: (e: any) => void;
  children?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  const styles = {
    button: {
      width: size,
      height: size,
      borderRadius: 9999,
      border: bg === "transparent" ? "2px solid #30C04F" : 0,
      padding: 0,
      background: hovered ? hoverBg : bg,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 0,
      transition: "transform 0.15s ease-out, background-color 0.2s ease-out",
    },
    focus: {
      outline: "none",
      boxShadow: "0 0 0 3px rgba(59,130,246,0.45)", // focus-visible ring
    },
  };

  const iconSize = Math.round(size * 0.53); // ~32px when size=60

  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={(e) => {
        // provide active feedback
        e.currentTarget.style.transform = "scale(0.95)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "none";
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.currentTarget.style.transform = "scale(0.95)";
        }
      }}
      onKeyUp={(e) => {
        e.currentTarget.style.transform = "none";
      }}
      className={`inline-flex select-none ${className}`}
      style={styles.button}
      onFocus={(e) => Object.assign(e.currentTarget.style, styles.focus)}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children ?? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={iconSize}
          height={iconSize}
          viewBox="0 0 32 32"
          fill="none"
          className="svg-icon"
          role="img"
          aria-hidden="true"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            stroke="#fff"
            fillRule="evenodd"
            clipRule="evenodd"
            d="m24.8868 19.1288c-1.0274-.1308-2.036-.3815-3.0052-.7467-.7878-.29-1.6724-.1034-2.276.48-.797.8075-2.0493.9936-2.9664.3258-1.4484-1.055-2.7233-2.3295-3.7783-3.7776-.6681-.9168-.4819-2.1691.3255-2.9659.5728-.6019.7584-1.4748.4802-2.2577-.3987-.98875-.6792-2.02109-.8358-3.07557-.2043-1.03534-1.1138-1.7807-2.1694-1.77778h-3.18289c-.60654-.00074-1.18614.25037-1.60035.69334-.40152.44503-.59539 1.03943-.53345 1.63555.344 3.31056 1.47164 6.49166 3.28961 9.27986 1.64878 2.5904 3.84608 4.7872 6.43688 6.4356 2.7927 1.797 5.9636 2.9227 9.2644 3.289h.1778c.5409.0036 1.0626-.2 1.4581-.569.444-.406.6957-.9806.6935-1.5822v-3.1821c.0429-1.0763-.7171-2.0185-1.7782-2.2046z"
          />
        </svg>
      )}
    </button>
  );
}
