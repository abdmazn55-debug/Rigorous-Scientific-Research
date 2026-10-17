export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: any) {
  // Next 14 و 15 يختلف، هذا يشتغل مع الاثنين
  const params = searchParams?.q ? searchParams : await searchParams;
  const originalQ = (params?.q || '').toString();
  const decodedQ = decodeURIComponent(originalQ).trim();

  const DICT: any = {
    'الاقتصاد': 'economics', 'اقتصاد': 'economics',
    'الطب': 'medicine', 'الهندسة': 'engineering',
    'حاسوب': 'computer science', 'ذكاء اصطناعي': 'artificial intelligence'
  };

  let searchTerm = decodedQ;
  if (/[\u0600-\u06FF]/.test(decodedQ)) {
    searchTerm = DICT[decodedQ] || DICT[decodedQ.replace('ال','')] || 'economics';
  }
  if (!searchTerm) searchTerm = 'economics';

  let papers: any[] = [];
  let total = 0;

  try {
    const apiUrl = `https://api.openalex.org/works?search=${encodeURIComponent(searchTerm)}&per-page=20`;
    const res = await fetch(apiUrl, { cache: 'no-store' });
    const data = await res.json();
    papers = data.results || [];
    total = data.meta?.count || 0;
  } catch {}

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold">
        نتائج: {decodedQ} {decodedQ !== searchTerm ? `(${searchTerm})` : ''} ({total})
      </h1>
      <p className="text-xs text-gray-400 mt-2">بحث فعلي بـ: {searchTerm}</p>
      
      <div className="mt-8 space-y-4">
        {papers.map((p:any)=>(
          <div key={p.id} className="border p-4 rounded-xl">
            <div className="font-bold">{p.display_name}</div>
            <div className="text-sm text-gray-500">{p.publication_year} - {p.cited_by_count} citations</div>
          </div>
        ))}
      </div>
    </div>
  );
}
