export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: any){
  const params = await searchParams;
  const qRaw = (params?.q || '').toString();
  const page = parseInt(params?.page || '1');
  const q = decodeURIComponent(qRaw).trim();

  const DICT: any = { 'الاقتصاد':'economics','اقتصاد':'economics','الطب':'medicine','الهندسة':'engineering','حاسوب':'computer science' };
  let term = q;
  if(/[\u0600-\u06FF]/.test(q)) term = DICT[q] || DICT[q.replace('ال','')] || 'economics';
  if(!term) term = 'economics';

  let papers: any[] = []; let total=0;
  try{
    const url = `https://api.openalex.org/works?search=${encodeURIComponent(term)}&page=${page}&per-page=20`;
    const res = await fetch(url, { headers: { 'User-Agent': 'RigorousResearch/1.0' }, cache: 'no-store' });
    const data = await res.json();
    papers = data.results || [];
    total = data.meta?.count || 0;
  }catch{ total=0; }

  const totalPages = Math.min(Math.ceil(total/20), 20);

  return(
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold">نتائج: {q} ({term}) ({total})</h1>
      <div className="mt-6 space-y-4">
        {papers.map((p:any)=>(
          <div key={p.id} className="border rounded-xl p-5 bg-white hover:shadow">
            <h2 className="font-bold text-lg">{p.display_name}</h2>
            <p className="text-sm text-gray-600 mt-1">{p.publication_year} • {p.cited_by_count} citations • {p.primary_location?.source?.display_name}</p>
            {(p.primary_location?.pdf_url || p.open_access?.oa_url) && <a href={p.primary_location?.pdf_url || p.open_access?.oa_url} target="_blank" className="mt-3 inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-full font-bold">📄 تحميل PDF</a>}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-10 flex-wrap">
        {Array.from({length: totalPages>10?10:totalPages}, (_,i)=>{
          const n=i+1; return <a key={n} href={`/search?q=${encodeURIComponent(q)}&page=${n}`} className={`w-9 h-9 flex items-center justify-center border rounded-lg text-sm ${n===page?'bg-blue-600 text-white':'bg-white'}`}>{n}</a>
        })}
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">صفحة {page} من {totalPages}</p>
    </div>
  );
}
