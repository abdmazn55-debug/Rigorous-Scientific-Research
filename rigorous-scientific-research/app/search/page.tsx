
import { Metadata } from 'next';
type Props = { searchParams: { q?: string; page?: string } };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata>{
  const q = searchParams.q||'scientific research';
  return { title: `${q} - Search 250M+ Papers | Rigorous Research`, description: `Find ${q} in 250M+ peer-reviewed papers with PDF download` };
}
export default async function SearchPage({ searchParams }: Props){
  const q = searchParams.q||''; const page = searchParams.page||'1';
  let papers: any[] = []; let total=0;
  if(q){ try{ const base = process.env.NEXT_PUBLIC_BASE||''; const res = await fetch(`${base}/api/search?q=${encodeURIComponent(q)}&page=${page}`, { cache:'no-store' }); if(res.ok){ const d=await res.json(); papers=d.papers; total=d.total; } }catch{} }
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-12 gap-6">
      <aside className="col-span-3 hidden md:block border rounded-xl p-4 h-fit">
        <h3 className="font-bold">Filters</h3><div className="mt-4 space-y-2 text-sm"><label className="flex gap-2"><input type="checkbox"/> Open Access only</label><label className="flex gap-2"><input type="checkbox"/> PDF Available</label></div>
      </aside>
      <section className="col-span-12 md:col-span-9">
        <h1 className="text-2xl font-bold">نتائج: {q} ({papers.length})</h1>
        <div className="mt-6 space-y-4">{papers.map((p:any)=>(
          <div key={p.id} className="border rounded-xl p-5 hover:shadow">
            <h2 className="font-bold text-lg"><a href={`/paper/${encodeURIComponent(p.id)}`}>{p.title}</a></h2>
            <p className="text-sm text-gray-600">{p.authors?.map((a:any)=>a.name).join(', ')} • {p.year} • {p.citations} citations • {p.source}</p>
            <p className="text-sm mt-2 line-clamp-2">{p.abstract||p.journal}</p>
            <div className="mt-3 flex gap-2">{p.pdfUrl && <a href={`/api/download?url=${encodeURIComponent(p.pdfUrl)}`} className="bg-green-600 text-white text-sm px-4 py-2 rounded">📄 تحميل PDF</a>}<a href={`/paper/${encodeURIComponent(p.id)}`} className="border text-sm px-4 py-2 rounded">التفاصيل</a></div>
          </div>
        ))}</div>
      </section>
    </div>
  );
}
