import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fleet Radar Engine — Real-Time Telematics & Dynamic Route Optimization',
  description:
    'Scalable telemetry and radar visualization for moving vehicle fleets with dynamic waypoint tracking, battery monitoring, and fuel optimization telemetry.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        {children}
      </body>
    </html>
  );
}
