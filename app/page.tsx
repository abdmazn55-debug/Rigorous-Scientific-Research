export const dynamic = 'force-dynamic';
import Link from 'next/link';

const DICT: any = {
  'الاقتصاد': 'economics', 'اقتصاد': 'economics',
  'الطب': 'medicine', 'الهندسة': 'engineering',
  'حاسوب': 'computer science', 'ذكاء اصطناعي': 'artificial intelligence'
};
function translate(q: string) {
  const t = q.trim();
  if (!t) return 'economics';
  if (/[\u0600-\u06FF]/.test(t)) return DICT[t] || DICT[t.replace('ال','')] || 'economics';
  return t;
}

export default async function SearchPage({ searchParams }: any) {
  const s = searchParams?.q ? searchParams : await searchParams;
  const originalQ = decodeURIComponent((s?.q || '').toString()).trim();
  const currentPage = parseInt((s?.page || '1').toString());
  const searchTerm = translate(originalQ);

  let papers: any[] = [];
  let total = 0;
  const perPage = 20;

  if (originalQ) {
    const url = `https://api.openalex.org/works?search=${encodeURIComponent(searchTerm)}&page=${currentPage}&per-page=${perPage}&select=id,display_name,publication_year,authorships,cited_by_count,primary_location,open_access,doi`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    papers = data.results || [];
    total = data.meta?.count || 0;
  }

  const totalPages = Math.min(Math.ceil(total / perPage), 50); // نعرض أول 50 صفحة فقط

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold">نتائج: {originalQ} ({searchTerm}) ({total}) - صفحة {currentPage}</h1>

      <div className="flex gap-8 mt-8">
        <div className="w-56 shrink-0">
          <h3 className="font-bold mb-4">Filters</h3>
          <label className="flex gap-2 text-sm mb-2"><input type="checkbox" /> Open Access only</label>
          <label className="flex gap-2 text-sm"><input type="checkbox" /> PDF Available</label>
        </div>

        <div className="flex-1">
          <div className="space-y-4">
            {papers.map((p: any) => {
              const pdfUrl = p.primary_location?.pdf_url || p.open_access?.oa_url;
              return (
                <div key={p.id} className="border rounded-xl p-5 bg-white hover:shadow">
                  <div className="font-bold text-">{p.display_name}</div>
                  <div className="text-xs text-gray-500 mt-1">{p.publication_year} - {p.cited_by_count} citations</div>
                  {pdfUrl && <a href={pdfUrl} target="_blank" className="inline-block mt-3 text-xs bg-blue-600 text-white px-4 py-1.5 rounded-full font-bold">تحميل PDF</a>}
                </div>
              );
            })}
          </div>

          {/* أرقام الصفحات */}
          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
            {currentPage > 1 && (
              <Link href={`/search?q=${encodeURIComponent(originalQ)}&page=${currentPage - 1}`} className="px-4 py-2 border rounded-lg text-sm">السابق</Link>
            )}
            
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === currentPage;
              return (
                <Link
                  key={pageNum}
                  href={`/search?q=${encodeURIComponent(originalQ)}&page=${pageNum}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold ${isActive ? 'bg-blue-600 text-white' : 'border bg-white hover:bg-gray-50'}`}
                >
                  {pageNum}
                </Link>
              );
            })}

            {totalPages > 10 && <span className="px-2">...</span>}

            {currentPage < totalPages && (
              <Link href={`/search?q=${encodeURIComponent(originalQ)}&page=${currentPage + 1}`} className="px-4 py-2 border rounded-lg text-sm">التالي</Link>
            )}
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">صفحة {currentPage} من {totalPages} - {total} بحث</p>
        </div>
      </div>
    </div>
  );
}
