// ==============================================================================
// КАТАЛОГ УДОБСТВ ВИЛЛЫ В СТИЛЕ AIRBNB: AMENITIES
// Файл: components/Amenities.js
// Назначение: Сетка ключевых удобств с иконками и модальное окно полного списка
// ==============================================================================

import React, { useState } from 'react';
import { Waves, Mountain, Wifi, Wind, Utensils, Car, Flame, WashingMachine, Laptop, Shield, Tv, Coffee, Sparkles, X, Check } from 'lucide-react';
import { useLanguage } from '../utils/language';

const ICON_MAP = {
  Waves,
  Mountain,
  Wifi,
  Wind,
  Utensils,
  Car,
  Flame,
  WashingMachine,
  Laptop,
  Shield,
  Tv,
  Coffee,
  Sparkles,
  Check
};

export default function Amenities({ homeData = null, customAmenitiesGrouped = null, customMainAmenities = null }) {
  const { t, lang } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const title = homeData?.amenitiesTitle || t('amenitiesTitle') || 'Что есть в этом жилье';
  const btnAllText = homeData?.amenitiesBtnAll || t('showAllAmenities') || 'Показать все удобства';

  // Динамические основные удобства из Google Sheets
  const effectiveMainAmenities = (customMainAmenities || homeData?.mainAmenities || []).map((item) => {
    const IconComponent = typeof item.icon === 'string' ? (ICON_MAP[item.icon] || Sparkles) : (item.icon || Sparkles);
    const label = item.label?.[lang] || item.label?.ru || (typeof item.label === 'string' ? item.label : '');
    return {
      icon: IconComponent,
      label
    };
  });

  // Запасной эталон при отсутствии данных в таблице
  const defaultMainAmenities = [
    { icon: Waves, label: t('amenityPool') || 'Приватный открытый бассейн' },
    { icon: Mountain, label: t('amenityMountain') || 'Панорамный вид на горы' },
    { icon: Wifi, label: t('amenityWifi') || 'Скоростной Wi-Fi 100 Мбит/с' },
    { icon: Wind, label: t('amenityAC') || 'Кондиционеры во всех комнатах' },
    { icon: Utensils, label: t('amenityKitchen') || 'Полноценная кухня и посуда' },
    { icon: Car, label: t('amenityParking') || 'Бесплатная парковка на территории' },
    { icon: Flame, label: t('amenityBBQ') || 'Зона BBQ и мангал в саду' },
    { icon: WashingMachine, label: t('amenityWasher') || 'Стиральная машина' },
    { icon: Laptop, label: t('amenityWorkspace') || 'Выделенное рабочее место' },
    { icon: Shield, label: t('amenitySecurity') || 'Охраняемая территория' }
  ];

  const mainAmenitiesToRender = effectiveMainAmenities.length > 0 ? effectiveMainAmenities : defaultMainAmenities;

  // Динамические сгруппированные удобства для модального окна
  const rawGrouped = customAmenitiesGrouped || homeData?.amenitiesGrouped;
  const effectiveAmenitiesGrouped = (rawGrouped && rawGrouped.length > 0)
    ? rawGrouped.map((grp) => ({
        category: grp.category?.[lang] || grp.category?.ru || (typeof grp.category === 'string' ? grp.category : ''),
        items: (grp.items || []).map((it) => (typeof it === 'object' ? (it[lang] || it.ru || '') : it))
      }))
    : [
        {
          category: lang === 'en' ? 'Scenic Views and Nature' : (lang === 'tr' ? 'Manzara ve Doga' : 'Виды и природа'),
          items: lang === 'en' ? [
            'Panoramic view of Dalyan rock mountains',
            'Direct river and lush garden view',
            'Private waterfront jetty access'
          ] : (lang === 'tr' ? [
            'Dalyan daglarinin panoramik manzarasi',
            'Nehir ve yemyesil bahce manzarasi',
            'Ozel iskeleye dogrudan erisim'
          ] : [
            'Панорамный вид на горы Дальяна',
            'Вид на реку и сад',
            'Прямой выход к причалу'
          ])
        },
        {
          category: lang === 'en' ? 'Pool and Spa' : (lang === 'tr' ? 'Havuz ve Spa' : 'Бассейн и спа'),
          items: lang === 'en' ? [
            'Private outdoor pool: depth 1.5m',
            'Comfortable sun loungers and umbrellas',
            'Poolside outdoor summer shower',
            'Evening pool hydro-lighting'
          ] : (lang === 'tr' ? [
            'Ozel acik yuzme havuzu: derinlik 1.5m',
            'Konforlu sezlonglar ve semsiyeler',
            'Havuz basi acik yaz dusu',
            'Aksam havuz su alti aydinlatmasi'
          ] : [
            'Приватный открытый бассейн: глубина 1.5м',
            'Шезлонги и зонты от солнца',
            'Летний душ у бассейна',
            'Вечерняя гидроподсветка бассейна'
          ])
        }
      ];

  return (
    <div id="amenities" className="py-8 border-t border-white/10">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
        {title}
      </h2>

      {/* Сетка основных удобств */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {mainAmenitiesToRender.map((item, idx) => {
          const IconComponent = item.icon || Sparkles;
          return (
            <div key={idx} className="flex items-center gap-3.5 text-slate-300">
              <IconComponent className="w-6 h-6 text-rose-400 shrink-0" />
              <span className="text-sm font-medium leading-snug">{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Кнопка показа всех удобств */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="px-6 py-3 rounded-2xl border border-white/20 bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-bold text-white transition-all hover:scale-105"
      >
        {btnAllText}
      </button>

      {/* Модальное окно полного каталога удобств */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">

            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" /> {lang === 'en' ? 'All Villa Amenities' : (lang === 'tr' ? 'Tum Villa Olanaklari' : 'Все удобства виллы')}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {effectiveAmenitiesGrouped.map((grp, gIdx) => (
                <div key={gIdx} className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-rose-400 border-b border-white/5 pb-1">
                    {grp.category}
                  </h4>
                  <ul className="space-y-2.5">
                    {grp.items.map((it, iIdx) => (
                      <li key={iIdx} className="text-xs sm:text-sm text-slate-300 flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

