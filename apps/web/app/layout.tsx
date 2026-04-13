import Providers from "../components/Providers";
import NavBar from "../components/NavBar";

export const metadata = {
  title: "Events Platform",
  description: "Webinar platform with OBS/RTMP streaming",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <Providers>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
            <NavBar />
            <main style={{ marginTop: 24 }}>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
