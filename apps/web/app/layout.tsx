export const metadata = {
  title: 'Events Platform',
  description: 'AI-powered events platform with OBS/RTMP',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Events Platform</h1>
            <nav style={{ display: 'flex', gap: 16 }}>
              <a href="/">Dashboard</a>
              <a href="/events/new">New Event</a>
              <a href="/obs">OBS Setup</a>
            </nav>
          </header>
          <main style={{ marginTop: 24 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
