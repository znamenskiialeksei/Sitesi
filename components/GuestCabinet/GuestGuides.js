// ==============================================================================
// ВКЛАДКА «МОИ ПУТЕВОДИТЕЛИ И УСЛУГИ» В КАБИНЕТЕ ПУТЕШЕСТВЕННИКА
// Файл: components/GuestCabinet/GuestGuides.js
// Назначение: Доступ к купленным видео-гидам Алексея Знаменского и заказам
// ==============================================================================

import React, { useState } from 'react';
import { PlayCircle, ExternalLink, Sparkles, Compass } from 'lucide-react';
import { useLanguage } from '../../utils/language';

export default function GuestGuides({ guides = [] }) {
  const { t, lang } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const activeGuides = guides.length > 0 ? guides : [
    {
      id: "guide_dalyan_secrets",
      name: { ru: "Секретные места и маршруты Дальяна", en: "Secret Spots of Dalyan", tr: "Dalyan'ın Gizli Rotaları" },
      desc: { ru: "Авторский видео-гид: секретные пляжи, дикие черепахи, лучшие смотровые площадки.", en: "Exclusive video guide: hidden beaches, wild turtles, top viewpoints.", tr: "Özel video rehber: gizli plajlar, kaplumbağalar ve seyir tepeleri." },
      privateLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"
    }
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-400" /> {t('tabMyGuides')}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Ваши персональные видеоматериалы и путеводители от владельца виллы
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeGuides.map((g, idx) => {
          const title = g.name?.[lang] || g.name?.ru || 'Путеводитель';
          const desc = g.desc?.[lang] || g.desc?.ru || '';

          return (
            <div
              key={idx}
              className="bg-slate-800/80 border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div className="h-52 relative overflow-hidden group">
                <img
                  src={g.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button
                    onClick={() => setSelectedVideo(g.privateLink)}
                    className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
                  >
                    <PlayCircle className="w-8 h-8" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-base font-bold text-white mb-2">{title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">{desc}</p>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Доступ открыт
                  </span>

                  <button
                    onClick={() => setSelectedVideo(g.privateLink)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <PlayCircle className="w-3.5 h-3.5" /> {t('watchGuideBtn')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Модальное окно защищенного видеоплеера */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[1200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-white">Видео-путеводитель Villa Turaman</span>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-slate-400 hover:text-white text-sm font-bold bg-slate-800 px-3 py-1 rounded-full"
              >
                Закрыть плеер
              </button>
            </div>

            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={selectedVideo}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

