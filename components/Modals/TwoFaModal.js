// ==============================================================================
// МОДАЛЬНОЕ ОКНО ДВУХФАКТОРНОЙ АУТЕНТИФИКАЦИИ ВЛАДЕЛЬЦА (2FA TOTP)
// Файл: components/Modals/TwoFaModal.js
// Назначение: Защита панели управления хозяина через Google Authenticator
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Shield, KeyRound, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';

export default function TwoFaModal() {
  const { twoFaModalOpen, setTwoFaModalOpen, verify2FA, pendingHostUser } = useAuth();
  const toast = useToast();

  const [token, setToken] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const twoFaSecret = process.env.NEXT_PUBLIC_ADMIN_2FA_SECRET || 'BASE32SECRET32323232323232323232';

  // Динамическая генерация QR-кода при открытии модального окна
  useEffect(() => {
    if (twoFaModalOpen && twoFaSecret) {
      import('qrcode').then((QRCode) => {
        const otpauthUrl = `otpauth://totp/VillaTuraman:Owner?secret=${twoFaSecret}&issuer=VillaTuraman`;
        QRCode.toDataURL(otpauthUrl, (err, url) => {
          if (!err) setQrCodeUrl(url);
        });
      });
    }
  }, [twoFaModalOpen, twoFaSecret]);

  if (!twoFaModalOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (token.length !== 6) {
      toast.warn('Код подтверждения должен состоять из 6 цифр.');
      return;
    }

    setLoading(true);
    try {
      const res = await verify2FA(token);
      if (res.success) {
        toast.success('2FA верификация пройдена! Добро пожаловать в панель хозяина.');
      } else {
        toast.error('Неверный 2FA код. Попробуйте снова.');
      }
    } catch (err) {
      toast.error('Ошибка проверки 2FA кода.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 fade-in">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center">
        
        <button
          onClick={() => setTwoFaModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
          <Shield className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          2FA Аутентификация владельца
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Откройте Google Authenticator и введите 6-значный одноразовый код
        </p>

        {qrCodeUrl && (
          <div className="bg-white p-3 rounded-2xl w-40 h-40 mx-auto mb-5 shadow-lg flex items-center justify-center">
            <img src={qrCodeUrl} alt="2FA QR Code" className="w-full h-full object-contain" />
          </div>
        )}

        <div className="text-[11px] text-slate-400 mb-6 bg-slate-800/80 p-3 rounded-xl border border-white/5 font-mono select-all">
          Секретный ключ: <span className="text-amber-300 font-bold">{twoFaSecret}</span>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative">
            <KeyRound className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              maxLength={6}
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              autoFocus
              className="w-full bg-slate-800 border border-white/10 text-center tracking-[0.5em] text-2xl font-bold text-white py-3 rounded-2xl focus:border-amber-400 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || token.length !== 6}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Проверка...' : 'Подтвердить вход'}
          </button>
        </form>

      </div>
    </div>
  );
}

