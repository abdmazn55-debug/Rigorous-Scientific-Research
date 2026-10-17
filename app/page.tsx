export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: any) {
  const params = await searchParams;
  const originalQ = decodeURIComponent((params?.q || '').toString());
  const page = parseInt(params?.page || '1');
  
  const DICT: any = {'الاقتصاد':'economics','اقتصاد':'economics'};
  let term = originalQ.trim();
  if (/[\u0600-\u06FF]/.test(term)) term = DICT[term] || 'economics';
  if (!term) term = 'economics';

  let papers: any[] = [];
  let total = 0;

  try {
    const res = await fetch(
      `https://api.openalex.org/works?search=${encodeURIComponent(term)}&page=${page}&per-page=20`,
      {
        headers: { 'User-Agent': 'RigorousResearch/1.0 (mailto:test@test.com)' },
        cache: 'no-store'
      }
    );
    const data = await res.json();
    papers = data.results || [];
    total = data.meta?.count || 0;
  } catch (e) {
    total = 0;
  }

  const totalPages = Math.min(Math.ceil(total / 20), 20);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="font-bold text-xl">نتائج: {originalQ} ({term}) ({total}) - صفحة {page}</h1>
      
      <div className="flex gap-8 mt-6">
        <div className="w-56">
          <h3 className="font-bold">Filters</h3>
          <div className="text-sm mt-2"><input type="checkbox"/> Open Access only</div>
          <div className="text-sm mt-2"><input type="checkbox"/> PDF Available</div>
        </div>

        <div className="flex-1">
          {papers.map((p:any)=>(
            <div key={p.id} className="border rounded-xl p-4 mb-3 bg-white">
              <div className="font-bold">{p.display_name}</div>
              <div className="text-xs text-gray-500">{p.publication_year} - {p.cited_by_count} citations</div>
              {p.primary_location?.pdf_url && <a href={p.primary_location.pdf_url} target="_blank" className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full mt-2 inline-block">تحميل PDF</a>}
            </div>
          ))}

          <div className="flex gap-2 justify-center mt-8 flex-wrap">
            {Array.from({length: totalPages > 10 ? 10 : totalPages}, (_,i)=>{
              const n = i+1;
              return <a key={n} href={`/search?q=${encodeURIComponent(originalQ)}&page=${n}`} className={`w-8 h-8 flex items-center justify-center border rounded ${n===page ? 'bg-blue-600 text-white' : 'bg-white'}`}>{n}</a>
            })}
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">صفحة {page} من {totalPages}</p>
        </div>
      </div>
    </div>
  );
}
