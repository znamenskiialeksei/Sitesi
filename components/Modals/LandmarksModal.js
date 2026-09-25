// ==============================================================================
// МОДАЛЬНОЕ ОКНО ГЕОГРАФИЧЕСКИХ ОРИЕНТИРОВ: LANDMARKS MODAL
// Файл: components/Modals/LandmarksModal.js
// Назначение: Отображение 14 интерактивных плиток ориентиров Дальяна с фильтрами:
// Все, Пешком, На лодке, На авто
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import React from 'react';
import { X, MapPin, Navigation } from 'lucide-react';
import DalyanLandmarks from '../DalyanLandmarks';
import { useLanguage } from '../../utils/language';

export default function LandmarksModal({ isOpen = false, onClose = () => {}, homeData = null }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Шапка модального окна */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                {t('landmarksModalTitle') || '14 географических ориентиров Дальяна'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Точные расстояния, время в пути и способы перемещения от вилы
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Содержимое: 14 плиток из DalyanLandmarks */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <DalyanLandmarks homeData={homeData} />
        </div>

        {/* Нижняя панель */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-900/90 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>GPS: 36.8336° N, 28.6439° E • 250 м до центральной улицы</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm transition-colors border border-white/10"
          >
            Закрыть
          </button>
        </div>

      </div>
    </div>
  );
}
