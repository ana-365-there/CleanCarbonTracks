import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Service Scheduling Engine — Multi-Role On-Demand Booking & Dispatch Infrastructure',
  description:
    'End-to-end appointment lifecycle management: customer booking portal, incident ticketing desk, operations dispatch queue, and mobile field worker checklist.',
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
