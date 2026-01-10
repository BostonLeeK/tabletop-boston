import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Каталог настільних ігор',
  description: 'Колекція настільних ігор з рейтингами та описами',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}


