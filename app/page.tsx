import Link from 'next/link';

const DICT: Record<string, string> = {
  'الاقتصاد': 'economics',
  'اقتصاد': 'economics',
  'الطب': 'medicine',
  'طب': 'medicine',
  'الهندسة': 'engineering',
  'هندسة': 'engineering',
  'حاسوب': 'computer science',
  'برمجة': 'computer science',
  'ذكاء اصطناعي': 'artificial intelligence',
  'فيزياء': 'physics',
  'كيمياء': 'chemistry',
  'بيولوجيا': 'biology',
};

function translateQuery(q: string) {
  const trimmed = q.trim();
  if (/[\u0600-\u06FF]/.test(trimmed)) {
    // اذا الكلمة موجودة بالقاموس
    if (DICT[trimmed]) return DICT[trimmed];
    if (DICT[trimmed.replace('ال','')]) return DICT[trimmed.replace('ال','')];
    // اذا جملة عربية، ابحث عن كلمة مفتاحية داخلها
    for (const key in DICT) {
      if (trimmed.includes(key)) return DICT[key];
    }
    return 'economics'; // fallback اذا ما عرفناها
  }
  return trimmed;
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const originalQ = searchParams.q || '';
  const searchTerm = translateQuery(originalQ);
  
  let papers: any[] = [];
  let total = 0;

  if (originalQ) {
    try {
      const res = await fetch(
        `https://api.openalex.org/works?search=${encodeURIComponent(searchTerm)}&per-page=20&select=id,display_name,publication_year,authorships,cited_by_count,primary_location`,
        { cache: 'no-store' }
      );
      const data = await res.json();
      papers = data.results || [];
      total = data.meta?.count || 0;
    } catch (e) {
      papers = [];
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold">
        نتائج: {originalQ} {originalQ !== searchTerm && `(${searchTerm})`} ({total > 10000 ? '250M+' : total})
      </h1>
      
      {originalQ !== searchTerm && (
        <p className="text-sm text-gray-500 mt-2">تمت ترجمة بحثك من "{originalQ}" إلى "{searchTerm}"</p>
      )}

      <div className="flex gap-10 mt-8">
        <div className="w-48">
          <h3 className="font-bold mb-3">Filters</h3>
          <label className="flex gap-2 text-sm"><input type="checkbox" /> Open Access only</label>
          <label className="flex gap-2 text-sm mt-2"><input type="checkbox" /> PDF Available</label>
        </div>

        <div className="flex-1 space-y-4">
          {papers.length === 0 ? (
            <p className="text-gray-500">لا توجد نتائج. جرب كلمة أخرى.</p>
          ) : (
            papers.map((p: any) => (
              <div key={p.id} className="border rounded-xl p-5 hover:shadow">
                <Link href={p.id} className="font-bold text-blue-700 hover:underline">
                  {p.display_name}
                </Link>
                <p className="text-sm text-gray-600 mt-1">
                  {p.authorships?.slice(0,3).map((a:any)=>a.author.display_name).join(', ')} • {p.publication_year} • {p.cited_by_count} citations
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
