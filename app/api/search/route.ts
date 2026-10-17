import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const DICT: Record<string, string> = {
  'الاقتصاد': 'economics',
  'اقتصاد': 'economics',
  'الطب': 'medicine',
  'الهندسة': 'engineering',
  'حاسوب': 'computer science',
  'ذكاء اصطناعي': 'artificial intelligence',
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const rawQ = url.searchParams.get('q') || 'economics';
  const q = decodeURIComponent(rawQ).trim();
  const page = url.searchParams.get('page') || '1';

  const isArabic = /[\u0600-\u06FF]/.test(q);
  let searchTerm = q;
  if (isArabic) {
    searchTerm = DICT[q] || 'economics';
  }

  try {
    const apiUrl = `https://api.openalex.org/works?search=${encodeURIComponent(searchTerm)}&page=${page}&per-page=20`;
    const res = await fetch(apiUrl, {
      headers: { 'User-Agent': 'RigorousResearch/1.0' },
      cache: 'no-store'
    });
    const data = await res.json();

    return NextResponse.json({
      papers: data.results || [],
      total: data.meta?.count || 0,
      query: q,
    });
  } catch (err) {
    return NextResponse.json({
      papers: [],
      total: 0,
      query: q,
    });
  }
}
