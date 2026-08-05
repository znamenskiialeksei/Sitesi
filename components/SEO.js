import Head from 'next/head';
import { useRouter } from 'next/router';

export default function SEO({ 
  title, 
  description, 
  image = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600",
  type = "website",
  schemaData = null
}) {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://villaturaman.com';
  const currentUrl = `${siteUrl}${router.asPath}`;
  
  // Карта локалей для правильного OpenGraph
  const localeMap = { ru: 'ru-RU', en: 'en-US', tr: 'tr-TR' };
  const currentLocale = localeMap[router.locale] || 'ru-RU';

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Hreflang для локального SEO (помощь поисковикам в определении языковых версий) */}
      <link rel="alternate" hrefLang="ru" href={`${siteUrl}/ru${router.asPath}`} />
      <link rel="alternate" hrefLang="en" href={`${siteUrl}/en${router.asPath}`} />
      <link rel="alternate" hrefLang="tr" href={`${siteUrl}/tr${router.asPath}`} />
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/ru${router.asPath}`} />
      
      {/* OpenGraph мета-теги для красивых превью в соц. сетях и мессенджерах */}
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={currentLocale} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Villa Turaman" />
      
      {/* Twitter карточки */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Микроразметка Schema.org (JSON-LD) для расширенных сниппетов в Google */}
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
    </Head>
  );
}
