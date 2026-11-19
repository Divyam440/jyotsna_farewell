import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import { Shantell_Sans } from 'next/font/google';

const shantell = Shantell_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-shantell',
});

export const metadata = {
  title: "Something Just for You!",
  description: "A little surprise made just for you, open it with a smile ❤️",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={shantell.variable} suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}