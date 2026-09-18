// ==============================================================================
// МОДАЛЬНОЕ ОКНО ПРЕЗЕНТАЦИИ УСЛУГИ / ПУТЕВОДИТЕЛЯ (PRESENTATION MODAL)
// Файл: components/Modals/PresentationModal.js
// Назначение: Подробное описание, медиа-галерея, видео-превью и оформление заказа
// с полной поддержкой Google Drive видео/фото и мультиязычности из Google Sheets.
// ==============================================================================

import React from 'react';
import { X, ShoppingBag, PlayCircle, Eye, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../utils/language';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';
import { MediaCarousel } from '../../utils/media';

export default function PresentationModal({ item, type, onClose, onPurchase }) {
  const { t, lang, currency, formatMoney } = useLanguage();
  const { currentUser, setAuthModalOpen } = useAuth();
  const toast = useToast();

  if (!item) return null;

  const title = item.name?.[lang] || item.name?.ru || '';
  const desc = item.desc?.[lang] || item.desc?.ru || '';
  const detailed = item.detailedDesc?.[lang] || item.detailedDesc?.ru || desc;

  // Объединение изображений и видео в единый список для карусели
  const mediaList = [
    ...(Array.isArray(item.images) ? item.images : (item.images ? [item.images] : [])),
    ...(Array.isArray(item.videos) ? item.videos : (item.videos ? [item.videos] : []))
  ].filter(Boolean);

  const priceObj = item.price || {};
  const currKey = currency.toLowerCase();
  const price = priceObj[currKey] || priceObj.eur || priceObj.rub || 0;

  const handleOrder = () => {
    if (!currentUser) {
      toast.info('Пожалуйста, авторизуйтесь для оформления заказа.');
      setAuthModalOpen(true);
      return;
    }
    if (onPurchase) {
      onPurchase(price, type, item);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 fade-in select-none">
      <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">

        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all hover:scale-105 border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Карусель медиафайлов с поддержкой видео и Google Drive */}
        <div className="h-64 sm:h-80 w-full relative bg-black shrink-0 overflow-hidden">
          <MediaCarousel
            media={mediaList}
            type={item.videos && item.videos.length > 0 ? 'video' : 'image'}
          />
        </div>

        {/* Контентная область с описанием */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                {type === 'course' ? 'Авторский видео-путеводитель' : 'Премиальный консьерж-сервис'}
              </span>
              {item.module && (
                <span className="text-[11px] font-medium text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  {item.module}
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {detailed}
            </p>

            {/* Преимущества и особенности */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Официальный сервис от владельца</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Фиксация в календаре и CRM</span>
              </div>
            </div>
          </div>

          {/* Нижняя панель с ценой и кнопкой заказа */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                Итого к оплате:
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-400">
                {formatMoney(price)}
              </span>
            </div>

            <button
              onClick={handleOrder}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-rose-500/30 flex items-center gap-2 active:scale-95"
            >
              {type === 'course' ? (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Получить доступ</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Заказать услугу</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
