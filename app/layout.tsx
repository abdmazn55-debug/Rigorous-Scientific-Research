
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Rigorous Scientific Research - Search 250M+ Peer-Reviewed Papers | PDF Download",
  description: "Search over 250 million rigorous peer-reviewed papers from OpenAlex, Semantic Scholar, PubMed, arXiv, CORE. Free PDF download, advanced filters, SEO optimized.",
  keywords: ["scientific research","peer reviewed","250M papers","PDF download","OpenAlex","Semantic Scholar","PubMed","arXiv"],
  openGraph: { title: "Rigorous Scientific Research - 250M+ Papers", description: "Search 250M+ papers", type: "website" },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="ltr">
      <body className="bg-white text-gray-900 antialiased">
        <header className="border-b sticky top-0 bg-white/80 backdrop-blur z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <a href="/" className="font-bold text-xl">📚 Rigorous Research</a>
            <nav className="flex gap-4 text-sm">
              <a href="/search">Search</a><a href="/categories">Categories</a><a href="/trending">Trending</a><a href="/about">About</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t mt-20 py-10 text-center text-sm text-gray-500">© 2026 Rigorous Scientific Research - 250M+ papers indexed</footer>
      </body>
    </html>
  );
}
