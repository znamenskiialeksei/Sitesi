// ==============================================================================
// КОНТЕКСТ АВТОРИЗАЦИИ И СЕССИЙ VILLA TURAMAN (AIRBNB PLATFORM)
// Файл: context/AuthContext.js
// Назначение: Управление состоянием пользователей, 2FA защитой владельца и переключением ролей
// ==============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingHostUser, setPendingHostUser] = useState(null);
  const [activeRoleMode, setActiveRoleMode] = useState('traveler'); // 'traveler' или 'host'
  const [authLoading, setAuthLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' или 'register'
  const [twoFaModalOpen, setTwoFaModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Восстановление сессии при инициализации
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem('villa_user');
      const ownerSession = localStorage.getItem('owner_session');

      if (savedUserStr) {
        const user = JSON.parse(savedUserStr);
        if (user && user.isHost) {
          if (ownerSession) {
            setCurrentUser(user);
            setActiveRoleMode('host');
          } else {
            // Требуется 2FA верификация
            setPendingHostUser(user);
          }
        } else if (user) {
          setCurrentUser(user);
          setActiveRoleMode('traveler');
        }
      }
    } catch (err) {
      console.warn('Ошибка восстановления сессии:', err);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Вход в систему (гость или владелец)
  const login = async (contact, password) => {
    try {
      const res = await axios.post('/api/booking', {
        action: 'login',
        contact: contact.trim(),
        password: password.trim()
      });

      if (res.data && res.data.success) {
        const user = res.data.user;
        if (user.isHost) {
          const ownerSession = localStorage.getItem('owner_session');
          if (ownerSession) {
            localStorage.setItem('villa_user', JSON.stringify(user));
            setCurrentUser(user);
            setActiveRoleMode('host');
            return { success: true, isHost: true, requires2FA: false };
          } else {
            setPendingHostUser(user);
            setTwoFaModalOpen(true);
            return { success: true, isHost: true, requires2FA: true };
          }
        } else {
          localStorage.setItem('villa_user', JSON.stringify(user));
          setCurrentUser(user);
          setActiveRoleMode('traveler');
          return { success: true, isHost: false };
        }
      } else {
        return { success: false, error: res.data?.error || 'error_invalid_login', blockType: res.data?.blockType };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  // Регистрация нового гостя
  const register = async (name, contact, password) => {
    try {
      const res = await axios.post('/api/booking', {
        action: 'register',
        name: name.trim(),
        contact: contact.trim(),
        password: (password || '123456').trim()
      });

      if (res.data && res.data.success) {
        const user = res.data.user;
        localStorage.setItem('villa_user', JSON.stringify(user));
        setCurrentUser(user);
        setActiveRoleMode('traveler');
        return { success: true, user };
      } else {
        return { success: false, error: res.data?.error || 'error_registration' };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  // Верификация 2FA для хозяина виллы
  const verify2FA = async (token) => {
    try {
      const res = await axios.post('/api/admin/verify-2fa', { token });
      if (res.data && res.data.success) {
        localStorage.setItem('owner_session', res.data.sessionToken);
        if (pendingHostUser) {
          localStorage.setItem('villa_user', JSON.stringify(pendingHostUser));
          setCurrentUser(pendingHostUser);
          setPendingHostUser(null);
        }
        setActiveRoleMode('host');
        setTwoFaModalOpen(false);
        return { success: true };
      } else {
        return { success: false, error: res.data?.error || 'error_2fa_verification' };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  // Мгновенная прямая авторизация гостя (при бронировании или первом сообщении хозяину)
  const loginGuestDirectly = (userObj) => {
    if (!userObj) return;
    try {
      localStorage.setItem('villa_user', JSON.stringify(userObj));
      setCurrentUser(userObj);
      setActiveRoleMode('traveler');
    } catch (e) {
      console.warn('Ошибка прямой авторизации гостя:', e);
    }
  };

  // Выход из системы
  const logout = () => {
    localStorage.removeItem('villa_user');
    localStorage.removeItem('owner_session');
    setCurrentUser(null);
    setPendingHostUser(null);
    setActiveRoleMode('traveler');
  };

  // Переключение режима Хозяин / Гость в шапке сайта (AirBnB style)
  const toggleRoleMode = () => {
    if (currentUser?.isHost) {
      setActiveRoleMode((prev) => (prev === 'host' ? 'traveler' : 'host'));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginGuestDirectly,
        authLoading,
        activeRoleMode,
        setActiveRoleMode,
        toggleRoleMode,
        login,
        register,
        verify2FA,
        logout,
        authModalOpen,
        setAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        twoFaModalOpen,
        setTwoFaModalOpen,
        contactModalOpen,
        setContactModalOpen,
        pendingHostUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

