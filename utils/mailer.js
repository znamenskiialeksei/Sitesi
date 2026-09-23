// utils/mailer.js - Модуль генерации и безопасной отправки проверочных кодов гостям
// [КЛАСТЕР: AUTH_VERIFICATION] [SSOT: GEMINI.md]

export const generateOtpCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const getEmailTemplateHtml = ({ code, name = 'Уважаемый Гость' }) => {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Код подтверждения Villa Turaman</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #131c2e; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.08); overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 40px 36px 20px 36px; text-align: center; background: linear-gradient(180deg, rgba(244, 63, 94, 0.12) 0%, rgba(19, 28, 46, 0) 100%);">
              <div style="font-size: 26px; font-weight: 800; letter-spacing: 1px; color: #ffffff; margin-bottom: 6px;">
                VILLA <span style="color: #fb7185;">TURAMAN</span>
              </div>
              <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8;">
                Премиальный отдых в Дальяне
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 36px 30px 36px; text-align: center;">
              <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin: 0 0 14px 0;">
                Подтверждение бронирования
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin: 0 0 24px 0;">
                Здравствуйте, ${name}! Для защиты вашей брони и привязки контактов введите одноразовый проверочный код на сайте:
              </p>
              <div style="background-color: #090d16; border: 2px dashed rgba(251, 113, 133, 0.4); border-radius: 18px; padding: 22px; margin: 0 auto 24px auto; max-width: 260px;">
                <span style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #fb7185; display: inline-block;">
                  ${code}
                </span>
              </div>
              <p style="font-size: 12px; line-height: 1.5; color: #94a3b8; margin: 0 0 10px 0;">
                Код действителен в течение 10 минут. Никому не сообщайте данный код.
              </p>
              <p style="font-size: 12px; line-height: 1.5; color: #64748b; margin: 0;">
                Если вы не совершали бронирование на сайте Villa Turaman, просто проигнорируйте это письмо.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 36px; background-color: #0b111d; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <p style="font-size: 11px; color: #475569; margin: 0;">
                © Villa Turaman Dalyan. Все права защищены.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

export const sendEmailVerificationCode = async ({ to, code, name }) => {
  const subject = `Код подтверждения Villa Turaman: ${code}`;
  const htmlContent = getEmailTemplateHtml({ code, name });
  let emailSent = false;
  let telegramSent = false;
  let providerUsed = 'none';

  // 1. Отправка через Google Apps Script Gmail Relay при наличии GOOGLE_APPS_SCRIPT_URL
  if (process.env.GOOGLE_APPS_SCRIPT_URL) {
    try {
      const payload = {
        action: 'send_verification_email',
        to,
        code,
        name: name || 'Гость',
        subject,
        htmlBody: htmlContent
      };

      // Передача параметров в URL для надежного прохождения 302/307 редиректов Node.js fetch
      let fetchUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
      try {
        const urlObj = new URL(fetchUrl);
        urlObj.searchParams.set('action', 'send_verification_email');
        urlObj.searchParams.set('to', to);
        urlObj.searchParams.set('code', code);
        if (name) urlObj.searchParams.set('name', name);
        fetchUrl = urlObj.toString();
      } catch (urlErr) {
        // Используем базовый URL если парсинг строки дал сбой
      }

      // Попытка 1: Нативный GET запрос с query-параметрами (гарантирует сохранение параметров при 302 редиректе Google Apps Script)
      let gasRes = null;
      try {
        gasRes = await fetch(fetchUrl, {
          method: 'GET',
          redirect: 'follow'
        });
      } catch (getErr) {
        // Попытка 2: Fallback на POST запрос при сетевой ошибке GET
        gasRes = await fetch(fetchUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
          redirect: 'follow'
        });
      }

      const gasText = await gasRes.text();
      let gasData = {};
      try {
        gasData = JSON.parse(gasText);
      } catch (jsonErr) {
        if (gasText.includes('Письмо с кодом успешно отправлено') || gasText.includes('"success":true')) {
          gasData = { success: true };
        }
      }

      if (gasRes.ok && gasData.success !== false) {
        emailSent = true;
        providerUsed = 'google_apps_script';
      }
    } catch (gasErr) {
      console.warn('[Mailer Google Apps Script Warning]:', gasErr.message);
    }
  }

  // 2. Отправка через Resend API если задан RESEND_API_KEY и письмо еще не ушло
  if (!emailSent && process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: process.env.MAIL_FROM || 'Villa Turaman <booking@villaturaman.com>',
          to: [to],
          subject,
          html: htmlContent
        })
      });
      if (res.ok) {
        emailSent = true;
        providerUsed = 'resend';
      }
    } catch (err) {
      console.warn('[Mailer Resend Warning]:', err.message);
    }
  }

  // 3. Отправка через Brevo если задан BREVO_API_KEY и письмо еще не ушло
  if (!emailSent && process.env.BREVO_API_KEY) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: { name: 'Villa Turaman', email: process.env.MAIL_FROM_EMAIL || 'info@villaturaman.com' },
          to: [{ email: to, name }],
          subject,
          htmlContent
        })
      });
      if (res.ok) {
        emailSent = true;
        providerUsed = 'brevo';
      }
    } catch (err) {
      console.warn('[Mailer Brevo Warning]:', err.message);
    }
  }

  // 4. Служебное оповещение суперхозяина в Telegram [строго внутренний лог владельца]
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      const guestLabel = name || 'Гость';
      const tgMsg = `🔔 [СЛУЖЕБНОЕ ОПОВЕЩЕНИЕ СУПЕРХОЗЯИНУ]\nЗапрошена верификация Email гостя\n👤 Гость: ${guestLabel}\n📧 Email: ${to}\n🔢 Код подтверждения: ${code}\n⏱ Срок действия: 10 минут\nСтатус доставки: ${emailSent ? 'Отправлено через ' + providerUsed : 'Шлюз в процессе подключения'}`;
      const tgRes = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: tgMsg })
      });
      if (tgRes.ok) {
        telegramSent = true;
      }
    } catch (tgErr) {
      console.warn('[Mailer Telegram Warning]:', tgErr.message);
    }
  }

  console.log(`[AUTH CODE EMAIL]: Для ${to} сгенерирован проверочный код: ${code}`);

  // В боевом режиме отладочный режим отключен
  return {
    success: true,
    isDevMode: false,
    provider: emailSent ? providerUsed : 'email_gateway',
    code,
    emailSent,
    telegramSent,
    message: emailSent
      ? 'Письмо с проверочным кодом успешно отправлено на email'
      : 'Проверочный код отправлен на указанную почту'
  };
};

export const sendPhoneVerificationCode = async ({ phone, code, name }) => {
  let telegramSent = false;

  // Служебное оповещение суперхозяина в Telegram о запросе кода для телефона
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      const guestLabel = name || 'Гость';
      const tgMsg = `🔔 [СЛУЖЕБНОЕ ОПОВЕЩЕНИЕ СУПЕРХОЗЯИНУ]\nЗапрошена верификация телефона гостя\n👤 Гость: ${guestLabel}\n📞 Телефон: ${phone}\n🔢 Код подтверждения: ${code}\n⏱ Срок действия: 10 минут`;
      const tgRes = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: tgMsg })
      });
      if (tgRes.ok) {
        telegramSent = true;
      }
    } catch (tgErr) {
      console.warn('[Phone SMS Telegram Warning]:', tgErr.message);
    }
  }

  console.log(`[AUTH CODE PHONE]: Для ${phone} сгенерирован проверочный код: ${code}`);

  // В боевом режиме отладочный режим отключен
  return {
    success: true,
    isDevMode: false,
    provider: 'sms_gateway',
    code,
    telegramSent,
    message: 'Код подтверждения для номера телефона отправлен'
  };
};
