
import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest){
  const url = req.nextUrl.searchParams.get('url'); if(!url) return new NextResponse('Missing url', {status:400});
  try{
    const res = await fetch(url); const buf = await res.arrayBuffer();
    return new NextResponse(buf, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="paper.pdf"` } });
  }catch{ return new NextResponse('Failed', {status:500}); }
}
