
export default function Cat({params}:{params:{slug:string}}){ return (<div className="max-w-5xl mx-auto px-6 py-12"><h1 className="text-4xl font-bold capitalize">{params.slug}</h1><p className="mt-4">أبحاث {params.slug} من 250M ورقة - مع PDF</p><a href={`/search?q=${params.slug}`} className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded">استعرض أبحاث {params.slug}</a></div>); }
