// ==============================================================================
// ГЛАВНЫЙ КОРНЕВОЙ ПРОВАЙДЕР ПРИЛОЖЕНИЯ NEXT.JS (AIRBNB ARCHITECTURE)
// Файл: pages/_app.js
// Назначение: Объединение глобальных стилей, провайдера мультиязычности и валют,
// централизованной аутентификации гостей и хоста, а также системы Toast-уведомлений.
// ==============================================================================

import React from 'react';
import { LanguageProvider, useLanguage } from '../utils/language';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../components/Toast';
import { LegalConsentProvider } from '../context/LegalConsentContext';

// Стили календаря react-datepicker и глобальный Tailwind CSS с поддержкой кастомных скроллбаров
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/globals.css';

// Динамическая инъекция стилей и дизайн-токенов из Google Таблицы
function DynamicThemeInjector() {
  const { theme } = useLanguage();
  if (!theme) return null;

  return (
    <style id="google-sheets-theme-styles">{`
      :root {
        --color-primary: ${theme.primaryColor || '#f43f5e'};
        --color-secondary: ${theme.secondaryColor || '#fb7185'};
        --color-accent: ${theme.accentColor || '#e11d48'};
        --color-bg-main: ${theme.bgColor || '#0f172a'};
        --color-card-bg: ${theme.cardBg || '#1e293b'};
        --color-text-main: ${theme.textPrimary || '#f8fafc'};
        --color-text-muted: ${theme.textSecondary || '#94a3b8'};
        --theme-radius: ${theme.borderRadius || '1.5rem'};
        --theme-font: ${theme.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'};
      }
    `}</style>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    // Провайдер языка, валют и живого словаря Google Таблицы [RU, EN, TR]
    <LanguageProvider>
      <DynamicThemeInjector />
      {/* Провайдер сквозных юридических согласий [KVKK, Договор, Конфиденциальность] */}
      <LegalConsentProvider>
        {/* Провайдер авторизации и ролей [Гость / Владелец с 2FA сессией] */}
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

