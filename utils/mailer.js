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

  // 1. Попытка отправки через Resend API если задан RESEND_API_KEY
  if (process.env.RESEND_API_KEY) {
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
        return { success: true, provider: 'resend' };
      }
    } catch (err) {
      console.warn('[Mailer Resend Warning]:', err.message);
    }
  }

  // 2. Попытка отправки через Brevo / Sendinblue если задан BREVO_API_KEY
  if (process.env.BREVO_API_KEY) {
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
        return { success: true, provider: 'brevo' };
      }
    } catch (err) {
      console.warn('[Mailer Brevo Warning]:', err.message);
    }
  }

  // 3. Автономный резервный канал: мгновенное дублирование в Telegram владельца
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      const tgMsg = `🔐 ВЕРИФИКАЦИЯ EMAIL (Код для гостя)\n👤 Гость: ${name || 'Гость'}\n📧 Email: ${to}\n🔢 КОД: ${code}\n⏱ Срок действия: 10 минут`;
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: tgMsg })
      });
    } catch (tgErr) {
      console.warn('[Mailer Telegram Warning]:', tgErr.message);
    }
  }

  console.log(`[AUTH CODE EMAIL]: Для ${to} (${name}) сгенерирован код: ${code}`);
  return { success: true, provider: 'telegram_fallback', code };
};

export const sendPhoneVerificationCode = async ({ phone, code, name }) => {
  // Отправка SMS-сообщения или кода в Telegram владельца для тестирования
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      const tgMsg = `📱 ВЕРИФИКАЦИЯ ТЕЛЕФОНА (Код для гостя)\n👤 Гость: ${name || 'Гость'}\n📞 Телефон: ${phone}\n🔢 КОД: ${code}\n⏱ Срок действия: 10 минут`;
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: tgMsg })
      });
    } catch (tgErr) {
      console.warn('[Phone SMS Telegram Warning]:', tgErr.message);
    }
  }

  console.log(`[AUTH CODE PHONE]: Для ${phone} (${name}) сгенерирован код: ${code}`);
  return { success: true, provider: 'sms_fallback', code };
};
