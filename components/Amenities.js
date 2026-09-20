// ==============================================================================
// КАТАЛОГ УДОБСТВ ВИЛЛЫ В СТИЛЕ AIRBNB (AMENITIES)
// Файл: components/Amenities.js
// Назначение: Сетка ключевых удобств с иконками и модальное окно полного списка
// ==============================================================================

import React, { useState } from 'react';
import { Waves, Mountain, Wifi, Wind, Utensils, Car, Flame, WashingMachine, Laptop, Shield, Tv, Coffee, Sparkles, X } from 'lucide-react';
import { useLanguage } from '../utils/language';

export default function Amenities({ customAmenitiesGrouped = null }) {
  const { t, lang } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const mainAmenities = [
    { icon: Waves, label: t('amenityPool') },
    { icon: Mountain, label: t('amenityMountain') },
    { icon: Wifi, label: t('amenityWifi') },
    { icon: Wind, label: t('amenityAC') },
    { icon: Utensils, label: t('amenityKitchen') },
    { icon: Car, label: t('amenityParking') },
    { icon: Flame, label: t('amenityBBQ') },
    { icon: WashingMachine, label: t('amenityWasher') },
    { icon: Laptop, label: t('amenityWorkspace') },
    { icon: Shield, label: t('amenitySecurity') }
  ];

  const allAmenitiesGrouped = [
    {
      category: lang === 'en' ? 'Scenic Views & Nature' : (lang === 'tr' ? 'Manzara ve Doğa' : 'Виды и природа'),
      items: lang === 'en' ? [
        'Panoramic view of Dalyan rock mountains',
        'Direct river and lush garden view',
        'Private waterfront jetty access'
      ] : (lang === 'tr' ? [
        'Dalyan dağlarının panoramik manzarası',
        'Nehir ve yemyeşil bahçe manzarası',
        'Özel iskeleye doğrudan erişim'
      ] : [
        'Панорамный вид на горы Дальяна',
        'Вид на реку и сад',
        'Прямой выход к причалу'
      ])
    },
    {
      category: lang === 'en' ? 'Pool & Spa' : (lang === 'tr' ? 'Havuz ve Spa' : 'Бассейн и спа'),
      items: lang === 'en' ? [
        'Private outdoor pool (depth 1.5m)',
        'Comfortable sun loungers and umbrellas',
        'Poolside outdoor summer shower',
        'Evening pool hydro-lighting'
      ] : (lang === 'tr' ? [
        'Özel açık yüzme havuzu (derinlik 1.5m)',
        'Konforlu şezlonglar ve şemsiyeler',
        'Havuz başı açık yaz duşu',
        'Akşam havuz su altı aydınlatması'
      ] : [
        'Приватный открытый бассейн (глубина 1.5м)',
        'Шезлонги и зонты от солнца',
        'Летний душ у бассейна',
        'Вечерняя гидроподсветка бассейна'
      ])
    },
    {
      category: lang === 'en' ? 'Kitchen & Dining' : (lang === 'tr' ? 'Mutfak ve Yemek' : 'Кухня и столовая'),
      items: lang === 'en' ? [
        'Large double-door refrigerator',
        'Modern dishwasher',
        'Oven and induction cooktop',
        'Espresso coffee machine and kettle',
        'Full set of cookware, dishes and wine glasses'
      ] : (lang === 'tr' ? [
        'Geniş çift kapılı buzdolabı',
        'Modern bulaşık makinesi',
        'Fırın ve indüksiyonlu ocak',
        'Espresso kahve makinesi ve su ısıtıcısı',
        'Eksiksiz tencere, tabak ve kadeh takımı'
      ] : [
        'Большой двухкамерный холодильник',
        'Посудомоечная машина',
        'Духовой шкаф и индукционная варочная панель',
        'Кофемашина эспрессо и чайник',
        'Полный комплект посуды и бокалов'
      ])
    },
    {
      category: lang === 'en' ? 'Comfort & Tech' : (lang === 'tr' ? 'Konfor ve Teknoloji' : 'Комфорт и связь'),
      items: lang === 'en' ? [
        'High-speed fiber-optic Wi-Fi (100 Mbps)',
        'Individual split AC units in all rooms',
        'Smart TV 55" with Netflix & YouTube',
        'Dedicated workspace with ergonomic chair'
      ] : (lang === 'tr' ? [
        'Yüksek hızlı fiber optik Wi-Fi (100 Mbps)',
        'Her odada bağımsız split klima',
        'Netflix ve YouTube özellikli 55" Smart TV',
        'Ergonomik sandalyeli özel çalışma alanı'
      ] : [
        'Скоростной оптоволоконный Wi-Fi (100 Мбит/с)',
        'Сплит-системы кондиционирования в каждой комнате',
        'Smart TV 55 дюймов с Netflix и YouTube',
        'Выделенная рабочая зона с эргономичным креслом'
      ])
    },
    {
      category: lang === 'en' ? 'Home Safety' : (lang === 'tr' ? 'Ev Güvenliği' : 'Безопасность дома'),
      items: lang === 'en' ? [
        'Gated private enclosed territory',
        'External perimeter CCTV security',
        'Smoke detectors and first aid kit',
        'Fire extinguisher'
      ] : (lang === 'tr' ? [
        'Çevrili özel korunaklı mülk alanı',
        'Dış çevre güvenlik kamerası sistemi',
        'Duman dedektörleri ve ilk yardım kiti',
        'Yangın söndürücü'
      ] : [
        'Огороженная приватная территория',
        'Система видеонаблюдения по внешнему периметру',
        'Датчики дыма и аптечка первой помощи',
        'Огнетушитель'
      ])
    }
  ];

  const effectiveAmenitiesGrouped = (customAmenitiesGrouped && customAmenitiesGrouped.length > 0)
    ? customAmenitiesGrouped
    : allAmenitiesGrouped;

  return (
    <div id="amenities" className="py-8 border-t border-white/10">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
        {t('amenitiesTitle')}
      </h2>

      {/* Сетка удобств */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {mainAmenities.map((item, idx) => {
          const IconComponent = item.icon;
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
        onClick={() => setModalOpen(true)}
        className="px-6 py-3 rounded-2xl border border-white/20 bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-bold text-white transition-all hover:scale-105"
      >
        {t('showAllAmenities')}
      </button>

      {/* Модальное окно полного каталога удобств */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">

            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" /> {lang === 'en' ? 'All Villa Amenities' : (lang === 'tr' ? 'Tüm Villa Olanakları' : 'Все удобства виллы')}
              </h3>
              <button
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

