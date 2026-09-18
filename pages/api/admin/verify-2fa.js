// ==============================================================================
// ПРОВЕРКА 2FA ТОКЕНА АДМИНИСТРАТОРА (TOTP Google Authenticator)
// Файл: pages/api/admin/verify-2fa.js
// Назначение: Защищенная верификация 6-значного одноразового пароля владельца с
// генерацией подписанного JWT-токена сессии для доступа к Хост-кабинету и C&C Графу.
// ==============================================================================

import speakeasy from 'speakeasy';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Разрешаем только POST запросы для проверки токена
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { token } = req.body;
  const appSecret = process.env.NEXT_PUBLIC_ADMIN_2FA_SECRET;

  if (!appSecret) {
    return res.status(400).json({ success: false, error: 'error_2fa_secret_not_found' });
  }

  if (!token) {
    return res.status(400).json({ success: false, error: 'error_token_empty' });
  }

  try {
    // Верификация одноразового пароля с окном в 2 шага по 30 сек (для компенсации рассинхронизации часов)
    const verified = speakeasy.totp.verify({
      secret: appSecret,
      encoding: 'base32',
      token: String(token).trim(),
      window: 2
    });

    if (verified) {
      // Выпуск подписанного JWT токена с ролью владельца (срок жизни 12 часов)
      const sessionToken = jwt.sign(
        { role: 'owner', permissions: ['calendar_manage', 'reservations_manage', 'chat_superhost'] },
        appSecret,
        { expiresIn: '12h' }
      );

      return res.status(200).json({ success: true, sessionToken });
    } else {
      return res.status(400).json({ success: false, error: 'error_invalid_2fa' });
    }
  } catch (error) {
    console.error('Ошибка верификации 2FA:', error);
    return res.status(500).json({ success: false, error: 'internal_2fa_error' });
  }
}

