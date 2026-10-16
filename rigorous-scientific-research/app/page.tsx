
import Link from 'next/link';
export default function Home(){
  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold leading-tight">ابحث في أكثر من <span className="text-blue-600">250 مليون</span> بحث علمي رصين</h1>
        <p className="mt-6 text-lg text-gray-600">من OpenAlex, Semantic Scholar, PubMed, arXiv, CORE - مع تحميل PDF مباشر</p>
        <form action="/search" className="mt-10 max-w-3xl mx-auto flex gap-2">
          <input name="q" placeholder="مثال: machine learning in medicine..." className="flex-1 border rounded-xl px-5 py-4 text-lg shadow-sm" required/>
          <button className="bg-blue-600 text-white px-8 rounded-xl font-bold">بحث</button>
        </form>
        <div className="mt-8 flex justify-center gap-6 text-sm text-gray-500"><span>250M+ Papers</span><span>5 Sources</span><span>PDF Download</span></div>
      </section>
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-4 pb-20">
        {['Medicine','Engineering','Computer Science','Physics','Biology','Chemistry','Economics','Psychology','Law','Education'].map(c=>(
          <Link key={c} href={`/category/${c.toLowerCase()}`} className="border rounded-xl p-6 hover:shadow text-center font-medium">{c}</Link>
        ))}
      </section>
    </div>
  );
}
