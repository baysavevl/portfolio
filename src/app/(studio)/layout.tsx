import type {Metadata} from "next";
import type {ReactNode} from "react";

export const metadata: Metadata = {
  title: "Studio — Vincent Luu",
  robots: {
    index: false,
    follow: false
  }
};

export default function StudioRootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en">
      <body style={{margin: 0}}>{children}</body>
    </html>
  );
}
