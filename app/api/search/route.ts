const DICT: any = { 'الاقتصاد': 'economics', 'اقتصاد': 'economics' };
let finalQ = q;
if (/[\u0600-\u06FF]/.test(q)) {
  finalQ = DICT[q] || 'economics';
}
// بعدين ابحث بـ finalQ
const url = `https://api.openalex.org/works?search=${encodeURIComponent(finalQ)}...`
