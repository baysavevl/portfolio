import {useId, type CSSProperties} from "react";

interface SilhouetteArtProps {
  reveal: number;
  accessibleName: string;
}

export function SilhouetteArt({
  reveal,
  accessibleName
}: SilhouetteArtProps) {
  const clipId = `observer-reveal-${useId().replaceAll(":", "")}`;
  const normalizedReveal = Math.min(100, Math.max(0, reveal));
  const revealStyle = {
    "--reveal": `${normalizedReveal}%`
  } as CSSProperties;

  return (
    <svg
      role="img"
      aria-label={accessibleName}
      viewBox="0 0 720 720"
      className="silhouette-art"
      style={revealStyle}
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <rect
            x="0"
            y="0"
            height="720"
            className="silhouette-art__reveal-mask"
          />
        </clipPath>
      </defs>

      <g className="silhouette-art__operator" aria-hidden="true">
        <path
          className="silhouette-art__orbit"
          d="M72 350C72 177 201 54 367 54c144 0 254 84 286 210"
        />
        <circle cx="352" cy="208" r="98" className="silhouette-art__head" />
        <path
          className="silhouette-art__body"
          d="M112 650c18-165 104-286 240-286s222 121 240 286H112Z"
        />
        <path
          className="silhouette-art__operator-line"
          d="M174 555h98l46-64 79 54 62-102 89 66"
        />
        <path
          className="silhouette-art__operator-line"
          d="M235 429v174M352 402v218M476 422v181"
        />
        <circle cx="272" cy="555" r="10" className="silhouette-art__node" />
        <circle cx="318" cy="491" r="10" className="silhouette-art__node" />
        <circle cx="397" cy="545" r="10" className="silhouette-art__node" />
        <circle cx="459" cy="443" r="10" className="silhouette-art__node" />
        <path
          className="silhouette-art__face-mark"
          d="M294 216c28-18 75-18 108 0M321 262c20 13 42 13 63 0"
        />
      </g>

      <g
        clipPath={`url(#${clipId})`}
        className="silhouette-art__observer"
        aria-hidden="true"
      >
        <rect width="720" height="720" className="silhouette-art__observer-field" />
        <circle cx="352" cy="208" r="98" className="silhouette-art__observer-head" />
        <path
          className="silhouette-art__observer-body"
          d="M112 650c18-165 104-286 240-286s222 121 240 286H112Z"
        />
        <circle cx="352" cy="242" r="151" className="silhouette-art__breath-ring" />
        <circle cx="352" cy="242" r="196" className="silhouette-art__breath-ring silhouette-art__breath-ring--quiet" />
        <path
          className="silhouette-art__track"
          d="M96 606c126-74 250-65 345-19 73 36 131 34 194-7"
        />
        <path
          className="silhouette-art__track silhouette-art__track--inner"
          d="M123 641c120-65 229-52 309-14 70 34 126 36 181 8"
        />
        <path
          className="silhouette-art__hand-mark"
          d="M221 466c25-24 47-17 55 7 9 27 32 31 59 1 25-28 54-19 63 11 8 26 34 32 59 4"
        />
        <path
          className="silhouette-art__hand-mark silhouette-art__hand-mark--small"
          d="M266 521c18-13 32-10 44 8 12 17 28 17 48-1 18-17 38-14 55 5"
        />
        <path
          className="silhouette-art__observer-face"
          d="M299 216c29-22 72-22 106 0M320 265c22 15 45 15 67 0"
        />
      </g>

      <rect
        y="38"
        width="3"
        height="642"
        x={normalizedReveal * 7.2}
        className="silhouette-art__boundary"
        aria-hidden="true"
      />
    </svg>
  );
}
