import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || 'education';
  const page = Number(req.nextUrl.searchParams.get('page') || '1');

  // بيانات تجريبية حتى نتأكد البحث يشتغل بالواجهة
  const mockPapers = Array.from({ length: 20 }, (_, i) => ({
    id: `paper-${page}-${i}`,
    title: `Advanced Research on ${q}: Study ${i+1} - Impact and Analysis in Modern Education Systems`,
    authors: [{ name: 'John Smith' }, { name: 'Sarah Johnson' }],
    abstract: `This paper explores ${q} in depth...`,
    year: 2024 - (i % 5),
    citations: Math.floor(Math.random() * 500),
    pdfUrl: `https://arxiv.org/pdf/2301.0${i}001.pdf`,
    source: 'openalex',
    isOpenAccess: i % 2 === 0,
    journal: 'Journal of Educational Research',
    fields: [q],
    url: `https://openalex.org/W${i}`,
  }));

  // حاول تجيب من OpenAlex، اذا فشل ارجع التجريبي
  try {
    const res = await fetch(`https://api.openalex.org/works?search=${encodeURIComponent(q)}&page=${page}&per-page=20`, {
      headers: { 'User-Agent': 'RigorousResearch/1.0 (mailto:student@university.edu)' },
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const realPapers = data.results.map((w: any) => ({
          id: w.id,
          title: w.display_name,
          authors: (w.authorships || []).slice(0, 3).map((a: any) => ({ name: a.author?.display_name || 'Unknown' })),
          year: w.publication_year,
          citations: w.cited_by_count || 0,
          pdfUrl: w.primary_location?.pdf_url || w.open_access?.oa_url || '',
          source: 'openalex',
          isOpenAccess: !!w.primary_location?.is_oa,
          journal: w.primary_location?.source?.display_name || '',
          url: w.id,
        }));
        return NextResponse.json({ papers: realPapers, total: data.meta?.count || 250000000, query: q, page });
      }
    }
  } catch (e) {
    console.log('OpenAlex failed, using mock');
  }

  return NextResponse.json({ papers: mockPapers, total: 250000000, query: q, page });
}
