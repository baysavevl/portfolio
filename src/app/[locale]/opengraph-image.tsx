import {ImageResponse} from "next/og";
import {isLocale} from "@/i18n/locale";

export const alt = "Vincent Luu — The Mindful Builder";
export const size = {width: 1200, height: 630};
export const contentType = "image/png";

export default async function OpenGraphImage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale: candidate} = await params;
  const locale = isLocale(candidate) ? candidate : "en";
  const localeLabel = locale === "vi" ? "TIẾNG VIỆT" : "ENGLISH";

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        padding: "68px 76px",
        overflow: "hidden",
        background: "#f6f8f5",
        color: "#101820",
        fontFamily: "sans-serif"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "62%"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.06em"
          }}
        >
          <span>VINCENT LUU</span>
          <span style={{color: "#2855f5"}}>/</span>
          <span style={{color: "#69757f"}}>{localeLabel}</span>
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: "18px"}}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 82,
              fontWeight: 700,
              letterSpacing: "-0.065em",
              lineHeight: 0.92
            }}
          >
            <div style={{display: "flex"}}>The Mindful</div>
            <div style={{display: "flex"}}>Builder</div>
          </div>
          <div style={{display: "flex", color: "#69757f", fontSize: 25}}>
            Products · Teams · Ideas · Attention
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          right: 0,
          width: 455,
          height: 630,
          background: "#b8c8be"
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: 112,
          top: 88,
          width: 190,
          height: 190,
          borderRadius: 999,
          background: "#101820"
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: 53,
          bottom: -130,
          width: 310,
          height: 430,
          borderRadius: "160px 160px 30px 30px",
          background: "#101820"
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: 58,
          top: 56,
          width: 298,
          height: 298,
          border: "8px solid #2855f5",
          borderRadius: 999
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: 350,
          bottom: 65,
          width: 12,
          height: 150,
          background: "#2855f5"
        }}
      />
    </div>,
    size
  );
}
