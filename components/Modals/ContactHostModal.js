// ==============================================================================
// МОДАЛЬНОЕ ОКНО ПРЯМОГО ОБРАЩЕНИЯ К ХОЗЯИНУ (CONTACT HOST MODAL)
// Файл: components/Modals/ContactHostModal.js
// Назначение: Возможность любому гостю написать сообщение хозяину Алексею Знаменскому
// без предварительной регистрации, со сквозной авто-авторизацией и переходом в чат
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { X, Send, Paperclip, ShieldCheck, Clock, Award, MessageCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';
import { useLanguage } from '../../utils/language';

export default function ContactHostModal() {
  const router = useRouter();
  const { contactModalOpen, setContactModalOpen, currentUser, loginGuestDirectly } = useAuth();
  const { t } = useLanguage();
  const toast = useToast();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Предзаполнение данных, если пользователь уже авторизован
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setName(currentUser.name);
      if (currentUser.contact) setContact(currentUser.contact);
    }
  }, [currentUser, contactModalOpen]);

  if (!contactModalOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      toast.warn(t('contactFileTooLargeToast') || 'Файл слишком большой. Максимальный размер: 5 МБ.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFile({
        name: selected.name,
        type: selected.type,
        base64: reader.result.split(',')[1]
      });
    };
    reader.readAsDataURL(selected);
  };

  const handleQuickQuestion = (text) => {
    setMessage((prev) => (prev ? `${prev}\n${text}` : text));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalName = currentUser?.name || name.trim();
    const finalContact = currentUser?.contact || contact.trim();
    const finalMessage = message.trim();

    if (!finalName) {
      toast.warn(t('contactNamePlaceholder') || 'Пожалуйста, укажите ваше имя.');
      return;
    }

    if (!finalContact) {
      toast.warn(t('contactPhonePlaceholder') || 'Пожалуйста, укажите контакт для связи.');
      return;
    }

    if (!finalMessage && !file) {
      toast.warn(t('contactMessagePlaceholder') || 'Пожалуйста, введите ваше сообщение хозяину.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/booking', {
        action: 'contact_host',
        name: finalName,
        contact: finalContact,
        sender: finalName,
        message: finalMessage,
        fileName: file?.name || null,
        mimeType: file?.type || null,
        fileBase64: file?.base64 || null
      });

      if (res.data && res.data.success) {
        // Мгновенная прямая авторизация гостя
        if (res.data.user) {
          loginGuestDirectly(res.data.user);
        }

        toast.success(t('contactSuccessToast') || 'Сообщение отправлено хозяину! Вы вошли как гость.');
        setContactModalOpen(false);
        setMessage('');
        setFile(null);

        // Переход в личный кабинет гостя к открытому диалогу
        router.push('/guest?tab=chat');
      } else {
        toast.error(res.data?.error || 'Не удалось отправить сообщение. Попробуйте снова.');
      }
    } catch (err) {
      console.warn('Ошибка отправки обращения к хозяину:', err);
      toast.error('Сетевая ошибка при отправке сообщения.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 fade-in select-none">
      <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Кнопка закрытия */}
        <button
          onClick={() => setContactModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Карточка хоста в шапке модального окна */}
        <div className="flex items-center gap-4 pb-5 border-b border-white/10 mb-5">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 via-amber-500 to-indigo-600 p-0.5 shadow-lg">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <span className="text-lg font-black text-white">AZ</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full shadow-md">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {t('contactModalTitle') || 'Написать хозяину виллы'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
                <Clock className="w-3 h-3" /> {t('responseTimeOneHour')}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3 h-3" /> Суперхозяин
              </span>
            </p>
          </div>
        </div>

        {/* Описание */}
        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          {t('contactModalSubtitle')}
        </p>

        {/* Быстрые вопросы-подсказки */}
        <div className="mb-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> {t('contactQuickQuestionsTitle')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              t('contactQuickQ1'),
              t('contactQuickQ2'),
              t('contactQuickQ3'),
              t('contactQuickQ4')
            ].filter(Boolean).map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickQuestion(q)}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-white/5 transition-all text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Форма отправки сообщения */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Имя гостя */}
          {!currentUser && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('contactNameLabel')}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('contactNamePlaceholder')}
                className="w-full bg-slate-800/80 border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          )}

          {/* Контакт гостя */}
          {!currentUser && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('contactPhoneLabel')}
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={t('contactPhonePlaceholder')}
                className="w-full bg-slate-800/80 border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          )}

          {/* Сообщение */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t('contactMessageLabel')}
            </label>
            <textarea
              rows={4}
              required={!file}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('contactMessagePlaceholder')}
              className="w-full bg-slate-800/80 border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors resize-none"
            />
          </div>

          {/* Прикрепленный файл превью */}
          {file && (
            <div className="p-3 bg-slate-800 rounded-2xl border border-white/10 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2 truncate">
                <Paperclip className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="truncate">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Действия: Прикрепить файл + Отправить */}
          <div className="flex items-center gap-3 pt-2">
            <label className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors border border-white/10 flex items-center justify-center shrink-0">
              <Paperclip className="w-4 h-4" />
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>

            <button
              type="submit"
              disabled={loading || (!message.trim() && !file)}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? (t('contactSendingBtn') || 'Отправка...') : (t('contactSendBtn') || 'Отправить хозяину')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
