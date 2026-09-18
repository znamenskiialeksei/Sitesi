/** @type {import('tailwindcss').Config} */
// Конфигурация Tailwind CSS для платформы Villa Turaman (Архитектура AirBnB)
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Сканирование файлов страниц
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Сканирование компонентов интерфейса
    "./context/**/*.{js,ts,jsx,tsx,mdx}", // Сканирование контекстов приложения
    "./styles/**/*.{css,scss}" // Сканирование стилей
  ],
  theme: {
    extend: {
      colors: {
        airbnb: {
          brand: '#FF385C', // Фирменный коралловый цвет AirBnB
          hover: '#E00B41', // Цвет при наведении на акцентные кнопки
          dark: '#0f172a', // Премиальный глубокий фон Slate 900
          card: '#1e293b', // Фон карточек и модальных окон Slate 800
          border: 'rgba(255, 255, 255, 0.1)', // Тонкая полупрозрачная рамка
          gold: '#f59e0b' // Золотистый цвет для звезд и Superhost
        }
      },
      boxShadow: {
        'airbnb': '0 6px 20px rgba(0,0,0,0.2)', // Элегантная объемная тень виджетов
        'card-hover': '0 12px 30px rgba(0,0,0,0.35)' // Тень при наведении карточек объектов
      }
    }
  },
  plugins: []
};

