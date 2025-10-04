import "./globals.css";

export const metadata = {
  title: "SaveUP — Tabungan Harian",
  description: "Monitor dan capai target finansialmu sedikit demi sedikit."
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
