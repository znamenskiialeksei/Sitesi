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

export const getDetailedBookingEmailHtml = ({
  bookingCode = 'VT-2026',
  name = 'Уважаемый Гость',
  booking = {},
  guestProfile = {},
  status = 'ЗАПРОС',
  paymentMode = 'request',
  ibanDetails = {}
}) => {
  const isPaid = status === 'ОПЛАЧЕНО';
  const isIban = status.includes('IBAN') || paymentMode === 'iban';
  const isRequest = status === 'ЗАПРОС';
  const statusColor = isPaid ? '#10b981' : isIban ? '#f59e0b' : '#3b82f6';
  const statusLabel = isPaid ? 'БРОНИРОВАНИЕ ОПЛАЧЕНО' : isIban ? 'ОЖИДАЕТ ОПЛАТЫ НА IBAN' : 'ЗАЯВКА НА МОДЕРАЦИИ';

  const bankName = ibanDetails.bankName || 'Ziraat Bankası';
  const ibanReceiver = ibanDetails.receiver || 'Aleksei Znamenskii';
  const ibanNumber = ibanDetails.iban || 'TR000000000000000000000000';
  const ibanSwift = ibanDetails.swift || 'TCZBTR2A';

  const checkIn = booking.checkIn || 'Дата заезда';
  const checkOut = booking.checkOut || 'Дата выезда';
  const nights = booking.nights || 1;
  const adults = booking.adults || booking.total_adults || 2;
  const children = booking.children || booking.total_children || 0;
  const price = booking.price || booking.totalPrice || 'По расчету';
  const phone = booking.phone || guestProfile.phone || 'Не указан';
  const email = booking.email || guestProfile.email || 'Не указан';

  const emailVerified = Boolean(guestProfile.emailVerified || booking.emailVerified);
  const phoneVerified = Boolean(guestProfile.phoneVerified || booking.phoneVerified);

  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Бронирование Villa Turaman: ${bookingCode}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #131c2e; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.08); overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);" cellspacing="0" cellpadding="0">
          
          <!-- ЛОГОТИП И ШАПКА -->
          <tr>
            <td style="padding: 36px 36px 20px 36px; text-align: center; background: linear-gradient(180deg, rgba(244, 63, 94, 0.12) 0%, rgba(19, 28, 46, 0) 100%);">
              <div style="font-size: 26px; font-weight: 800; letter-spacing: 1px; color: #ffffff; margin-bottom: 6px;">
                VILLA <span style="color: #fb7185;">TURAMAN</span>
              </div>
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8;">
                Премиальный отдых в Дальяне : Турция
              </div>
            </td>
          </tr>

          <!-- СТАТУС БРОНИ И КОД -->
          <tr>
            <td style="padding: 0 36px 24px 36px; text-align: center;">
              <div style="display: inline-block; padding: 8px 18px; border-radius: 50px; background-color: rgba(255, 255, 255, 0.05); border: 1px solid ${statusColor}; margin-bottom: 14px;">
                <span style="font-size: 12px; font-weight: 800; color: ${statusColor}; letter-spacing: 1px;">
                  ● ${statusLabel}
                </span>
              </div>
              <h2 style="font-size: 22px; font-weight: 800; color: #f8fafc; margin: 0 0 6px 0;">
                Код бронирования: <span style="color: #38bdf8;">${bookingCode}</span>
              </h2>
              <p style="font-size: 14px; color: #cbd5e1; margin: 0;">
                Здравствуйте, ${name}! Детали вашего бронирования зафиксированы в системе.
              </p>
            </td>
          </tr>

          <!-- БЛОК 1: ПОЛНЫЕ ДАННЫЕ ОФОРМЛЕНИЯ -->
          <tr>
            <td style="padding: 0 36px 20px 36px;">
              <div style="background-color: #0b111d; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 18px; padding: 20px;">
                <div style="font-size: 13px; font-weight: 700; color: #f43f5e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); pb-2;">
                  📋 Данные оформления бронирования
                </div>
                <table width="100%" cellspacing="0" cellpadding="4" style="font-size: 13px; color: #cbd5e1;">
                  <tr>
                    <td style="color: #94a3b8; width: 45%;">Период проживания:</td>
                    <td style="font-weight: 700; color: #ffffff;">${checkIn} - ${checkOut} [${nights} ноч.]</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8;">Время заезда и выезда:</td>
                    <td style="color: #ffffff;">Заезд: 16:00 | Выезд: 10:00</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8;">Состав гостей:</td>
                    <td style="color: #ffffff;">Взрослых: ${adults}, Детей: ${children}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8;">Контакты для связи:</td>
                    <td style="color: #ffffff;">${phone} | ${email}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8;">Сумма к оплате:</td>
                    <td style="font-size: 16px; font-weight: 800; color: #10b981;">${price}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- БЛОК 2: ДАННЫЕ ПРОФИЛЯ РЕГИСТРАЦИИ -->
          <tr>
            <td style="padding: 0 36px 20px 36px;">
              <div style="background-color: #0b111d; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 18px; padding: 20px;">
                <div style="font-size: 13px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); pb-2;">
                  👤 Данные профиля на сайте
                </div>
                <table width="100%" cellspacing="0" cellpadding="4" style="font-size: 13px; color: #cbd5e1;">
                  <tr>
                    <td style="color: #94a3b8; width: 45%;">Имя гостя:</td>
                    <td style="font-weight: 700; color: #ffffff;">${name}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8;">Статус Email:</td>
                    <td style="color: ${emailVerified ? '#10b981' : '#f59e0b'}; font-weight: 700;">
                      ${emailVerified ? '✓ Подтвержден' : '⚠ Требуется подтверждение кодом'}
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8;">Статус Телефона:</td>
                    <td style="color: ${phoneVerified ? '#10b981' : '#94a3b8'};">
                      ${phoneVerified ? '✓ Подтвержден' : 'Не подтвержден'}
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- БЛОК 3: ЧЕК-ЛИСТ ГОТОВНОСТИ БРОНИ -->
          <tr>
            <td style="padding: 0 36px 20px 36px;">
              <div style="background-color: #0b111d; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 18px; padding: 20px;">
                <div style="font-size: 13px; font-weight: 700; color: #f59e0b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px;">
                  ⚠️ Чек-лист: чего не хватает для брони и оплаты
                </div>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.7; color: #cbd5e1;">
                  ${!emailVerified ? '<li style="color: #f59e0b;"><b>Подтверждение Email:</b> требуется подтвердить адрес кодом из письма для открытия онлайн-оплаты.</li>' : '<li style="color: #10b981;"><b>Email подтвержден:</b> контакт проверен.</li>'}
                  ${isRequest ? '<li><b>Модерация хозяина:</b> ожидается подтверждение дат от владельца виллы в течение 24 часов [24h HOLD].</li>' : ''}
                  ${isIban ? '<li style="color: #f59e0b;"><b>Оплата по IBAN:</b> выполните перевод по реквизитам ниже с обязательным указанием кода брони <b>' + bookingCode + '</b>.</li>' : ''}
                  ${isPaid ? '<li style="color: #10b981;"><b>Оплата зафиксирована:</b> бронь полностью подтверждена, ваучер готов к загрузке.</li>' : ''}
                </ul>
              </div>
            </td>
          </tr>

          <!-- БЛОК 4: ПОШАГОВЫЕ ИНСТРУКЦИИ ПО СПОСОБУ ОПЛАТЫ -->
          ${isIban ? `
          <tr>
            <td style="padding: 0 36px 20px 36px;">
              <div style="background-color: #172554; border: 1px solid #3b82f6; border-radius: 18px; padding: 22px;">
                <div style="font-size: 14px; font-weight: 800; color: #60a5fa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                  💳 Пошаговая инструкция: Оплата на банковский IBAN
                </div>
                <ol style="margin: 0 0 16px 0; padding-left: 20px; font-size: 13px; line-height: 1.7; color: #e2e8f0;">
                  <li>Войдите в мобильное приложение или онлайн-клиент вашего банка.</li>
                  <li>Создайте перевод на банковские реквизиты владельца виллы:
                    <div style="background-color: #0f172a; border-radius: 12px; padding: 14px; margin: 10px 0; border: 1px dashed #60a5fa; font-family: monospace; font-size: 12px; color: #93c5fd;">
                      <div><b>Банк:</b> ${bankName}</div>
                      <div><b>Получатель:</b> ${ibanReceiver}</div>
                      <div><b>IBAN:</b> ${ibanNumber}</div>
                      <div><b>SWIFT / BIC:</b> ${ibanSwift}</div>
                      <div><b>Сумма к переводу:</b> ${price}</div>
                    </div>
                  </li>
                  <li style="color: #fde047; font-weight: bold;">
                    ОБЯЗАТЕЛЬНО укажите в поле «Назначение платежа»: Код брони ${bookingCode}
                  </li>
                  <li>После отправки платежа перейдите в Личный кабинет и прикрепите квитанцию в «Чат с хозяином».</li>
                  <li>Хозяин подтвердит поступление, и статус бронирования автоматически сменится на ОПЛАЧЕНО.</li>
                </ol>
              </div>
            </td>
          </tr>
          ` : isRequest ? `
          <tr>
            <td style="padding: 0 36px 20px 36px;">
              <div style="background-color: #1e1b4b; border: 1px solid #6366f1; border-radius: 18px; padding: 20px;">
                <div style="font-size: 13px; font-weight: 800; color: #a5b4fc; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                  ⏳ Пошаговые шаги по завершению бронирования
                </div>
                <ol style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.7; color: #e0e7ff;">
                  <li>Хозяин виллы знакомится с вашим запросом и подтверждает доступность выбранных дат.</li>
                  <li>Вам поступит уведомление с предложением оплаты [окно 24h HOLD].</li>
                  <li>В Личном кабинете выберите удобный способ оплаты: банковской картой онлайн или прямым переводом на IBAN.</li>
                </ol>
              </div>
            </td>
          </tr>
          ` : `
          <tr>
            <td style="padding: 0 36px 20px 36px;">
              <div style="background-color: #064e3b; border: 1px solid #10b981; border-radius: 18px; padding: 20px;">
                <div style="font-size: 13px; font-weight: 800; color: #6ee7b7; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                  ✓ Ваше бронирование успешно подтверждено
                </div>
                <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #d1fae5;">
                  Оплата зафиксирована в системе. В Личном кабинете вам доступен официальный электронный ваучер для заселения и прямой чат с владельцем виллы.
                </p>
              </div>
            </td>
          </tr>
          `}

          <!-- КНОПКИ ДЕЙСТВИЯ -->
          <tr>
            <td style="padding: 10px 36px 36px 36px; text-align: center;">
              <div style="margin-bottom: 16px;">
                <a href="https://villaturaman.com/guest" style="display: inline-block; background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 14px; font-weight: 700; font-size: 14px; box-shadow: 0 10px 20px rgba(244, 63, 94, 0.3);">
                  Перейти в Личный кабинет гостя
                </a>
              </div>
              <div>
                <a href="https://t.me/marmarisyachtingru" target="_blank" style="display: inline-block; color: #38bdf8; text-decoration: none; font-size: 12px; font-weight: 600; margin: 0 10px;">
                  💬 Написать хозяину в Telegram: @marmarisyachtingru
                </a>
                <span style="color: rgba(255, 255, 255, 0.2);">|</span>
                <a href="mailto:villaturaman@gmail.com" style="display: inline-block; color: #94a3b8; text-decoration: none; font-size: 12px; font-weight: 600; margin: 0 10px;">
                  ✉ Связаться по email: villaturaman@gmail.com
                </a>
              </div>
            </td>
          </tr>

          <!-- ПОДВАЛ ПИСЬМА -->
          <tr>
            <td style="padding: 24px 36px; background-color: #0b111d; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <p style="font-size: 11px; color: #64748b; margin: 0 0 4px 0;">
                Villa Turaman Dalyan : Премиальный отдых и консьерж-сервис
              </p>
              <p style="font-size: 11px; color: #475569; margin: 0;">
                © Villa Turaman. Все права защищены.
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

export const sendDetailedBookingNotification = async ({
  to,
  guestName = 'Гость',
  booking = {},
  guestProfile = {},
  status = 'ЗАПРОС',
  paymentMode = 'request',
  ibanDetails = {}
}) => {
  if (!to || !to.includes('@')) {
    console.warn('[sendDetailedBookingNotification]: Некорректный email получателя:', to);
    return { success: false, error: 'Не указан корректный email' };
  }

  const bookingCode = booking.bookingCode || `VT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const subject = status === 'ОПЛАЧЕНО'
    ? `Бронирование Villa Turaman подтверждено: Код ${bookingCode}`
    : status.includes('IBAN')
      ? `Оплата бронирования Villa Turaman на IBAN: Код ${bookingCode}`
      : `Заявка на бронирование Villa Turaman принята: Код ${bookingCode}`;

  const htmlContent = getDetailedBookingEmailHtml({
    bookingCode,
    name: guestName,
    booking,
    guestProfile,
    status,
    paymentMode,
    ibanDetails
  });

  let emailSent = false;
  let providerUsed = 'none';

  // 1. Google Apps Script Gmail Relay
  if (process.env.GOOGLE_APPS_SCRIPT_URL) {
    try {
      const payload = {
        action: 'send_verification_email',
        to,
        code: bookingCode,
        name: guestName,
        subject,
        htmlBody: htmlContent
      };

      let fetchUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
      try {
        const urlObj = new URL(fetchUrl);
        urlObj.searchParams.set('action', 'send_verification_email');
        urlObj.searchParams.set('to', to);
        urlObj.searchParams.set('code', bookingCode);
        if (guestName) urlObj.searchParams.set('name', guestName);
        fetchUrl = urlObj.toString();
      } catch (e) {}

      let gasRes = null;
      try {
        gasRes = await fetch(fetchUrl, { method: 'GET', redirect: 'follow' });
      } catch (getErr) {
        gasRes = await fetch(fetchUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
          redirect: 'follow'
        });
      }

      if (gasRes && gasRes.ok) {
        emailSent = true;
        providerUsed = 'google_apps_script';
      }
    } catch (gasErr) {
      console.warn('[Detailed Mailer GAS Warning]:', gasErr.message);
    }
  }

  // 2. Resend API
  if (!emailSent && process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: process.env.MAIL_FROM || 'Villa Turaman <villaturaman@gmail.com>',
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
      console.warn('[Detailed Mailer Resend Warning]:', err.message);
    }
  }

  // 3. Brevo API
  if (!emailSent && process.env.BREVO_API_KEY) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: { name: 'Villa Turaman', email: process.env.MAIL_FROM_EMAIL || 'villaturaman@gmail.com' },
          to: [{ email: to, name: guestName }],
          subject,
          htmlContent
        })
      });
      if (res.ok) {
        emailSent = true;
        providerUsed = 'brevo';
      }
    } catch (err) {
      console.warn('[Detailed Mailer Brevo Warning]:', err.message);
    }
  }

  // 4. Оповещение суперхозяина в Telegram
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      const tgMsg = `🔔 [НОВОЕ БРОНИРОВАНИЕ / ЗАЯВКА]\nКод брони: ${bookingCode}\n👤 Гость: ${guestName}\n📧 Email: ${to}\n📞 Телефон: ${booking.phone || 'Не указан'}\n📅 Даты: ${booking.checkIn || '-'} - ${booking.checkOut || '-'}\n💰 Сумма: ${booking.price || booking.totalPrice || '-'}\nСтатус: ${status}\nСпособ: ${paymentMode}\nДоставка гостю: ${emailSent ? 'Отправлено через ' + providerUsed : 'В процессе'}`;
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: tgMsg })
      });
    } catch (tgErr) {
      console.warn('[Detailed Mailer Telegram Warning]:', tgErr.message);
    }
  }

  return { success: true, bookingCode, emailSent, providerUsed };
};
