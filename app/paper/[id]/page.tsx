
import { Metadata } from 'next';
export async function generateMetadata({params}:{params:{id:string}}): Promise<Metadata>{ return { title: `Paper ${decodeURIComponent(params.id)} - Rigorous Research` }; }
export default function PaperDetail({params}:{params:{id:string}}){
  const id = decodeURIComponent(params.id);
  return (<div className="max-w-5xl mx-auto px-6 py-10"><h1 className="text-3xl font-bold break-all">{id}</h1><p className="mt-4 text-gray-600">تفاصيل البحث الكاملة مع ملخص، مؤلفين، اقتباسات، ورابط PDF مباشر.</p><div className="mt-6 flex gap-2"><a href={`/api/download?url=${encodeURIComponent(id)}`} className="bg-blue-600 text-white px-6 py-3 rounded-xl">تحميل PDF</a><a href={`/search?q=${encodeURIComponent(id)}`} className="border px-6 py-3 rounded-xl">بحث مشابه</a></div><div className="mt-10 border rounded-xl p-4 h-[600px]"><iframe src={id} className="w-full h-full" /></div></div>);
}
