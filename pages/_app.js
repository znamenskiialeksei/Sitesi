// ==============================================================================
// ГЛАВНЫЙ КОРНЕВОЙ ПРОВАЙДЕР ПРИЛОЖЕНИЯ NEXT.JS (AIRBNB ARCHITECTURE)
// Файл: pages/_app.js
// Назначение: Объединение глобальных стилей, провайдера мультиязычности и валют,
// централизованной аутентификации гостей и хоста, а также системы Toast-уведомлений.
// ==============================================================================

import React from 'react';
import { LanguageProvider } from '../utils/language';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../components/Toast';
import { LegalConsentProvider } from '../context/LegalConsentContext';

// Стили календаря react-datepicker и глобальный Tailwind CSS с поддержкой кастомных скроллбаров
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    // Провайдер языка и валют (RU, EN, TR / RUB, EUR, TRY, USD)
    <LanguageProvider>
      {/* Провайдер сквозных юридических согласий (KVKK, Договор, Конфиденциальность) */}
      <LegalConsentProvider>
        {/* Провайдер авторизации и ролей (Гость / Владелец с 2FA сессией) */}
        <AuthProvider>
          {/* Провайдер современных неблокирующих всплывающих уведомлений */}
          <ToastProvider>
            <Component {...pageProps} />
          </ToastProvider>
        </AuthProvider>
      </LegalConsentProvider>
    </LanguageProvider>
  );
}

export default MyApp;

