import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "感情の科学 ── 状態遷移ネットワーク",
  description: "人間が経験する感情の場面・プロセス・状態遷移をノードとエッジのネットワーク図で探索する教育・研修ツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
