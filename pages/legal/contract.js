import { useLanguage } from '../../utils/language';
import dynamicContent from '../../utils/content.json';
import SEO from '../../components/SEO';

export default function LegalPage() {
  const { lang } = useLanguage();
  const content = dynamicContent?.legal?.contract || {};
  const pageTitle = content?.title?.[lang] || content?.title?.ru || 'Договор аренды';
  const pageContent = content?.text?.[lang] || content?.text?.ru || '';

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 py-20 px-6 font-sans">
      <SEO title={`${pageTitle} | Villa Turaman`} description={pageContent.substring(0, 150).replace(/\n/g, ' ')} />
      <div className="max-w-4xl mx-auto bg-slate-900/80 p-10 rounded-[2rem] border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">{pageTitle}</h1>
        <div className="space-y-6 text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: pageContent.replace(/\\n/g, '<br />') }} />
      </div>
    </div>
  );
}
