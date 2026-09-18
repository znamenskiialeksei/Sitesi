// ==============================================================================
// КОМПОНЕНТ SEO И СТРУКТУРИРОВАННЫХ ДАННЫХ SCHEMA.ORG
// Файл: components/SEO.js
// Назначение: Поисковая оптимизация, Open Graph и Rich Snippets для виллы
// ==============================================================================

import Head from 'next/head';

export default function SEO({
  title = "Villa Turaman | Аренда премиальной виллы в Дальяне",
  description = "Эксклюзивная аренда приватной виллы с бассейном в Дальяне. Бронирование напрямую от владельца Алексея Знаменского.",
  image = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600",
  schemaData = null
}) {
  // Базовая разметка Schema.org для объекта посуточной аренды
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "name": "Villa Turaman",
    "description": description,
    "image": image,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dalyan",
      "addressRegion": "Muğla",
      "addressCountry": "TR"
    },
    "numberOfRooms": 4,
    "occupancy": {
      "@type": "QuantitativeValue",
      "maxValue": 10
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.98",
      "reviewCount": "28"
    }
  };

  const finalSchema = schemaData || defaultSchema;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Фавикон и мета-иконки */}
      <link rel="icon" href="/favicon.ico" />

      {/* Инъекция структурированных данных Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(finalSchema) }}
      />
    </Head>
  );
}

