import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

/** OG dinámico 1200×630 — Vercel Edge (@vercel/og). Ruta: /api/og */
export default async function handler() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#111232",
            color: "#DBEAEC",
            fontFamily: "monospace",
            padding: "56px",
            border: "12px solid #111232",
            boxShadow: "inset 0 0 0 4px #18BEC7",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "3px solid #FD1EB1",
              paddingBottom: "20px",
            }}
          >
            <span
              style={{ fontSize: "22px", color: "#DCF10B", fontWeight: 700 }}
            >
              SYS_STATUS: OPERATIONAL
            </span>
            <span style={{ fontSize: "20px", color: "#18BEC7" }}>
              portfolio v2
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flexGrow: 1,
              paddingTop: "24px",
            }}
          >
            <div
              style={{
                fontSize: "72px",
                fontWeight: 900,
                color: "#DBEAEC",
                lineHeight: 1,
                letterSpacing: "-2px",
              }}
            >
              JOSMARY PIRELA
            </div>
            <div
              style={{
                marginTop: "20px",
                fontSize: "28px",
                color: "#111232",
                backgroundColor: "#FD1EB1",
                padding: "12px 20px",
                alignSelf: "flex-start",
                fontWeight: 700,
              }}
            >
              Creative Full-Stack Developer · React · Vite
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "22px",
              color: "#18BEC7",
              borderTop: "2px solid #18BEC7",
              paddingTop: "18px",
            }}
          >
            <span>josmarypirela.dev</span>
            <span style={{ color: "#DCF10B" }}>2026</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("[api/og]", error);
    return new Response("Failed to generate Open Graph image", { status: 500 });
  }
}
