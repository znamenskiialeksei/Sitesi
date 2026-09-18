// ==============================================================================
// БЛОК ОТЗЫВОВ И РЕЙТИНГА В СТИЛЕ AIRBNB (REVIEWS SECTION)
// Файл: components/ReviewsSection.js
// Назначение: Оценки по категориям (Чистота, Общение, Локация) и отзывы гостей
// ==============================================================================

import React from 'react';
import { Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../utils/language';

export default function ReviewsSection() {
  const { t } = useLanguage();

  const categories = [
    { label: t('reviewCleanliness') || "Чистота", score: "5.0", percent: 100 },
    { label: t('reviewAccuracy') || "Точность описания", score: "4.9", percent: 98 },
    { label: t('reviewCommunication') || "Общение с хозяином", score: "5.0", percent: 100 },
    { label: t('reviewLocation') || "Расположение", score: "4.9", percent: 98 },
    { label: t('reviewCheckIn') || "Прибытие и заезд", score: "5.0", percent: 100 },
    { label: t('reviewValue') || "Соотношение цена/качество", score: "4.9", percent: 98 }
  ];

  const sampleReviews = [
    {
      author: "Елена Смирнова",
      date: "Август 2026",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120",
      comment: "Потрясающая вилла! Вид на горы просто захватывает дух, бассейн чистейший. Алексей был на связи 24/7, помог организовать незабываемый круиз на яхте по озеру Кёйджегиз. Обязательно вернемся!"
    },
    {
      author: "Markus Webber",
      date: "Июль 2026",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
      comment: "Outstanding hospitality and pristine villa. Fast Wi-Fi for remote work, peaceful neighborhood, and fully equipped kitchen. Aleksei is truly a top Superhost!"
    },
    {
      author: "Ahmet Yılmaz",
      date: "Июнь 2026",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120",
      comment: "Dalyan'da kaldığımız en konforlu villa. Bahçe ve havuz bakımı mükemmeldi. Ailemizle birlikte çok huzurlu bir hafta geçirdik, teşekkürler Aleksei!"
    },
    {
      author: "Дмитрий и Анна",
      date: "Май 2026",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
      comment: "Идеально для семейного отдыха с детьми. Закрытая территория, просторные спальни, тишина. Видео-гид от Алексея открыл нам секретные пляжи Дальяна, где нет толп туристов."
    }
  ];

  return (
    <div id="reviews" className="py-10 border-t border-white/10">
      
      {/* Общий рейтинг */}
      <div className="flex items-center gap-3 mb-8">
        <Star className="w-8 h-8 text-rose-500 fill-rose-500" />
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          4.98 • {t('reviewsRatingHeader')}
        </h2>
      </div>

      {/* Оценки по 6 критериям */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 mb-10">
        {categories.map((cat, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 text-xs sm:text-sm">
            <span className="text-slate-300 font-medium">{cat.label}</span>
            <div className="flex items-center gap-3">
              <div className="w-24 sm:w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${cat.percent}%` }}
                />
              </div>
              <span className="font-bold text-white w-6 text-right">{cat.score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Сетка отзывов */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sampleReviews.map((rev, idx) => (
          <div
            key={idx}
            className="bg-slate-800/50 border border-white/5 rounded-2xl p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={rev.avatar}
                  alt={rev.author}
                  className="w-11 h-11 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.author}</h4>
                  <p className="text-[11px] text-slate-400">{rev.date}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                "{rev.comment}"
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('verifiedBooking')}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

