import { NextRequest, NextResponse } from 'next/server';
type Paper = { id:string; title:string; authors:{name:string}[]; abstract?:string; year?:number; citations?:number; doi?:string; pdfUrl?:string; source:string; isOpenAccess:boolean; journal?:string; fields?:string[]; url?:string; };
export const revalidate = 3600;

async function fetchOpenAlex(q:string, page:number): Promise<Paper[]>{
  try{
    const res = await fetch(`https://api.openalex.org/works?search=${encodeURIComponent(q)}&page=${page}&per-page=20&select=id,display_name,publication_year,authorships,primary_location,cited_by_count,doi`, { next:{ revalidate:3600 }});
    const data = await res.json();
    return (data.results||[]).map((w:any)=>({
      id: w.id, title: w.display_name, authors: (w.authorships||[]).map((a:any)=>({name:a.author?.display_name})), year: w.publication_year, citations: w.cited_by_count, doi: w.doi, pdfUrl: w.primary_location?.pdf_url||w.primary_location?.landing_page_url, source:'openalex', isOpenAccess: !!w.primary_location?.is_oa, journal: w.primary_location?.source?.display_name, fields:[], url: w.id
    }));
  }catch{return []}
}

async function fetchSemScholar(q:string, page:number): Promise<Paper[]>{
  try{
    const offset = (page-1)*20;
    const res = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(q)}&offset=${offset}&limit=20&fields=title,authors,year,citationCount,externalIds,openAccessPdf,venue`, { next:{ revalidate:3600 }});
    const data = await res.json();
    return (data.data||[]).map((p:any)=>({
      id: p.paperId||p.externalIds?.DOI||Math.random().toString(), title: p.title, authors: (p.authors||[]).map((a:any)=>({name:a.name})), year: p.year, citations: p.citationCount, doi: p.externalIds?.DOI, pdfUrl: p.openAccessPdf?.url, source:'semanticscholar', isOpenAccess: !!p.openAccessPdf, journal: p.venue, fields:[], url: `https://www.semanticscholar.org/paper/${p.paperId}`
    }));
  }catch{return []}
}

async function fetchArxiv(q:string): Promise<Paper[]>{
  try{
    const res = await fetch(`http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(q)}&start=0&max_results=20`);
    const text = await res.text();
    const titleRegex = /<title>([^<]+)<\/title>/g;
    const idRegex = /<id>([^<]+)<\/id>/g;
    const titles = Array.from(text.matchAll(titleRegex)).slice(1);
    const ids = Array.from(text.matchAll(idRegex)).slice(1);
    return titles.map((m,i)=>({ id: ids[i]?.[1]||m[1], title: m[1].replace(/\n/g,'').trim(), authors:[{name:'arXiv Authors'}], year: new Date().getFullYear(), citations:0, pdfUrl: ids[i]?.[1]?.replace('/abs/','/pdf/')+'.pdf', source:'arxiv', isOpenAccess:true, fields:[], url: ids[i]?.[1] }));
  }catch{return []}
}

export async function GET(req: NextRequest){
  const q = req.nextUrl.searchParams.get('q')||''; 
  const page = parseInt(req.nextUrl.searchParams.get('page')||'1');
  if(!q) return NextResponse.json({papers:[], total:0});
  const [a,b,c] = await Promise.allSettled([fetchOpenAlex(q,page), fetchSemScholar(q,page), fetchArxiv(q)]);
  let papers: Paper[] = [];
  if(a.status==='fulfilled') papers = papers.concat(a.value);
  if(b.status==='fulfilled') papers = papers.concat(b.value);
  if(c.status==='fulfilled') papers = papers.concat(c.value);
  const seen = new Set(); papers = papers.filter(p=>{ const k=p.title.toLowerCase().slice(0,40); if(seen.has(k)) return false; seen.add(k); return true; });
  papers.sort((x,y)=> (y.isOpenAccess?1:0)-(x.isOpenAccess?1:0) || (y.citations||0)-(x.citations||0));
  return NextResponse.json({ papers, total: 250000000, query: q, page });
}
