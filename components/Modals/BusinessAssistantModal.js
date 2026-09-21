// ==============================================================================
// РАБОЧИЙ КАБИНЕТ СУПЕРХОЗЯИНА: СЕКРЕТАРЬ • ЮРИСТ • БУХГАЛТЕР
// Файл: components/Modals/BusinessAssistantModal.js
// Назначение: Интерактивный универсальный пульт управления:
// 1. Полноценный рабочий чат суперхозяина с голосовым набором [Web Speech API]
// 2. Калькулятор фактур e-Arşiv Fatura для портала GİB [Блок 9] с копированием в 1 клик
// 3. Юрист: Экспресс-проверка договоров, KBS и KVKK
// 4. Иерархический файловый менеджер Google Drive [рекурсивное создание папок и документов]
// 5. Синхронизация с CRM листом 📋 Задачи и Поручения Секретаря
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  X,
  Bot,
  Send,
  Mic,
  MicOff,
  Calculator,
  Scale,
  Briefcase,
  FolderPlus,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Folder
} from 'lucide-react';
import { useToast } from '../Toast';

export default function BusinessAssistantModal({
  isOpen,
  onClose,
  activeBooking = null
}) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'accounting' | 'lawyer' | 'drive' | 'tasks'
  const [selectedDirection, setSelectedDirection] = useState('Секретарь'); // 'Секретарь' | 'Юрист' | 'Бухгалтер'

  // Состояние чата
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Здравствуйте, Алексей! Я ваш персональный бизнес-ассистент [Секретарь, Юрист и Бухгалтер в одном лице]. Чем могу помочь сегодня?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Состояние калькулятора e-Arşiv Fatura
  const [calcGrossTRY, setCalcGrossTRY] = useState(activeBooking?.price ? String(parseInt(activeBooking.price, 10) * 35) : '75000');
  const [calcNights, setCalcNights] = useState(activeBooking?.nights ? String(activeBooking.nights) : '7');
  const [calcGuestName, setCalcGuestName] = useState(activeBooking?.name || 'Иван Смирнов');
  const [calcResult, setCalcResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  // Состояние Google Drive
  const [drivePath, setDrivePath] = useState('Бухгалтерия/2026/Сентябрь/Счета_GIB');
  const [docName, setDocName] = useState('Заметка_суперхозяина.txt');
  const [docContent, setDocContent] = useState('');
  const [driveResult, setDriveResult] = useState(null);
  const [isDriveLoading, setIsDriveLoading] = useState(false);

  // Состояние задач CRM
  const [tasksList, setTasksList] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // Инициализация Web Speech API голосового ввода
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRec) {
        const rec = new SpeechRec();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'ru-RU';

        rec.onresult = (e) => {
          const transcript = e.results[0][0].transcript;
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
          toast.success('Голос распознан');
        };

        rec.onerror = () => {
          setIsListening(false);
          toast.error('Ошибка распознавания речи');
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.warning('Голосовой ввод не поддерживается браузером');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.info('Говорите... Идет запись');
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'chat' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Загрузка задач CRM
  const loadTasksFromCrm = async () => {
    setIsLoadingTasks(true);
    try {
      const res = await axios.get('/api/ai/knowledge?force=true');
      if (res.data?.data?.tasks) {
        setTasksList(res.data.data.tasks);
      }
    } catch (err) {
      console.warn('Ошибка загрузки задач:', err.message);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'tasks') {
      loadTasksFromCrm();
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  // Отправка сообщения в чат
  const handleSendMessage = async (customText = null) => {
    const text = customText || inputText;
    if (!text.trim() || isSending) return;

    const userMsg = { id: Date.now(), sender: 'host', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsSending(true);

    try {
      const res = await axios.post('/api/ai/assistant', {
        direction: selectedDirection,
        action: 'chat',
        message: text,
        chatHistory: messages.map((m) => ({ sender: m.sender, text: m.text }))
      });

      if (res.data?.reply) {
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'assistant',
          text: res.data.reply,
          taskId: res.data.taskId
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (res.data.taskId) {
          toast.success(`Поручение зафиксировано в CRM под ID: ${res.data.taskId}`);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'assistant', text: `Ошибка связи: ${err.message}` }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Расчет e-Arşiv Fatura
  const handleCalculateInvoice = async () => {
    setIsCalculating(true);
    try {
      const res = await axios.post('/api/ai/assistant', {
        direction: 'Бухгалтер',
        action: 'fatura_calculate',
        grossTRY: parseFloat(calcGrossTRY) || 0,
        nights: parseInt(calcNights, 10) || 1,
        guestName: calcGuestName
      });

      if (res.data?.calculation) {
        setCalcResult(res.data.calculation);
        toast.success('Расчет выполнен по стандарту GİB');
      }
    } catch (err) {
      toast.error(`Ошибка расчета: ${err.message}`);
    } finally {
      setIsCalculating(false);
    }
  };

  // Копирование текста в буфер
  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success('Скопировано в буфер');
    setTimeout(() => setCopiedField(''), 2000);
  };

  // Создание папки Google Drive
  const handleCreateDriveFolder = async () => {
    if (!drivePath.trim()) return;
    setIsDriveLoading(true);
    try {
      const res = await axios.post('/api/ai/drive-files', {
        action: 'ensure_path',
        pathString: drivePath
      });
      if (res.data?.success) {
        setDriveResult(res.data);
        toast.success('Папка успешно создана на Google Drive');
      }
    } catch (err) {
      toast.error(`Ошибка Drive: ${err.message}`);
    } finally {
      setIsDriveLoading(false);
    }
  };

  // Создание текстового документа Google Drive
  const handleCreateDriveDoc = async () => {
    if (!docContent.trim()) return;
    setIsDriveLoading(true);
    try {
      const res = await axios.post('/api/ai/drive-files', {
        action: 'create_doc',
        pathString: drivePath,
        fileName: docName,
        content: docContent
      });
      if (res.data?.success) {
        setDriveResult(res.data);
        toast.success('Документ сохранен на Google Drive');
        setDocContent('');
      }
    } catch (err) {
      toast.error(`Ошибка сохранения: ${err.message}`);
    } finally {
      setIsDriveLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] max-h-[850px] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Шапка модального окна */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                Бизнес-Ассистент суперхозяина
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Gemini 3.6 Flash
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Секретарь • Юрист • Бухгалтер • Google Drive • CRM Задачи
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Навигационная панель вкладок */}
        <div className="flex items-center gap-1 px-6 py-2 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'chat'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Briefcase className="w-4 h-4 text-rose-500" />
            Рабочий Чат
          </button>

          <button
            onClick={() => setActiveTab('accounting')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'accounting'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Calculator className="w-4 h-4 text-emerald-500" />
            Бухгалтер: e-Arşiv GİB
          </button>

          <button
            onClick={() => setActiveTab('lawyer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'lawyer'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Scale className="w-4 h-4 text-indigo-500" />
            Юрист: KBS & Договоры
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'drive'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Folder className="w-4 h-4 text-amber-500" />
            Google Drive Проекта
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'tasks'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-500" />
            Задачи CRM
          </button>
        </div>

        {/* Тело модального окна в зависимости от вкладки */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50">
          
          {/* ВКЛАДКА 1: УНИВЕРСАЛЬНЫЙ РАБОЧИЙ ЧАТ С ГОЛОСОВЫМ НАБОРОМ */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              
              {/* Селектор направления ассистента */}
              <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Отдел:</span>
                  {['Секретарь', 'Юрист', 'Бухгалтер'].map((dir) => (
                    <button
                      key={dir}
                      onClick={() => setSelectedDirection(dir)}
                      className={`px-3 py-1 rounded-full font-bold transition-colors ${
                        selectedDirection === dir
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {dir}
                    </button>
                  ))}
                </div>
                <div className="text-slate-400 text-xs hidden sm:block">
                  Авто-фиксация поручений в CRM лист 📋 Задачи
                </div>
              </div>

              {/* Лента сообщений */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === 'host' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                        m.sender === 'host'
                          ? 'bg-rose-500 text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                      }`}
                    >
                      {m.text}
                      {m.taskId && (
                        <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-purple-600 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Зафиксировано в CRM: {m.taskId}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-white text-slate-500 border border-slate-200 rounded-2xl rounded-bl-none p-3 shadow-sm text-xs flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-500" />
                      Ассистент формирует ответ...
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Панель ввода с микрофоном и кнопкой отправки */}
              <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`p-3 rounded-xl border transition-all ${
                      isListening
                        ? 'bg-red-500 text-white border-red-600 animate-pulse'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                    title={isListening ? 'Идет запись речи...' : 'Включить голосовой набор'}
                  >
                    {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>

                  <textarea
                    rows={2}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={`Напишите или продиктуйте поручение для отдела ${selectedDirection}...`}
                    className="flex-1 resize-none p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 leading-relaxed text-slate-900 bg-white placeholder:text-slate-400 font-medium"
                  />

                  <button
                    type="button"
                    disabled={!inputText.trim() || isSending}
                    onClick={() => handleSendMessage()}
                    className="p-3 bg-slate-900 text-white rounded-xl hover:bg-rose-600 disabled:opacity-40 transition-colors shadow-sm"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ВКЛАДКА 2: КАЛЬКУЛЯТОР E-ARŞİV FATURA [GİB PORTAL] */}
          {activeTab === 'accounting' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  Параметры фактуры e-Arşiv Fatura [GİB Portal]
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Стандарт Блока 9: 100% Брутто на имя гостя [Alıcı], валюта TRY, делитель 1.21 [KDV 20% + Konaklama 1%], Birim Fiyat с 8 знаками.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ФИО Гостя [Alıcı]
                    </label>
                    <input
                      type="text"
                      value={calcGuestName}
                      onChange={(e) => setCalcGuestName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:outline-none text-slate-900 bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Сумма Брутто TRY [Ödenecek Tutar]
                    </label>
                    <input
                      type="number"
                      value={calcGrossTRY}
                      onChange={(e) => setCalcGrossTRY(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:outline-none font-mono text-slate-900 bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Количество ночей [Adet]
                    </label>
                    <input
                      type="number"
                      value={calcNights}
                      onChange={(e) => setCalcNights(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:outline-none font-mono text-slate-900 bg-white font-bold"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isCalculating}
                  onClick={handleCalculateInvoice}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors flex items-center gap-2"
                >
                  {isCalculating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
                  Рассчитать для портала GİB
                </button>
              </div>

              {/* Результаты расчета с копированием в 1 клик */}
              {calcResult && (
                <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-emerald-800 text-sm">
                      Результат расчета [Готово для вставки в GİB]
                    </h4>
                    <span className="text-xs text-slate-500">
                      Основание: {calcResult.lawBasis} | VKN: {calcResult.vkn}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block mb-1">Налоговая база [Matrah]</span>
                      <span className="font-mono font-bold text-slate-800 text-sm">
                        {calcResult.matrahTRY} TRY
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block mb-1">НДС [KDV 20%]</span>
                      <span className="font-mono font-bold text-emerald-700 text-sm">
                        {calcResult.kdv20TRY} TRY
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block mb-1">Проживание [Konaklama 1%]</span>
                      <span className="font-mono font-bold text-indigo-700 text-sm">
                        {calcResult.konaklama1TRY} TRY
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block mb-1">Итого Брутто</span>
                      <span className="font-mono font-bold text-rose-600 text-sm">
                        {calcResult.grossTRY} TRY
                      </span>
                    </div>
                  </div>

                  {/* Birim Fiyat 8 знаков */}
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-900 block">
                        Цена за единицу [Birim Fiyat] : 8 десятичных знаков
                      </span>
                      <span className="font-mono text-sm font-bold text-slate-900">
                        {calcResult.unitPriceTRY} TRY
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(calcResult.unitPriceTRY, 'unitPrice')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      {copiedField === 'unitPrice' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      Скопировать
                    </button>
                  </div>

                  {/* Обязательный турецкий шаблон Not прописью до куруша */}
                  <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Обязательное примечание [Not] прописью</span>
                      <button
                        onClick={() => copyToClipboard(calcResult.turkishWordsNote, 'note')}
                        className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold flex items-center gap-1"
                      >
                        {copiedField === 'note' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        Скопировать в 1 клик
                      </button>
                    </div>
                    <p className="font-mono text-xs text-emerald-400 leading-relaxed">
                      {calcResult.turkishWordsNote}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ВКЛАДКА 3: ЮРИСТ: KBS & ДОГОВОРЫ */}
          {activeTab === 'lawyer' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-indigo-600" />
                  Юридический стандарт и регламенты Villa Turaman
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 block text-sm">
                      1. Регистрация KBS Жандармерии
                    </span>
                    <p className="leading-relaxed">
                      Все гости обязаны быть зарегистрированы в течение 24 часов с момента прибытия. Формат: ФИО, дата рождения [DD.MM.YYYY], пол [male/female], гражданство [English], паспорт.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 block text-sm">
                      2. Защита данных KVKK №6698
                    </span>
                    <p className="leading-relaxed">
                      Aydınlatma Metni: паспортные данные используются строго для жандармерии KBS. Хранение во внутренних защищенных реестрах.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 block text-sm">
                      3. Налоговый учет VUK 213 Madde 230
                    </span>
                    <p className="leading-relaxed">
                      Выставление электронных фактур e-Arşiv Fatura через портал GİB. Налоговый номер VKN: 9991120181 [Ortaca Vergi Dairesi].
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 block text-sm">
                      4. Золотая формула переговоров SPARK
                    </span>
                    <p className="leading-relaxed">
                      30% вежливости и заботы / 70% юридической дисциплины и соблюдения правил проживания. Лимит проживания строго до 10 человек.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Хотите проверить текст договора или паспортные данные гостя?
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab('chat');
                      setSelectedDirection('Юрист');
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Задать вопрос юристу в чате
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ВКЛАДКА 4: GOOGLE DRIVE ПРОЕКТА */}
          {activeTab === 'drive' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Folder className="w-5 h-5 text-amber-500" />
                    Файловый архив проекта на Google Drive
                  </h3>
                  <a
                    href="https://drive.google.com/drive/folders/11xBSWA02NypliPFbziRSMfC9aAPclYF_"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-amber-600 hover:underline flex items-center gap-1 font-bold"
                  >
                    Открыть корень Drive <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-500">
                  Корневой каталог проекта: <code className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">11xBSWA02NypliPFbziRSMfC9aAPclYF_</code>. Создавайте папки любой вложенности и загружайте файлы.
                </p>

                {/* Создание папки */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    Путь для создания папок и подпапок:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={drivePath}
                      onChange={(e) => setDrivePath(e.target.value)}
                      placeholder="Бухгалтерия/2026/Сентябрь/Счета_GIB"
                      className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:border-amber-500 focus:outline-none text-slate-900 bg-white placeholder:text-slate-400 font-medium"
                    />
                    <button
                      type="button"
                      disabled={isDriveLoading}
                      onClick={handleCreateDriveFolder}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <FolderPlus className="w-4 h-4" />
                      Создать папки
                    </button>
                  </div>
                </div>

                {/* Создание текстового документа */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Сохранить заметку / документ в эту папку:
                    </label>
                    <input
                      type="text"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      className="text-xs font-mono px-3 py-1 rounded-lg border border-slate-200 text-slate-900 bg-white font-medium"
                    />
                  </div>
                  <textarea
                    rows={4}
                    value={docContent}
                    onChange={(e) => setDocContent(e.target.value)}
                    placeholder="Введите текст документа, протокола или заметки для сохранения на Google Drive..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs leading-relaxed focus:border-amber-500 focus:outline-none text-slate-900 bg-white placeholder:text-slate-400 font-medium"
                  />
                  <button
                    type="button"
                    disabled={isDriveLoading || !docContent.trim()}
                    onClick={handleCreateDriveDoc}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <FileText className="w-4 h-4" />
                    Сохранить документ на Drive
                  </button>
                </div>

                {/* Результат операции */}
                {driveResult && (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <span className="text-xs text-emerald-800 font-medium">
                      Операция завершена успешно. Ссылка на объект:
                    </span>
                    <a
                      href={driveResult.webViewLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      Открыть объект <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ВКЛАДКА 5: РЕЕСТР ЗАДАЧ CRM */}
          {activeTab === 'tasks' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Лист CRM: 📋 Задачи и Поручения Секретаря
                </h3>
                <button
                  onClick={loadTasksFromCrm}
                  disabled={isLoadingTasks}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors"
                  title="Обновить задачи"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingTasks ? 'animate-spin text-purple-600' : ''}`} />
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-white font-bold">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Дата</th>
                      <th className="p-3">Отдел</th>
                      <th className="p-3">Суть задачи / Диалог</th>
                      <th className="p-3">Статус</th>
                      <th className="p-3">Исполнитель</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tasksList.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-purple-700">{t.id}</td>
                        <td className="p-3 text-slate-500 whitespace-nowrap">{t.timestamp}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            t.direction === 'Бухгалтер'
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.direction === 'Юрист'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {t.direction}
                          </span>
                        </td>
                        <td className="p-3 text-slate-800 font-medium max-w-xs truncate" title={t.taskText}>
                          {t.taskText}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                            {t.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{t.assignee}</td>
                      </tr>
                    ))}
                    {tasksList.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400">
                          Задачи пока не зафиксированы. Добавьте поручение в чате или калькуляторе.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
