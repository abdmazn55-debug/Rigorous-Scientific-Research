import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

const DICT: any = { 'الاقتصاد':'economics','اقتصاد':'economics','الطب':'medicine','الهندسة':'engineering' };

export async function GET(req: NextRequest){
  const qRaw = req.nextUrl.searchParams.get('q') || '';
  const page = req.nextUrl.searchParams.get('page') || '1';
  let term = decodeURIComponent(qRaw).trim();
  if(/[\u0600-\u06FF]/.test(term)) term = DICT[term] || DICT[term.replace('ال','')] || 'economics';
  if(!term) term='economics';
  try{
    const url=`https://api.openalex.org/works?search=${encodeURIComponent(term)}&page=${page}&per-page=20`;
    const r=await fetch(url,{headers:{'User-Agent':'RigorousResearch/1.0'},cache:'no-store'});
    const data=await r.json();
    const papers=(data.results||[]).map((p:any)=>({id:p.id,title:p.display_name,year:p.publication_year,citations:p.cited_by_count,source:p.primary_location?.source?.display_name,pdfUrl:p.primary_location?.pdf_url||p.open_access?.oa_url}));
    return NextResponse.json({papers,total:data.meta?.count||0});
  }catch{ return NextResponse.json({papers:[],total:0}); }
}
